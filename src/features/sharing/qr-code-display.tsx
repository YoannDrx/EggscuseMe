"use client";

import { useEffect, useRef } from "react";

type QRCodeDisplayProps = {
  value: string;
  size?: number;
  className?: string;
};

/**
 * Simple QR Code display using canvas
 * Uses the qrcode library for generation
 */
export function QRCodeDisplay({
  value,
  size = 200,
  className,
}: QRCodeDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const generateQR = async () => {
      if (!canvasRef.current) return;

      try {
        // Dynamic import to avoid SSR issues
        const QRCode = (await import("qrcode")).default;
        await QRCode.toCanvas(canvasRef.current, value, {
          width: size,
          margin: 2,
          color: {
            dark: "#1a1a1a",
            light: "#ffffff",
          },
        });
      } catch {
        // QR generation failed, show fallback
      }
    };

    void generateQR();
  }, [value, size]);

  return (
    <div className={className}>
      <canvas
        ref={canvasRef}
        className="rounded-lg"
        style={{ width: size, height: size }}
      />
    </div>
  );
}
