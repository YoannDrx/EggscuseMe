"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Eggy } from "@/features/mascot";
import { AlertCircle, Camera, Scan, X } from "lucide-react";
import { useCallback, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useBarcodeDetector } from "./use-barcode-detector";
import {
  formatParsedInfo,
  parseAnyCode,
  type ParsedEggInfo,
} from "./lot-code-parser";

type BarcodeScannerProps = {
  onScan: (info: ParsedEggInfo) => void;
  onClose?: () => void;
  className?: string;
};

export function BarcodeScanner({
  onScan,
  onClose,
  className,
}: BarcodeScannerProps) {
  const t = useTranslations("scanner");
  const locale = useLocale();
  const [parsedInfo, setParsedInfo] = useState<ParsedEggInfo | null>(null);

  const handleDetect = useCallback(
    (barcodes: { rawValue: string }[]) => {
      if (barcodes.length > 0) {
        const info = parseAnyCode(barcodes[0].rawValue);
        setParsedInfo(info);
        onScan(info);
      }
    },
    [onScan],
  );

  const {
    isSupported,
    isScanning,
    error,
    videoRef,
    startScanning,
    stopScanning,
  } = useBarcodeDetector({
    onDetect: handleDetect,
  });

  // Fallback for unsupported browsers
  if (!isSupported) {
    return (
      <div
        className={cn(
          "bg-muted/50 flex flex-col items-center justify-center rounded-2xl p-8 text-center",
          className,
        )}
      >
        <Eggy mood="sad" size="lg" className="mb-4" />
        <h3 className="font-heading text-lg font-semibold">
          {t("unsupported")}
        </h3>
        <p className="text-muted-foreground mt-2 text-sm">
          {t("unsupported")}
        </p>
        {onClose && (
          <Button variant="outline" className="mt-4" onClick={onClose}>
            <X className="mr-2 size-4" />
            {t("stopScan")}
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {/* Video preview */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-black">
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          playsInline
          muted
        />

        {/* Scanning overlay */}
        {isScanning && (
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Scan frame */}
            <div className="relative h-48 w-64">
              {/* Corner markers */}
              <div className="border-primary absolute top-0 left-0 h-8 w-8 border-t-4 border-l-4" />
              <div className="border-primary absolute top-0 right-0 h-8 w-8 border-t-4 border-r-4" />
              <div className="border-primary absolute bottom-0 left-0 h-8 w-8 border-b-4 border-l-4" />
              <div className="border-primary absolute right-0 bottom-0 h-8 w-8 border-r-4 border-b-4" />

              {/* Scanning line animation */}
              <div className="bg-primary/60 absolute top-1/2 right-2 left-2 h-0.5 -translate-y-1/2 animate-pulse" />
            </div>

            {/* Hint text */}
            <div className="absolute right-4 bottom-4 left-4 text-center">
              <p className="rounded-lg bg-black/60 px-3 py-2 text-sm text-white">
                {t("align")}
              </p>
            </div>
          </div>
        )}

        {/* Not scanning state */}
        {!isScanning && !error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80">
            <Scan className="text-muted-foreground mb-4 size-16" />
            <p className="text-muted-foreground">
              {t("tapToEnable")}
            </p>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 p-4">
            <AlertCircle className="text-destructive mb-4 size-12" />
            <p className="text-center text-sm text-white">{error}</p>
          </div>
        )}

        {/* Close button */}
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 size-8 rounded-full bg-black/50 text-white hover:bg-black/70"
            onClick={onClose}
          >
            <X className="size-4" />
          </Button>
        )}
      </div>

      {/* Controls */}
      <div className="flex gap-2">
        {!isScanning ? (
          <Button
            variant="neubrutalism"
            className="flex-1"
            onClick={() => void startScanning()}
          >
            <Camera className="mr-2 size-5" />
            {t("enableCamera")}
          </Button>
        ) : (
          <Button
            variant="neubrutalism-outline"
            className="flex-1"
            onClick={stopScanning}
          >
            <X className="mr-2 size-5" />
            {t("stopScan")}
          </Button>
        )}
      </div>

      {/* Parsed info display */}
      {parsedInfo && (
        <div className="bg-fresh-extra/10 rounded-xl p-4">
          <h4 className="font-heading text-fresh-extra mb-2 font-semibold">
            {t("codeDetected")}
          </h4>
          <p className="text-muted-foreground mb-2 font-mono text-xs">
            {parsedInfo.rawCode}
          </p>
          <ul className="space-y-1 text-sm">
            {formatParsedInfo(parsedInfo, locale).map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
