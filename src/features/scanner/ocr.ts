"use client";

import type Tesseract from "tesseract.js";

type TesseractWorker = Tesseract.Worker;

type TesseractRuntime = {
  createWorker: (langs?: string | string[]) => Promise<TesseractWorker>;
  PSM: { SPARSE_TEXT: Tesseract.PSM };
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
      // Most egg boxes have sparse, short labels (sticker / stamp)
      tessedit_pageseg_mode: Tesseract.PSM.SPARSE_TEXT,
      preserve_interword_spaces: "1",
      // Allow digits + common separators + letters for DCR/DDM/PONDU
      tessedit_char_whitelist:
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789/.-: ",
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

function createPreprocessedCanvas(image: HTMLImageElement): HTMLCanvasElement {
  const targetMaxDim = 1600;
  const maxDim = Math.max(image.naturalWidth, image.naturalHeight);
  const scale = Math.min(2, targetMaxDim / maxDim);

  const width = Math.max(1, Math.round(image.naturalWidth * scale));
  const height = Math.max(1, Math.round(image.naturalHeight * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Canvas context not available");
  }

  // Simple preprocessing: grayscale + contrast to improve stamp readability.
  context.filter = "grayscale(1) contrast(1.6)";
  context.drawImage(image, 0, 0, width, height);
  context.filter = "none";

  return canvas;
}

export type OcrRecognizeResult = {
  text: string;
  confidence: number;
};

export async function recognizeTextFromEggBoxImage(
  file: File,
): Promise<OcrRecognizeResult> {
  if (typeof window === "undefined") {
    throw new Error("OCR is only available in the browser");
  }

  const worker = await getWorker();
  const image = await fileToImage(file);
  const canvas = createPreprocessedCanvas(image);

  const { data } = await worker.recognize(canvas, { rotateAuto: true });

  return {
    text: data.text,
    confidence: data.confidence,
  };
}
