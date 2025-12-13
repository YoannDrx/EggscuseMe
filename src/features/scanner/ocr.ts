"use client";

import type Tesseract from "tesseract.js";

type TesseractWorker = Tesseract.Worker;

type TesseractRuntime = {
  createWorker: (langs?: string | string[]) => Promise<TesseractWorker>;
  // Keep this loose because tesseract.js exports a numeric enum at runtime.
  PSM: Partial<Record<string, number>>;
};

let workerPromise: Promise<TesseractWorker> | null = null;

async function getTesseractModule(): Promise<TesseractRuntime> {
  const mod = (await import("tesseract.js")) as unknown as TesseractRuntime & {
    default?: TesseractRuntime;
  };
  return mod.default ?? mod;
}

async function getWorker(): Promise<TesseractWorker> {
  workerPromise ??= (async () => {
    const Tesseract = await getTesseractModule();
    const worker = await Tesseract.createWorker("eng");

    await worker.setParameters({
      preserve_interword_spaces: "1",
      user_defined_dpi: "300",
      // Allow digits + common separators + letters for DCR/DDM/PONDU
      tessedit_char_whitelist:
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789/.-: ×œŒ",
    });

    return worker;
  })();

  return workerPromise;
}

async function fileToImage(file: File): Promise<HTMLImageElement> {
  const url = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.decoding = "async";
    image.src = url;

    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error("Failed to load image"));
    });

    return image;
  } finally {
    URL.revokeObjectURL(url);
  }
}

type Rotation = 0 | 90 | 180 | 270;
type PreprocessMode = "contrast" | "threshold";

type CropRegion = {
  x: number;
  y: number;
  width: number;
  height: number;
};

function createCanvasForImage(
  image: HTMLImageElement,
  rotation: Rotation,
): HTMLCanvasElement {
  const targetMaxDim = 2400;
  const maxDim = Math.max(image.naturalWidth, image.naturalHeight);
  const scale = Math.min(2.5, targetMaxDim / maxDim);

  const baseWidth = Math.max(1, Math.round(image.naturalWidth * scale));
  const baseHeight = Math.max(1, Math.round(image.naturalHeight * scale));

  const rotated =
    rotation === 90 || rotation === 270
      ? { width: baseHeight, height: baseWidth }
      : { width: baseWidth, height: baseHeight };

  const canvas = document.createElement("canvas");
  canvas.width = rotated.width;
  canvas.height = rotated.height;

  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) {
    throw new Error("Canvas context not available");
  }

  context.save();
  switch (rotation) {
    case 0: {
      break;
    }
    case 90: {
      context.translate(canvas.width, 0);
      context.rotate(Math.PI / 2);
      break;
    }
    case 180: {
      context.translate(canvas.width, canvas.height);
      context.rotate(Math.PI);
      break;
    }
    case 270: {
      context.translate(0, canvas.height);
      context.rotate(-Math.PI / 2);
      break;
    }
  }

  context.drawImage(image, 0, 0, baseWidth, baseHeight);
  context.restore();

  return canvas;
}

function cropCanvas(
  source: HTMLCanvasElement,
  region: CropRegion,
): HTMLCanvasElement {
  const sx = Math.max(0, Math.round(source.width * region.x));
  const sy = Math.max(0, Math.round(source.height * region.y));
  const sw = Math.max(1, Math.round(source.width * region.width));
  const sh = Math.max(1, Math.round(source.height * region.height));

  const safeW = Math.max(1, Math.min(sw, source.width - sx));
  const safeH = Math.max(1, Math.min(sh, source.height - sy));

  const targetMaxDim = 2100;
  const maxDim = Math.max(safeW, safeH);
  const scale = Math.min(3, targetMaxDim / Math.max(1, maxDim));
  const dw = Math.max(1, Math.round(safeW * scale));
  const dh = Math.max(1, Math.round(safeH * scale));

  const canvas = document.createElement("canvas");
  canvas.width = dw;
  canvas.height = dh;

  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) {
    throw new Error("Canvas context not available");
  }

  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.drawImage(source, sx, sy, safeW, safeH, 0, 0, dw, dh);

  return canvas;
}

function preprocessCanvas(canvas: HTMLCanvasElement, mode: PreprocessMode) {
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) return;

  if (mode === "contrast") {
    const tmp = document.createElement("canvas");
    tmp.width = canvas.width;
    tmp.height = canvas.height;
    const tmpContext = tmp.getContext("2d");
    if (!tmpContext) return;

    tmpContext.drawImage(canvas, 0, 0);

    context.save();
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.filter = "grayscale(1) contrast(2.2) brightness(1.05)";
    context.drawImage(tmp, 0, 0);
    context.restore();
    return;
  }

  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  let sum = 0;
  const pixelCount = canvas.width * canvas.height;
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i] ?? 0;
    const g = data[i + 1] ?? 0;
    const b = data[i + 2] ?? 0;
    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    sum += luma;
  }

  const mean = sum / Math.max(1, pixelCount);
  const threshold = Math.max(70, Math.min(220, mean * 0.9));
  const shouldInvert = mean < 110;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i] ?? 0;
    const g = data[i + 1] ?? 0;
    const b = data[i + 2] ?? 0;
    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    const bin = luma > threshold ? 255 : 0;
    const value = shouldInvert ? 255 - bin : bin;
    data[i] = value;
    data[i + 1] = value;
    data[i + 2] = value;
    data[i + 3] = 255;
  }

  context.putImageData(imageData, 0, 0);
}

export type OcrRecognizeResult = {
  text: string;
  confidence: number;
};

