"use client";

import { useCallback, useEffect, useRef, useState } from "react";

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

export function useBarcodeDetector(
  options: UseBarcodeDetectorOptions = {},
): UseBarcodeDetectorReturn {
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

  // Check if BarcodeDetector is supported
  useEffect(() => {
    const checkSupport = async () => {
      if ("BarcodeDetector" in window && window.BarcodeDetector) {
        try {
          const supportedFormats =
            await window.BarcodeDetector.getSupportedFormats?.();
          setIsSupported(supportedFormats ? supportedFormats.length > 0 : true);
        } catch {
          setIsSupported(true); // Assume supported if getSupportedFormats fails
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
      setError(
        "Le scanner de code-barres n'est pas supporté par ce navigateur",
      );
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

      // Create detector
      if (window.BarcodeDetector) {
        detectorRef.current = new window.BarcodeDetector({
          formats: formats as string[],
        });
      }

      setIsScanning(true);
      void detectBarcodes();
    } catch (err) {
      if (err instanceof Error) {
        if (err.name === "NotAllowedError") {
          setError("Accès à la caméra refusé. Veuillez autoriser l'accès.");
        } else if (err.name === "NotFoundError") {
          setError("Aucune caméra trouvée sur cet appareil.");
        } else {
          setError(`Erreur: ${err.message}`);
        }
      }
    }
  }, [isSupported, enabled, formats, detectBarcodes]);

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
