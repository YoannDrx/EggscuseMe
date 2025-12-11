"use client";

import type { ComponentProps } from "react";
import { STICKER_STYLE } from "../base/sticker-base";

type StickerIconProps = ComponentProps<"svg"> & {
  size?: number;
};

const defaultProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg",
};

/**
 * Sticker-style trash icon
 */
export function IconTrashSticker({
  size = 24,
  className,
  ...props
}: StickerIconProps) {
  return (
    <svg
      width={size}
      height={size}
      {...defaultProps}
      className={className}
      {...props}
    >
      <path
        d="M6 7V19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7"
        fill="white"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <path
        d="M4 7H20"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={2}
        strokeLinecap="round"
      />
      <path
        d="M9 7V5C9 4.4 9.4 4 10 4H14C14.6 4 15 4.4 15 5V7"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={2}
      />
      <path
        d="M10 11V17"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      <path
        d="M14 11V17"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Sticker-style timer icon
 */
export function IconTimerSticker({
  size = 24,
  className,
  ...props
}: StickerIconProps) {
  return (
    <svg
      width={size}
      height={size}
      {...defaultProps}
      className={className}
      {...props}
    >
      <circle
        cx="12"
        cy="13"
        r="8"
        fill="white"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={2}
      />
      <path
        d="M12 9V13L15 15"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={2}
        strokeLinecap="round"
      />
      <path
        d="M9 3H15"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={2}
        strokeLinecap="round"
      />
      <path
        d="M12 3V5"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Large timer illustration
 */
export function TimerIllustration({
  size = 140,
  className,
  ...props
}: StickerIconProps) {
  const parsedSize =
    typeof size === "number" ? size : parseInt(String(size), 10) || 140;

  return (
    <svg
      width={parsedSize}
      height={parsedSize}
      viewBox="0 0 160 180"
      className={className}
      {...defaultProps}
      {...props}
    >
      <defs>
        <filter id="timerShadow" x="-10%" y="-10%" width="130%" height="130%">
          <feOffset dx="6" dy="6" />
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feFlood floodColor="rgba(0,0,0,0.18)" />
          <feComposite in2="blur" operator="in" />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g filter="url(#timerShadow)">
        <circle
          cx="80"
          cy="95"
          r="60"
          fill="#FFF7ED"
          stroke={STICKER_STYLE.stroke}
          strokeWidth={4}
        />
        <circle
          cx="80"
          cy="95"
          r="46"
          fill="#FFFFFF"
          stroke={STICKER_STYLE.stroke}
          strokeWidth={3}
        />
        <circle cx="80" cy="95" r="3" fill="#000" />

        <path
          d="M80 95 L80 60"
          stroke={STICKER_STYLE.stroke}
          strokeWidth={4}
          strokeLinecap="round"
        />
        <path
          d="M80 95 L110 105"
          stroke={STICKER_STYLE.stroke}
          strokeWidth={4}
          strokeLinecap="round"
        />

        <rect
          x="58"
          y="32"
          width="44"
          height="10"
          rx="4"
          fill="#0F172A"
          stroke={STICKER_STYLE.stroke}
          strokeWidth={2.5}
        />
        <rect
          x="66"
          y="24"
          width="28"
          height="10"
          rx="3"
          fill="#FCD34D"
          stroke={STICKER_STYLE.stroke}
          strokeWidth={2}
        />

        <rect
          x="25"
          y="70"
          width="10"
          height="16"
          rx="4"
          fill="#F59E0B"
          stroke={STICKER_STYLE.stroke}
          strokeWidth={2}
        />
        <rect
          x="125"
          y="70"
          width="10"
          height="16"
          rx="4"
          fill="#F59E0B"
          stroke={STICKER_STYLE.stroke}
          strokeWidth={2}
        />

        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * Math.PI) / 6;
          const rOuter = 80;
          const rInner = i % 3 === 0 ? 66 : 70;
          const x1 = 80 + rOuter * Math.cos(angle);
          const y1 = 95 + rOuter * Math.sin(angle);
          const x2 = 80 + rInner * Math.cos(angle);
          const y2 = 95 + rInner * Math.sin(angle);
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={STICKER_STYLE.stroke}
              strokeWidth={i % 3 === 0 ? 3 : 2}
              strokeLinecap="round"
            />
          );
        })}
      </g>
    </svg>
  );
}

/**
 * Sticker-style chef hat icon
 */
export function IconChefHatSticker({
  size = 24,
  className,
  ...props
}: StickerIconProps) {
  return (
    <svg
      width={size}
      height={size}
      {...defaultProps}
      className={className}
      {...props}
    >
      <path
        d="M6 14V20H18V14"
        fill="white"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <circle
        cx="7"
        cy="10"
        r="4"
        fill="white"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={2}
      />
      <circle
        cx="12"
        cy="8"
        r="4"
        fill="white"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={2}
      />
      <circle
        cx="17"
        cy="10"
        r="4"
        fill="white"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={2}
      />
      <rect x="6" y="12" width="12" height="4" fill="white" />
    </svg>
  );
}