type OcrVariant = {
  rotation: Rotation;
  mode: PreprocessMode;
  pageSegMode: "SPARSE_TEXT" | "SINGLE_BLOCK";
  crop?: CropRegion;
};

function scoreOcrText(text: string, confidence: number): number {
  let score = confidence;

  if (/\b(?:dcr|ocr|ddm|dop|pondu)\b/iu.test(text)) score += 12;
  if (/\b[0-9OIl|ZzSsBbGgq]{1,2}\s*[/\-.|\\]\s*[0-9OIl|ZzSsBbGgq]{1,2}\b/u.test(text))
    score += 18;
  if (/\b(?:x|×)\s*(?:6|10|12|18|24|30)\b/iu.test(text)) score += 10;
  else if (/\b(?:6|10|12|18|24|30)\b/u.test(text)) score += 6;

  return score;
}

async function recognizeWithVariant(
  worker: TesseractWorker,
  image: HTMLImageElement,
  variant: OcrVariant,
): Promise<OcrRecognizeResult> {
  const Tesseract = await getTesseractModule();
  const baseCanvas = createCanvasForImage(image, variant.rotation);
  const canvas = variant.crop ? cropCanvas(baseCanvas, variant.crop) : baseCanvas;
  preprocessCanvas(canvas, variant.mode);

  const sparse = Tesseract.PSM.SPARSE_TEXT ?? 11;
  const singleBlock = Tesseract.PSM.SINGLE_BLOCK ?? sparse;
  const psm = variant.pageSegMode === "SINGLE_BLOCK" ? singleBlock : sparse;

  await worker.setParameters({
    tessedit_pageseg_mode: psm as unknown as Tesseract.PSM,
  });

  const { data } = await worker.recognize(canvas, { rotateAuto: true });
  return {
    text: data.text,
    confidence: data.confidence,
  };
}

export async function recognizeTextFromEggBoxImage(
  file: File,
): Promise<OcrRecognizeResult> {
  if (typeof window === "undefined") {
    throw new Error("OCR is only available in the browser");
  }

  const worker = await getWorker();
  const image = await fileToImage(file);

  const baseVariants: OcrVariant[] = [
    { rotation: 0, mode: "contrast", pageSegMode: "SPARSE_TEXT" },
    { rotation: 0, mode: "threshold", pageSegMode: "SPARSE_TEXT" },
    { rotation: 0, mode: "threshold", pageSegMode: "SINGLE_BLOCK" },
  ];

  const regionCrops: CropRegion[] = [
    // Big central crop (often contains both quantity and label)
    { x: 0.1, y: 0.1, width: 0.8, height: 0.8 },
    // Left/right halves (labels often on a side)
    { x: 0.0, y: 0.1, width: 0.55, height: 0.8 },
    { x: 0.45, y: 0.1, width: 0.55, height: 0.8 },
    // Narrow vertical strip around center (stickers can be vertical)
    { x: 0.25, y: 0.05, width: 0.5, height: 0.9 },
    // Top-left (captures "x12" on many boxes)
    { x: 0.0, y: 0.0, width: 0.55, height: 0.55 },
  ];

  const rotatedVariants: OcrVariant[] = [
    { rotation: 90, mode: "threshold", pageSegMode: "SPARSE_TEXT" },
    { rotation: 180, mode: "threshold", pageSegMode: "SPARSE_TEXT" },
    { rotation: 270, mode: "threshold", pageSegMode: "SPARSE_TEXT" },
  ];

  const regionVariants: OcrVariant[] = regionCrops.flatMap((crop) => {
    const variants: OcrVariant[] = [
      { rotation: 0, mode: "threshold", pageSegMode: "SPARSE_TEXT", crop },
      { rotation: 0, mode: "threshold", pageSegMode: "SINGLE_BLOCK", crop },
    ];
    return variants;
  });

  const rotatedRegionCrops = regionCrops.slice(0, 4);
  const rotatedRegionVariants: OcrVariant[] = (
    [90, 180, 270] as const
  ).flatMap((rotation) => {
    const variants: OcrVariant[] = rotatedRegionCrops.map((crop) => ({
      rotation,
      mode: "threshold",
      pageSegMode: "SPARSE_TEXT",
      crop,
    }));
    return variants;
  });

  const tryVariants = async (variants: OcrVariant[]) => {
    const run = async (
      index: number,
      best: (OcrRecognizeResult & { score: number }) | null,
    ): Promise<(OcrRecognizeResult & { score: number }) | null> => {
      if (index >= variants.length) return best;
      const variant = variants[index];

      const result = await recognizeWithVariant(worker, image, variant);
      const score = scoreOcrText(result.text, result.confidence);
      const nextBest = !best || score > best.score ? { ...result, score } : best;

      // Early exit when we have strong signal (keeps UI snappy on mobile).
      if (nextBest.score >= 92) return nextBest;

      return run(index + 1, nextBest);
    };

    return run(0, null);
  };

  const firstPass = await tryVariants(baseVariants);
  if (!firstPass) {
    return { text: "", confidence: 0 };
  }

  let best = firstPass;

  // If OCR seems weak, try region-focused crops (sticker text is usually small).
  if (best.score < 72) {
    const regionPass = await tryVariants(regionVariants);
    if (regionPass && regionPass.score > best.score) {
      best = regionPass;
    }
  }

  // If still weak, try rotated passes (stickers are often vertical / photo rotated).
  if (best.score < 72) {
    const rotatedPass = await tryVariants([
      ...rotatedVariants,
      ...rotatedRegionVariants,
    ]);
    if (rotatedPass && rotatedPass.score > best.score) {
      best = rotatedPass;
    }
  }

  return { text: best.text, confidence: best.confidence };
}
