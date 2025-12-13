import { readFile } from "node:fs/promises";
import path from "node:path";

import { createWorker } from "tesseract.js";
import sharp from "sharp";

import {
  extractDateCandidateFromText,
  extractEggQuantityFromText,
  parseFrenchDate,
} from "../src/features/scanner/scan-parsing";

type Expected = {
  ddmIso: string;
  quantity: number | null;
};

function parseExpectedFromFilename(
  filename: string,
  referenceDate: Date,
): Expected | null {
  // 27-12-2025.JPG => 2025-12-27
  const full = filename.match(/(\d{2})-(\d{2})-(\d{4})/u);
  if (full) {
    const [, day, month, year] = full;
    return {
      ddmIso: `${year}-${month}-${day}`,
      quantity: null,
    };
  }

  // DCR-27-12.JPG => inferred with referenceDate
  const short = filename.match(/DCR-(\d{2})-(\d{2})/u);
  if (short) {
    const [, day, month] = short;
    const parsed = parseFrenchDate(`${day}/${month}`, "dcr", referenceDate);
    if (!parsed) return null;
    return {
      ddmIso: parsed.toISOString().split("T")[0] ?? "",
      quantity: null,
    };
  }

  return null;
}

async function preprocess(filePath: string): Promise<Buffer> {
  // Downscale to keep OCR fast while preserving small stamps/stickers.
  const input = await readFile(filePath);
  return sharp(input)
    .rotate() // respect EXIF orientation
    .resize({ width: 2200, height: 2200, fit: "inside" })
    .grayscale()
    .normalise()
    .toBuffer();
}

async function main() {
  const cwd = process.cwd();

  // Reference date used for year inference when the box prints only DD/MM.
  const referenceDate = new Date(process.env.OCR_REFERENCE_DATE ?? "2025-12-12");
  if (Number.isNaN(referenceDate.getTime())) {
    throw new Error("Invalid OCR_REFERENCE_DATE (expected ISO date)");
  }

  const images = [
    "public/images/boites-oeufs/DCR-01-01.JPG",
    "public/images/boites-oeufs/DCR-27-12.JPG",
    "public/images/boites-oeufs/01-01-2026.JPG",
    "public/images/boites-oeufs/27-12-2025.JPG",
  ];

  // Expected quantities for these fixtures (known packs).
  const quantityByFilename: Record<string, number> = {
    "DCR-01-01.JPG": 10,
    "01-01-2026.JPG": 10,
    "DCR-27-12.JPG": 12,
    "27-12-2025.JPG": 12,
  };

  const worker = await createWorker("eng");
  await worker.setParameters({
    preserve_interword_spaces: "1",
    user_defined_dpi: "300",
    tessedit_char_whitelist:
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789/.-: ",
  });

  const failures: string[] = [];

  const run = async (index: number): Promise<void> => {
    const rel = images[index];
    if (!rel) return;

    const filePath = path.join(cwd, rel);
    const filename = path.basename(rel);

    const expectedBase = parseExpectedFromFilename(filename, referenceDate);
    if (!expectedBase) {
      failures.push(`${filename}: unable to infer expected date from filename`);
      await run(index + 1);
      return;
    }

    const expected: Expected = {
      ...expectedBase,
      quantity: quantityByFilename[filename] ?? null,
    };

    const buffer = await preprocess(filePath);
    const { data } = await worker.recognize(buffer, { rotateAuto: true });
    const text = data.text.trim();

    const candidate = extractDateCandidateFromText(text);
    const parsed = candidate
      ? parseFrenchDate(candidate.dateText, candidate.dateType, referenceDate)
      : null;
    const ddmIso = parsed ? parsed.toISOString().split("T")[0] : null;
    const quantity = extractEggQuantityFromText(text);

    // eslint-disable-next-line no-console
    console.log("\n---", filename, "---");
    // eslint-disable-next-line no-console
    console.log("confidence:", data.confidence);
    // eslint-disable-next-line no-console
    console.log("text:\n", text);
    // eslint-disable-next-line no-console
    console.log("candidate:", candidate);
    // eslint-disable-next-line no-console
    console.log("ddmIso:", ddmIso, "expected:", expected.ddmIso);
    // eslint-disable-next-line no-console
    console.log("quantity:", quantity, "expected:", expected.quantity);

    if (ddmIso !== expected.ddmIso) {
      failures.push(
        `${filename}: ddm mismatch (got ${ddmIso ?? "null"}, expected ${expected.ddmIso})`,
      );
    }

    if (expected.quantity !== null && quantity !== expected.quantity) {
      failures.push(
        `${filename}: quantity mismatch (got ${quantity ?? "null"}, expected ${expected.quantity})`,
      );
    }

    await run(index + 1);
  };

  await run(0);

  await worker.terminate();

  if (failures.length > 0) {
    // eslint-disable-next-line no-console
    console.error(`\nOCR smoke failed:\n${failures.join("\n")}`);
    process.exit(1);
  }

  // eslint-disable-next-line no-console
  console.log("\nOCR smoke OK");
}

void main();
