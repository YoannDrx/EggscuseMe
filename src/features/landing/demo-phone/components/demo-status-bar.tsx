"use client";

/**
 * iOS-style cellular signal bars
 */
function CellularIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 18 12"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <rect x="0" y="9" width="3" height="3" rx="0.5" />
      <rect x="4" y="6" width="3" height="6" rx="0.5" />
      <rect x="8" y="3" width="3" height="9" rx="0.5" />
      <rect x="12" y="0" width="3" height="12" rx="0.5" />
    </svg>
  );
}

/**
 * iOS-style WiFi icon
 */
function WifiIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 15 11"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      {/* Point central */}
      <circle cx="7.5" cy="9" r="1.5" />
      {/* Arc 1 - petit */}
      <path
        d="M4.5 6.5c1.7-1.7 4.3-1.7 6 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Arc 2 - moyen */}
      <path
        d="M2.25 4.25c2.9-2.9 7.6-2.9 10.5 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Arc 3 - grand */}
      <path
        d="M0 2c4.1-4.1 10.9-4.1 15 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * iOS-style battery icon
 */
function BatteryIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 27 12"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      {/* Battery body outline */}
      <rect
        x="0.5"
        y="0.5"
        width="23"
        height="11"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
        opacity="0.4"
      />
      {/* Battery cap */}
      <path
        d="M25 3.5v5a1.5 1.5 0 0 0 1.5-1.5v-2A1.5 1.5 0 0 0 25 3.5Z"
        opacity="0.4"
      />
      {/* Battery fill (80%) */}
      <rect x="2" y="2" width="18" height="8" rx="1.5" />
    </svg>
  );
}

/**
 * iOS-style status bar for the demo phone
 * Shows time (9:41), signal, wifi, and battery
 */
export function DemoStatusBar() {
  return (
    <div className="flex h-11 items-center justify-between pt-3 pr-3 pl-6">
      {/* Time - iOS style bold */}
      <span className="text-neo-text text-sm font-semibold">9:41</span>

      {/* Right side icons */}
      <div className="text-neo-text mt-0.5 flex items-center gap-1">
        <CellularIcon className="h-3 w-[18px]" />
        <WifiIcon className="h-3 w-4" />
        <BatteryIcon className="h-3 w-[27px]" />
      </div>
    </div>
  );
}
