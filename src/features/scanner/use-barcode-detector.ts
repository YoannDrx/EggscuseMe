"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { BarcodeDetector as BarcodeDetectorPolyfill } from "barcode-detector/pure";

type BarcodeFormat = "ean_13" | "ean_8" | "code_128" | "code_39" | "qr_code";

type DetectedBarcode = {
  rawValue: string;
  format: BarcodeFormat;
  boundingBox?: DOMRectReadOnly;
};

type UseBarcodeDetectorOptions = {
  formats?: BarcodeFormat[];
  onDetect?: (barcodes: DetectedBarcode[]) => void;
  enabled?: boolean;
};

type UseBarcodeDetectorReturn = {
  isSupported: boolean;
  isScanning: boolean;
  error: string | null;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  startScanning: () => Promise<void>;
  stopScanning: () => void;
  lastDetected: DetectedBarcode | null;
};

// Declare BarcodeDetector for TypeScript
declare global {
  type BarcodeDetectorType = {
    getSupportedFormats?: () => Promise<string[]>;
    new (options?: { formats: string[] }): {
      detect: (source: ImageBitmapSource) => Promise<DetectedBarcode[]>;
    };
  };

  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Window {
    BarcodeDetector?: BarcodeDetectorType;
  }
}

/**
 * Get the best available BarcodeDetector (native or polyfill)
 * Native API is preferred when available as it's faster
 */
function getBarcodeDetectorClass(): BarcodeDetectorType | null {
  // Check if native BarcodeDetector is available
  if ("BarcodeDetector" in window && window.BarcodeDetector) {
    return window.BarcodeDetector;
  }

  // Fall back to polyfill (works on Safari iOS and other browsers)
  return BarcodeDetectorPolyfill as unknown as BarcodeDetectorType;
}

export function useBarcodeDetector(
  options: UseBarcodeDetectorOptions = {},
): UseBarcodeDetectorReturn {
  const t = useTranslations("scanner");
  const {
    formats = ["ean_13", "ean_8", "code_128"],
    onDetect,
    enabled = true,
  } = options;

  const [isSupported, setIsSupported] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastDetected, setLastDetected] = useState<DetectedBarcode | null>(
    null,
  );

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const detectorRef = useRef<InstanceType<
    NonNullable<typeof window.BarcodeDetector>
  > | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const detectorClassRef = useRef<BarcodeDetectorType | null>(null);

  // Check if BarcodeDetector is supported (native or polyfill)
  useEffect(() => {
    const checkSupport = async () => {
      const DetectorClass = getBarcodeDetectorClass();
      detectorClassRef.current = DetectorClass;

      if (DetectorClass) {
        try {
          const supportedFormats = await DetectorClass.getSupportedFormats?.();
          setIsSupported(supportedFormats ? supportedFormats.length > 0 : true);
        } catch {
          // Polyfill may not support getSupportedFormats, assume supported
          setIsSupported(true);
        }
      } else {
        setIsSupported(false);
      }
    };
    void checkSupport();
  }, []);

  // Detection loop
  const detectBarcodes = useCallback(async () => {
    if (
      !detectorRef.current ||
      !videoRef.current ||
      videoRef.current.readyState !== 4
    ) {
      animationFrameRef.current = requestAnimationFrame(() => {
        void detectBarcodes();
      });
      return;
    }

    try {
      const barcodes = await detectorRef.current.detect(videoRef.current);
      if (barcodes.length > 0) {
        setLastDetected(barcodes[0]);
        onDetect?.(barcodes);
      }
    } catch {
      // Silently handle detection errors during scanning
    }

    animationFrameRef.current = requestAnimationFrame(() => {
      void detectBarcodes();
    });
  }, [onDetect]);

  // Start scanning
  const startScanning = useCallback(async () => {
    if (!isSupported || !enabled) {
      setError(t("unsupportedBrowser"));
      return;
    }

    setError(null);

    try {
      // Request camera permission
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      // Create detector (native or polyfill)
      const DetectorClass = detectorClassRef.current;
      if (DetectorClass) {
        detectorRef.current = new DetectorClass({
          formats: formats as string[],
        });
      }

      setIsScanning(true);
      void detectBarcodes();
    } catch (err) {
      if (err instanceof Error) {
        if (err.name === "NotAllowedError") {
          setError(t("cameraDenied"));
        } else if (err.name === "NotFoundError") {
          setError(t("noCamera"));
        } else {
          setError(t("error", { message: err.message }));
        }
      }
    }
  }, [isSupported, enabled, formats, detectBarcodes, t]);

  // Stop scanning
  const stopScanning = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsScanning(false);
    setLastDetected(null);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopScanning();
    };
  }, [stopScanning]);

  return {
    isSupported,
    isScanning,
    error,
    videoRef,
    startScanning,
    stopScanning,
    lastDetected,
  };
}