/**
 * Sticker-style fridge icon
 */
export function IconFridgeSticker({
  size = 24,
  className,
  ...props
}: StickerIconProps) {
  return (
    <svg
      width={size}
      height={size}
      {...defaultProps}
      className={className}
      {...props}
    >
      <rect
        x="5"
        y="2"
        width="14"
        height="20"
        rx="2"
        fill="white"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={2}
      />
      <line
        x1="5"
        y1="10"
        x2="19"
        y2="10"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={1.5}
      />
      <path
        d="M16 6V8"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={2}
        strokeLinecap="round"
      />
      <path
        d="M16 14V18"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Sticker-style chart icon
 */
export function IconChartSticker({
  size = 24,
  className,
  ...props
}: StickerIconProps) {
  return (
    <svg
      width={size}
      height={size}
      {...defaultProps}
      className={className}
      {...props}
    >
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="2"
        fill="white"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={2}
      />
      <path
        d="M7 15V11"
        stroke="#22C55E"
        strokeWidth={3}
        strokeLinecap="round"
      />
      <path
        d="M12 15V8"
        stroke="#FBBF24"
        strokeWidth={3}
        strokeLinecap="round"
      />
      <path
        d="M17 15V13"
        stroke="#EF4444"
        strokeWidth={3}
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Sticker-style bell/notification icon
 */
export function IconBellSticker({
  size = 24,
  className,
  ...props
}: StickerIconProps) {
  return (
    <svg
      width={size}
      height={size}
      {...defaultProps}
      className={className}
      {...props}
    >
      <path
        d="M12 3C8.5 3 6 6 6 9V14L4 17H20L18 14V9C18 6 15.5 3 12 3Z"
        fill="white"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <path
        d="M10 17V18C10 19.1 10.9 20 12 20C13.1 20 14 19.1 14 18V17"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={2}
      />
      <circle
        cx="18"
        cy="5"
        r="3"
        fill="#EF4444"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={1}
      />
    </svg>
  );
}

/**
 * Sticker-style settings/gear icon
 */
export function IconSettingsSticker({
  size = 24,
  className,
  ...props
}: StickerIconProps) {
  return (
    <svg
      width={size}
      height={size}
      {...defaultProps}
      className={className}
      {...props}
    >
      <circle
        cx="12"
        cy="12"
        r="3"
        fill="white"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={2}
      />
      <path
        d="M12 1V4M12 20V23M4.2 4.2L6.3 6.3M17.7 17.7L19.8 19.8M1 12H4M20 12H23M4.2 19.8L6.3 17.7M17.7 6.3L19.8 4.2"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Sticker-style plus icon
 */
export function IconPlusSticker({
  size = 24,
  className,
  ...props
}: StickerIconProps) {
  return (
    <svg
      width={size}
      height={size}
      {...defaultProps}
      className={className}
      {...props}
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        fill="white"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={2}
      />
      <path
        d="M12 8V16M8 12H16"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Sticker-style edit/pencil icon
 */
export function IconEditSticker({
  size = 24,
  className,
  ...props
}: StickerIconProps) {
  return (
    <svg
      width={size}
      height={size}
      {...defaultProps}
      className={className}
      {...props}
    >
      <path
        d="M16 3L21 8L8 21H3V16L16 3Z"
        fill="white"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <path d="M13 6L18 11" stroke={STICKER_STYLE.stroke} strokeWidth={1.5} />
    </svg>
  );
}

/**
 * Sticker-style search/magnifying glass icon
 */
export function IconSearchSticker({
  size = 24,
  className,
  ...props
}: StickerIconProps) {
  return (
    <svg
      width={size}
      height={size}
      {...defaultProps}
      className={className}
      {...props}
    >
      <circle
        cx="10"
        cy="10"
        r="6"
        fill="white"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={2}
      />
      <path
        d="M15 15L20 20"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={2.5}
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Sticker-style calendar icon
 */
export function IconCalendarSticker({
  size = 24,
  className,
  ...props
}: StickerIconProps) {
  return (
    <svg
      width={size}
      height={size}
      {...defaultProps}
      className={className}
      {...props}
    >
      <rect
        x="3"
        y="4"
        width="18"
        height="18"
        rx="2"
        fill="white"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={2}
      />
      <path d="M3 9H21" stroke={STICKER_STYLE.stroke} strokeWidth={1.5} />
      <path
        d="M8 2V6"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={2}
        strokeLinecap="round"
      />
      <path
        d="M16 2V6"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={2}
        strokeLinecap="round"
      />
      <circle cx="8" cy="14" r="1.5" fill="#22C55E" />
      <circle cx="12" cy="14" r="1.5" fill="#FBBF24" />
      <circle cx="16" cy="14" r="1.5" fill="#EF4444" />
    </svg>
  );
}

/**
 * Sticker-style tip/lightbulb icon
 */
export function IconTipSticker({
  size = 24,
  className,
  ...props
}: StickerIconProps) {
  return (
    <svg
      width={size}
      height={size}
      {...defaultProps}
      className={className}
      {...props}
    >
      <path
        d="M12 2C8.1 2 5 5.1 5 9C5 11.4 6.2 13.5 8 14.7V17C8 17.6 8.4 18 9 18H15C15.6 18 16 17.6 16 17V14.7C17.8 13.5 19 11.4 19 9C19 5.1 15.9 2 12 2Z"
        fill="#FCD34D"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <path
        d="M9 21H15"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={2}
        strokeLinecap="round"
      />
      <path d="M10 18V15" stroke={STICKER_STYLE.stroke} strokeWidth={1} />
      <path d="M14 18V15" stroke={STICKER_STYLE.stroke} strokeWidth={1} />
    </svg>
  );
}

/**
 * Sticker-style egg icon (mini version of mascot)
 */
export function IconEggSticker({
  size = 24,
  className,
  ...props
}: StickerIconProps) {
  return (
    <svg
      width={size}
      height={size}
      {...defaultProps}
      className={className}
      {...props}
    >
      <ellipse
        cx="12"
        cy="13"
        rx="8"
        ry="9"
        fill={STICKER_STYLE.fillEgg}
        stroke={STICKER_STYLE.stroke}
        strokeWidth={2}
      />
      <ellipse cx="9" cy="11" rx="1.5" ry="2" fill={STICKER_STYLE.stroke} />
      <ellipse cx="15" cy="11" rx="1.5" ry="2" fill={STICKER_STYLE.stroke} />
      <circle cx="9.5" cy="10.5" r="0.5" fill="white" />
      <circle cx="15.5" cy="10.5" r="0.5" fill="white" />
      <path
        d="M9 15 Q12 18, 15 15"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={1.5}
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

/**
 * Sticker-style heart icon
 */
export function IconHeartSticker({
  size = 24,
  className,
  ...props
}: StickerIconProps) {
  return (
    <svg
      width={size}
      height={size}
      {...defaultProps}
      className={className}
      {...props}
    >
      <path
        d="M12 21C12 21 3 14 3 8.5C3 5.4 5.4 3 8.5 3C10.2 3 11.9 3.8 12 5C12.1 3.8 13.8 3 15.5 3C18.6 3 21 5.4 21 8.5C21 14 12 21 12 21Z"
        fill="#EF4444"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={2}
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Sticker-style star icon
 */
export function IconStarSticker({
  size = 24,
  className,
  ...props
}: StickerIconProps) {
  return (
    <svg
      width={size}
      height={size}
      {...defaultProps}
      className={className}
      {...props}
    >
      <path
        d="M12 2L14.4 8.6L21.5 9.2L16.2 13.8L17.8 20.8L12 17L6.2 20.8L7.8 13.8L2.5 9.2L9.6 8.6L12 2Z"
        fill="#FCD34D"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={2}
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Sticker-style check/success icon
 */
export function IconCheckSticker({
  size = 24,
  className,
  ...props
}: StickerIconProps) {
  return (
    <svg
      width={size}
      height={size}
      {...defaultProps}
      className={className}
      {...props}
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        fill="#22C55E"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={2}
      />
      <path
        d="M7 12L10.5 15.5L17 9"
        stroke="white"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Sticker-style warning icon
 */
export function IconWarningSticker({
  size = 24,
  className,
  ...props
}: StickerIconProps) {
  return (
    <svg
      width={size}
      height={size}
      {...defaultProps}
      className={className}
      {...props}
    >
      <path
        d="M12 3L22 20H2L12 3Z"
        fill="#FBBF24"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <path
        d="M12 10V14"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={2}
        strokeLinecap="round"
      />
      <circle cx="12" cy="17" r="1" fill={STICKER_STYLE.stroke} />
    </svg>
  );
}

/**
 * Sticker-style error/X icon
 */
export function IconErrorSticker({
  size = 24,
  className,
  ...props
}: StickerIconProps) {
  return (
    <svg
      width={size}
      height={size}
      {...defaultProps}
      className={className}
      {...props}
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        fill="#EF4444"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={2}
      />
      <path
        d="M8 8L16 16M16 8L8 16"
        stroke="white"
        strokeWidth={2.5}
        strokeLinecap="round"
      />
    </svg>
  );
}

// Export all icons as a namespace for easy access
export const StickerIcons = {
  Trash: IconTrashSticker,
  Timer: IconTimerSticker,
  TimerIllustration,
  ChefHat: IconChefHatSticker,
  Fridge: IconFridgeSticker,
  Chart: IconChartSticker,
  Bell: IconBellSticker,
  Settings: IconSettingsSticker,
  Plus: IconPlusSticker,
  Edit: IconEditSticker,
  Search: IconSearchSticker,
  Calendar: IconCalendarSticker,
  Tip: IconTipSticker,
  Egg: IconEggSticker,
  Heart: IconHeartSticker,
  Star: IconStarSticker,
  Check: IconCheckSticker,
  Warning: IconWarningSticker,
  Error: IconErrorSticker,
};
