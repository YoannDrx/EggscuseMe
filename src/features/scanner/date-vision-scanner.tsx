"use client";

import { NeoButton } from "@/components/neo";
import { cn } from "@/lib/utils";
import { Eggy } from "@/features/mascot";
import {
  AlertCircle,
  Camera,
  CheckCircle,
  Loader2,
  Sparkles,
  X,
} from "lucide-react";
import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useVisionScan } from "./use-vision-scan";

type DateVisionScannerProps = {
  onDateExtracted: (layingDate: Date, ddm: Date | null) => void;
  onClose?: () => void;
  className?: string;
};

type ScanState = "idle" | "preview" | "scanning" | "success" | "error";

export function DateVisionScanner({
  onDateExtracted,
  onClose,
  className,
}: DateVisionScannerProps) {
  const t = useTranslations("scanner.vision");
  const inputRef = useRef<HTMLInputElement>(null);
  const { scanImage, isScanning } = useVisionScan();

  const [preview, setPreview] = useState<string | null>(null);
  const [scanState, setScanState] = useState<ScanState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [remaining, setRemaining] = useState<number | null>(null);

  const handleCapture = () => {
    inputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview
    const url = URL.createObjectURL(file);
    setPreview(url);
    setScanState("preview");
    setErrorMessage(null);

    // Start scanning
    setScanState("scanning");
    const result = await scanImage(file);

    if (result.remaining !== undefined) {
      setRemaining(result.remaining);
    }

    if (result.success && result.layingDate) {
      setScanState("success");
      onDateExtracted(result.layingDate, result.ddm ?? null);

      // Auto close after success
      setTimeout(() => {
        onClose?.();
      }, 1500);
    } else {
      setScanState("error");
      setErrorMessage(getErrorMessage(result.error ?? "unknown_error", t));
    }

    // Reset input for next capture
    e.target.value = "";
  };

  const handleRetry = () => {
    setPreview(null);
    setScanState("idle");
    setErrorMessage(null);
    handleCapture();
  };

  const handleReset = () => {
    setPreview(null);
    setScanState("idle");
    setErrorMessage(null);
  };

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Preview area */}
      {preview ? (
        <div className="border-neo-border relative aspect-[4/3] overflow-hidden rounded-2xl border-2 bg-black">
          <img
            src={preview}
            alt="Preview"
            className="h-full w-full object-cover"
          />

          {/* Scanning overlay */}
          {scanState === "scanning" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60">
              <Loader2 className="mb-3 size-12 animate-spin text-white" />
              <p className="text-sm font-medium text-white">{t("scanning")}</p>
            </div>
          )}

          {/* Success overlay */}
          {scanState === "success" && (
            <div className="bg-fresh-extra/30 absolute inset-0 flex flex-col items-center justify-center">
              <CheckCircle className="text-fresh-extra mb-3 size-16" />
              <p className="font-heading text-lg font-semibold text-white">
                {t("success")}
              </p>
            </div>
          )}

          {/* Error overlay */}
          {scanState === "error" && (
            <div className="bg-destructive/30 absolute inset-0 flex flex-col items-center justify-center p-4">
              <AlertCircle className="text-destructive mb-3 size-12" />
              <p className="text-center text-sm font-medium text-white">
                {errorMessage}
              </p>
            </div>
          )}

          {/* Close button */}
          <NeoButton
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 size-8 rounded-full bg-black/50 text-white hover:bg-black/70"
            onClick={handleReset}
          >
            <X className="size-4" />
          </NeoButton>
        </div>
      ) : (
        // Idle state - prompt to take photo
        <div className="border-neo-border bg-muted/30 flex aspect-[4/3] flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6">
          <Eggy mood="thinking" size="lg" className="mb-4" />
          <p className="text-muted-foreground mb-2 text-center text-sm">
            {t("helpText")}
          </p>
          <p className="text-muted-foreground/70 text-center text-xs">
            {t("helpTextDetail")}
          </p>
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-2">
        {scanState === "idle" && (
          <NeoButton
            type="button"
            variant="primary"
            className="flex-1"
            onClick={handleCapture}
            disabled={isScanning}
          >
            <Camera className="mr-2 size-5" />
            {t("scanDate")}
          </NeoButton>
        )}

        {scanState === "error" && (
          <>
            <NeoButton
              type="button"
              variant="primary"
              className="flex-1"
              onClick={handleRetry}
            >
              <Camera className="mr-2 size-5" />
              {t("retry")}
            </NeoButton>
            {onClose && (
              <NeoButton type="button" variant="outline" onClick={onClose}>
                <X className="mr-2 size-4" />
                {t("cancel")}
              </NeoButton>
            )}
          </>
        )}

        {scanState === "success" && onClose && (
          <NeoButton
            type="button"
            variant="primary"
            className="flex-1"
            onClick={onClose}
          >
            <CheckCircle className="mr-2 size-5" />
            {t("done")}
          </NeoButton>
        )}
      </div>

      {/* Remaining scans indicator */}
      {remaining !== null && (
        <div className="text-muted-foreground flex items-center justify-center gap-2 text-xs">
          <Sparkles className="size-3" />
          <span>{t("remaining", { count: remaining })}</span>
        </div>
      )}
    </div>
  );
}

/**
 * Get localized error message based on error code
 */
function getErrorMessage(
  error: string,
  t: ReturnType<typeof useTranslations<"scanner.vision">>,
): string {
  switch (error) {
    case "no_date_found":
      return t("errorNoDate");
    case "invalid_date_format":
      return t("errorInvalidFormat");
    case "rate_limit_exceeded":
      return t("errorRateLimit");
    case "file_too_large":
      return t("errorFileTooLarge");
    case "invalid_file_type":
      return t("errorInvalidFileType");
    case "network_error":
      return t("errorNetwork");
    default:
      return t("errorUnknown");
  }
}
