import { z } from "zod";

export const AI_SCAN_PROVIDERS = ["openai", "google"] as const;
export const AI_SCAN_PROVIDER_SETTINGS = ["auto", ...AI_SCAN_PROVIDERS] as const;

export type AiScanProvider = (typeof AI_SCAN_PROVIDERS)[number];
export type AiScanProviderSetting = (typeof AI_SCAN_PROVIDER_SETTINGS)[number];

export const EggDateScanOutputSchema = z.object({
  date: z.string().nullable(),
  confidence: z.number().min(0).max(1).nullable(),
  sourceLabel: z.string().nullable(),
});

export type EggDateScanOutput = z.infer<typeof EggDateScanOutputSchema>;

export function isValidIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

  const date = new Date(`${value}T00:00:00.000Z`);
  return (
    !Number.isNaN(date.getTime()) && value === date.toISOString().slice(0, 10)
  );
}

export function extractEggDateScanOutputFromText(
  text: string,
): EggDateScanOutput {
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      const parsed = EggDateScanOutputSchema.partial()
        .extend({
          date: z.string().nullable().optional(),
          confidence: z.number().min(0).max(1).nullable().optional(),
          sourceLabel: z.string().nullable().optional(),
        })
        .parse(JSON.parse(jsonMatch[0]));

      return {
        date: parsed.date ?? null,
        confidence: parsed.confidence ?? null,
        sourceLabel: parsed.sourceLabel ?? null,
      };
    } catch {
      // Fall back to ISO date extraction below.
    }
  }

  return {
    date: text.match(/\b\d{4}-\d{2}-\d{2}\b/)?.[0] ?? null,
    confidence: null,
    sourceLabel: null,
  };
}

export function normalizeProviderSetting(
  value: string | null | undefined,
): AiScanProviderSetting {
  if (value === "openai" || value === "google") return value;
  return "auto";
}

export function selectScanProviders(input: {
  configuredProvider: string | null | undefined;
  hasOpenAiKey: boolean;
  hasGoogleKey: boolean;
}): AiScanProvider[] {
  const configuredProvider = normalizeProviderSetting(input.configuredProvider);

  if (configuredProvider === "openai") {
    return input.hasOpenAiKey ? ["openai"] : [];
  }

  if (configuredProvider === "google") {
    return input.hasGoogleKey ? ["google"] : [];
  }

  return [
    ...(input.hasOpenAiKey ? (["openai"] as const) : []),
    ...(input.hasGoogleKey ? (["google"] as const) : []),
  ];
}

export function getEggDateScanPrompt(todayIsoDate: string): string {
  return [
    "You read egg box packaging photos for EggscuseMe.",
    "Extract the recommended consumption date printed on the egg box.",
    "Prioritize labels such as DCR, DDM, best-before, best before, a consommer de preference avant, or a consommer avant.",
    "Ignore laying dates, packing dates, lot numbers, producer codes, barcodes, prices, and nutrition values.",
    `Today is ${todayIsoDate}. If the printed year is two digits, infer the nearest plausible best-before date for an egg box, preferably today or in the future.`,
    "Return only this object: {\"date\":\"YYYY-MM-DD\"|null,\"confidence\":0..1|null,\"sourceLabel\":string|null}.",
    "If the recommended consumption date is not readable, return date null.",
  ].join("\n");
}
