"use client";

import type { EggSize } from "@/generated/prisma";
import { useState } from "react";

export type VisionScanResult = {
  success: boolean;
  layingDate?: Date;
  ddm?: Date;
  confidence?: "high" | "medium" | "low";
  error?: string;
  remaining?: number;
  quantity?: number | null;
  size?: EggSize;
};

type ApiResponse = {
  success: boolean;
  layingDate?: string;
  ddm?: string | null;
  confidence?: "high" | "medium" | "low";
  error?: string;
  rawText?: string | null;
  remaining?: number;
  quantity?: number | null;
  size?: EggSize;
};

/**
 * Convert a File to base64 string (without the data: prefix)
 */
async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the "data:image/...;base64," prefix
      const base64 = result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Hook for scanning dates from egg box images using AI Vision
 *
 * @example
 * ```tsx
 * const { scanImage, isScanning } = useVisionScan();
 *
 * const handleFile = async (file: File) => {
 *   const result = await scanImage(file);
 *   if (result.success && result.layingDate) {
 *     setLayingDate(result.layingDate);
 *   }
 * };
 * ```
 */
export function useVisionScan() {
  const [isScanning, setIsScanning] = useState(false);

  const scanImage = async (file: File): Promise<VisionScanResult> => {
    setIsScanning(true);

    try {
      // Validate file type
      const validTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!validTypes.includes(file.type)) {
        return {
          success: false,
          error: "invalid_file_type",
        };
      }

      // Validate file size (5MB max)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        return {
          success: false,
          error: "file_too_large",
        };
      }

      // Convert to base64
      const base64 = await fileToBase64(file);

      // Determine mimeType
      const mimeType = file.type as "image/jpeg" | "image/png" | "image/webp";

      // Call the API
      const response = await fetch("/api/scan/date-vision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: base64,
          mimeType,
          clientNowIso: new Date().toISOString(),
          clientTimezoneOffsetMinutes: new Date().getTimezoneOffset(),
        }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          return {
            success: false,
            error: "rate_limit_exceeded",
          };
        }
        if (response.status === 413) {
          return {
            success: false,
            error: "file_too_large",
          };
        }
        return {
          success: false,
          error: "api_error",
        };
      }

      const data = (await response.json()) as ApiResponse;

      if (data.success && data.layingDate) {
        return {
          success: true,
          layingDate: new Date(data.layingDate),
          ddm: data.ddm ? new Date(data.ddm) : undefined,
          confidence: data.confidence,
          remaining: data.remaining,
          quantity: data.quantity,
          size: data.size,
        };
      } else {
        return {
          success: false,
          error: data.error ?? "unknown_error",
          remaining: data.remaining,
        };
      }
    } catch {
      return {
        success: false,
        error: "network_error",
      };
    } finally {
      setIsScanning(false);
    }
  };

  return { scanImage, isScanning };
}
