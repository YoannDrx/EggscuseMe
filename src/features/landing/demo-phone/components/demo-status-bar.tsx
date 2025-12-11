"use client";

/**
 * iOS-style status bar for the demo phone
 * Shows time (9:41), signal, wifi, and battery
 */
export function DemoStatusBar() {
  return (
    <div className="flex h-12 items-center justify-between px-6 pt-8">
      <span className="text-neo-text-muted text-xs font-medium">9:41</span>
      <div className="flex items-center gap-1">
        {/* Signal bars */}
        <div className="bg-neo-text-muted h-2.5 w-4 rounded-sm" />
        {/* Wifi */}
        <div className="bg-neo-text-muted h-2.5 w-2.5 rounded-full" />
        {/* Battery */}
        <div className="border-neo-text-muted h-2.5 w-5 rounded-sm border">
          <div className="bg-neo-text h-full w-3/4 rounded-sm" />
        </div>
      </div>
    </div>
  );
}
