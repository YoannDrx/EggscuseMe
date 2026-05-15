import {
  EggDateScanOutputSchema,
  extractEggDateScanOutputFromText,
  getEggDateScanPrompt,
  isValidIsoDate,
  selectScanProviders,
  type AiScanProvider,
  type EggDateScanOutput,
} from "@/features/scan/egg-date-scan";
import { env } from "@/lib/env";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import { authRoute } from "@/lib/zod-route";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const DAILY_SCAN_LIMIT = 20;
const SUPPORTED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const DEFAULT_OPENAI_VISION_MODEL = "gpt-5-mini";
const DEFAULT_GOOGLE_VISION_MODEL = "gemini-1.5-flash";

type ScanErrorCode =
  | "not_configured"
  | "missing_file"
  | "unsupported_type"
  | "file_too_large"
  | "rate_limit"
  | "no_date"
  | "invalid_date"
  | "provider_failed";

function scanError(errorCode: ScanErrorCode, error: string, status: number) {
  return NextResponse.json({ error, errorCode }, { status });
}

async function scanWithOpenAI(input: {
  base64Image: string;
  mimeType: string;
  todayIsoDate: string;
}): Promise<EggDateScanOutput> {
  const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });

  const response = await openai.responses.parse({
    model: env.OPENAI_VISION_MODEL ?? DEFAULT_OPENAI_VISION_MODEL,
    input: [
      {
        role: "system",
        content:
          "You extract a single best-before date from egg box packaging images.",
      },
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: getEggDateScanPrompt(input.todayIsoDate),
          },
          {
            type: "input_image",
            image_url: `data:${input.mimeType};base64,${input.base64Image}`,
            detail: "high",
          },
        ],
      },
    ],
    text: {
      format: zodTextFormat(EggDateScanOutputSchema, "egg_date_scan"),
    },
    max_output_tokens: 120,
  });

  const parsed = EggDateScanOutputSchema.safeParse(response.output_parsed);
  if (!parsed.success) {
    throw new Error("OpenAI scan returned invalid structured output");
  }

  return parsed.data;
}

async function scanWithGoogle(input: {
  base64Image: string;
  mimeType: string;
  todayIsoDate: string;
}): Promise<EggDateScanOutput> {
  const genAI = new GoogleGenerativeAI(env.GOOGLE_GENERATIVE_AI_API_KEY ?? "");
  const model = genAI.getGenerativeModel({
    model: env.GOOGLE_VISION_MODEL ?? DEFAULT_GOOGLE_VISION_MODEL,
  });

  const result = await model.generateContent([
    {
      text: getEggDateScanPrompt(input.todayIsoDate),
    },
    {
      inlineData: {
        mimeType: input.mimeType,
        data: input.base64Image,
      },
    },
  ]);

  return extractEggDateScanOutputFromText(result.response.text());
}

async function scanWithProvider(
  provider: AiScanProvider,
  input: {
    base64Image: string;
    mimeType: string;
    todayIsoDate: string;
  },
): Promise<EggDateScanOutput> {
  if (provider === "openai") {
    return scanWithOpenAI(input);
  }

  return scanWithGoogle(input);
}

export const POST = authRoute.handler(async (req, { ctx }) => {
  const providers = selectScanProviders({
    configuredProvider: env.AI_SCAN_PROVIDER,
    hasOpenAiKey: Boolean(env.OPENAI_API_KEY),
    hasGoogleKey: Boolean(env.GOOGLE_GENERATIVE_AI_API_KEY),
  });

  if (providers.length === 0) {
    return scanError(
      "not_configured",
      "Vision scanning is not configured",
      503,
    );
  }

  const formData = await req.formData();
  const file = formData.get("image");

  if (!(file instanceof File)) {
    return scanError("missing_file", "Image file is required", 400);
  }

  if (!SUPPORTED_TYPES.has(file.type)) {
    return scanError("unsupported_type", "Unsupported image type", 400);
  }

  if (file.size > MAX_FILE_SIZE) {
    return scanError("file_too_large", "Image is too large", 400);
  }

  const todayIsoDate = new Date().toISOString().slice(0, 10);
  const usage = await prisma.visionScanUsage.upsert({
    where: {
      userId_date: {
        userId: ctx.user.id,
        date: todayIsoDate,
      },
    },
    update: { count: { increment: 1 } },
    create: {
      userId: ctx.user.id,
      date: todayIsoDate,
      count: 1,
    },
  });

  if (usage.count > DAILY_SCAN_LIMIT) {
    return scanError("rate_limit", "Daily scan limit reached", 429);
  }

  const base64Image = Buffer.from(await file.arrayBuffer()).toString("base64");
  let lastError: unknown;

  for (const provider of providers) {
    try {
      // Provider fallback must stay ordered: OpenAI first, Google only if needed.
      // eslint-disable-next-line no-await-in-loop
      const result = await scanWithProvider(provider, {
        base64Image,
        mimeType: file.type,
        todayIsoDate,
      });
      const date = result.date?.trim() ?? null;

      if (!date) {
        return scanError("no_date", "No date found", 422);
      }

      if (!isValidIsoDate(date)) {
        return scanError("invalid_date", "Invalid date format", 422);
      }

      return {
        date,
        confidence: result.confidence,
        sourceLabel: result.sourceLabel,
        provider,
        remainingScans: Math.max(0, DAILY_SCAN_LIMIT - usage.count),
      };
    } catch (error) {
      lastError = error;
      logger.warn("Egg date scan provider failed", {
        provider,
        message: error instanceof Error ? error.message : String(error),
      });
    }
  }

  logger.error("Egg date scan failed", {
    providers,
    message: lastError instanceof Error ? lastError.message : String(lastError),
  });

  return scanError("provider_failed", "Vision scan failed", 502);
});
