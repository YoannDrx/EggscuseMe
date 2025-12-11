"use client";

import { cn } from "@/lib/utils";
import { DemoPhoneContent } from "../demo-phone";

type PhoneAppPreviewProps = {
  className?: string;
};

/**
 * Phone app preview component for the landing page hero section.
 * Displays an interactive demo of the app with inverted theme.
 */
export function PhoneAppPreview({ className }: PhoneAppPreviewProps) {
  return (
    <div className={cn("h-full w-full", className)}>
      <DemoPhoneContent />
    </div>
  );
}
