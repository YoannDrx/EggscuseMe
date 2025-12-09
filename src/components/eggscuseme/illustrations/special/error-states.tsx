"use client";

import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";
import { STICKER_STYLE } from "../base/sticker-base";

type ErrorType = "404" | "500" | "offline" | "empty" | "permission";

type ErrorIllustrationProps = ComponentProps<"svg"> & {
  type: ErrorType;
  size?: "sm" | "md" | "lg" | "xl";
  animate?: boolean;
};

const sizeMap = {
  sm: "w-32 h-32",
  md: "w-48 h-48",
  lg: "w-64 h-64",
  xl: "w-80 h-80",
};

/**
 * 404 Not Found - Eggy lost with magnifying glass
 */
function Error404({ animate }: { animate: boolean }) {
  return (
    <g>
      {/* Fog/mist background */}
      <ellipse cx="90" cy="130" rx="80" ry="20" fill="#E5E7EB" opacity={0.5} />

      {/* Question marks floating */}
      <g
        className={animate ? "animate-[float_3s_ease-in-out_infinite]" : ""}
        opacity={0.6}
      >
        <text x="40" y="40" fill="#9CA3AF" fontSize="20" fontWeight="bold">
          ?
        </text>
        <text x="130" y="50" fill="#9CA3AF" fontSize="16" fontWeight="bold">
          ?
        </text>
        <text x="150" y="80" fill="#9CA3AF" fontSize="24" fontWeight="bold">
          ?
        </text>
      </g>

      {/* Eggy with magnifying glass */}
      <g transform="translate(90, 85)">
        {/* Eggy body */}
        <ellipse
          cx="0"
          cy="0"
          rx="30"
          ry="38"
          fill={STICKER_STYLE.fillEgg}
          stroke={STICKER_STYLE.stroke}
          strokeWidth={2}
        />

        {/* Confused eyes */}
        <ellipse cx="-10" cy="-8" rx="5" ry="6" fill={STICKER_STYLE.stroke} />
        <ellipse cx="10" cy="-8" rx="5" ry="6" fill={STICKER_STYLE.stroke} />
        <circle cx="-9" cy="-9" r="2" fill="white" />
        <circle cx="11" cy="-9" r="2" fill="white" />

        {/* Confused eyebrows */}
        <path
          d="M-18 -18 L-5 -14"
          stroke={STICKER_STYLE.stroke}
          strokeWidth={2}
          strokeLinecap="round"
        />
        <path
          d="M5 -14 L18 -18"
          stroke={STICKER_STYLE.stroke}
          strokeWidth={2}
          strokeLinecap="round"
        />

        {/* Worried mouth */}
        <path
          d="M-8 15 Q0 10, 8 15"
          stroke={STICKER_STYLE.stroke}
          strokeWidth={2}
          strokeLinecap="round"
          fill="none"
        />

        {/* Sweat drop */}
        <path
          d="M25 -5 Q27 2, 25 8 Q23 2, 25 -5"
          fill="#87CEEB"
          stroke={STICKER_STYLE.stroke}
          strokeWidth={1}
        />
      </g>

      {/* Magnifying glass */}
      <g transform="translate(40, 70)">
        <circle
          cx="0"
          cy="0"
          r="18"
          fill="white"
          stroke={STICKER_STYLE.stroke}
          strokeWidth={3}
        />
        <circle
          cx="0"
          cy="0"
          r="14"
          fill="none"
          stroke="#E5E7EB"
          strokeWidth={2}
        />
        <path
          d="M12 12 L28 28"
          stroke={STICKER_STYLE.stroke}
          strokeWidth={4}
          strokeLinecap="round"
        />
      </g>

      {/* 404 text */}
      <text
        x="90"
        y="145"
        textAnchor="middle"
        fill={STICKER_STYLE.stroke}
        fontSize="14"
        fontWeight="bold"
      >
        Page introuvable
      </text>
    </g>
  );
}

/**
 * 500 Server Error - Cracked Eggy
 */
function Error500({ animate }: { animate: boolean }) {
  return (
    <g>
      {/* Danger symbols */}
      <g
        className={
          animate ? "animate-[glow-pulse_1s_ease-in-out_infinite]" : ""
        }
      >
        <path
          d="M40 30 L45 40 L35 40 Z"
          fill="#EF4444"
          stroke={STICKER_STYLE.stroke}
          strokeWidth={1}
        />
        <text
          x="40"
          y="38"
          textAnchor="middle"
          fill="white"
          fontSize="6"
          fontWeight="bold"
        >
          !
        </text>
        <path
          d="M140 40 L148 55 L132 55 Z"
          fill="#EF4444"
          stroke={STICKER_STYLE.stroke}
          strokeWidth={1}
        />
        <text
          x="140"
          y="52"
          textAnchor="middle"
          fill="white"
          fontSize="8"
          fontWeight="bold"
        >
          !
        </text>
      </g>

      {/* Cracked Eggy */}
      <g transform="translate(90, 80)">
        {/* Main egg body with crack */}
        <ellipse
          cx="0"
          cy="0"
          rx="35"
          ry="42"
          fill={STICKER_STYLE.fillEgg}
          stroke={STICKER_STYLE.stroke}
          strokeWidth={2}
        />

        {/* Crack lines */}
        <path
          d="M-15 -35 L-5 -20 L-12 -10 L-2 5 L-10 15"
          stroke={STICKER_STYLE.stroke}
          strokeWidth={1.5}
          fill="none"
        />
        <path
          d="M10 -30 L5 -18 L12 -8"
          stroke={STICKER_STYLE.stroke}
          strokeWidth={1.5}
          fill="none"
        />

        {/* X eyes (broken) */}
        <g
          stroke={STICKER_STYLE.stroke}
          strokeWidth={2.5}
          strokeLinecap="round"
        >
          <path d="M-16 -8 L-8 0 M-16 0 L-8 -8" />
          <path d="M8 -8 L16 0 M8 0 L16 -8" />
        </g>

        {/* Dizzy spirals */}
        <path
          d="M-25 -15 Q-28 -20, -22 -22 Q-18 -18, -20 -12"
          stroke="#9CA3AF"
          strokeWidth={1.5}
          fill="none"
        />
        <path
          d="M25 -15 Q28 -20, 22 -22 Q18 -18, 20 -12"
          stroke="#9CA3AF"
          strokeWidth={1.5}
          fill="none"
        />

        {/* Sad mouth */}
        <path
          d="M-10 20 Q0 12, 10 20"
          stroke={STICKER_STYLE.stroke}
          strokeWidth={2}
          strokeLinecap="round"
          fill="none"
        />
      </g>

      {/* Error sparks */}
      <g
        fill="#EF4444"
        className={
          animate ? "animate-[glow-pulse_0.5s_ease-in-out_infinite]" : ""
        }
      >
        <circle cx="55" cy="60" r="3" />
        <circle cx="125" cy="55" r="2" />
        <circle cx="60" cy="100" r="2" />
        <circle cx="130" cy="95" r="3" />
      </g>

      {/* Error text */}
      <text
        x="90"
        y="145"
        textAnchor="middle"
        fill="#EF4444"
        fontSize="14"
        fontWeight="bold"
      >
        Erreur serveur
      </text>
    </g>
  );
}

/**
 * Offline - Eggy with disconnected signal
 */
function ErrorOffline({ animate }: { animate: boolean }) {
  return (
    <g>
      {/* Eggy looking at signal */}
      <g transform="translate(70, 85)">
        {/* Eggy body */}
        <ellipse
          cx="0"
          cy="0"
          rx="30"
          ry="38"
          fill={STICKER_STYLE.fillEgg}
          stroke={STICKER_STYLE.stroke}
          strokeWidth={2}
        />

        {/* Sad eyes */}
        <ellipse cx="-10" cy="-8" rx="5" ry="6" fill={STICKER_STYLE.stroke} />
        <ellipse cx="10" cy="-8" rx="5" ry="6" fill={STICKER_STYLE.stroke} />
        <circle cx="-9" cy="-9" r="2" fill="white" />
        <circle cx="11" cy="-9" r="2" fill="white" />

        {/* Sad eyebrows */}
        <path
          d="M-18 -18 L-5 -15"
          stroke={STICKER_STYLE.stroke}
          strokeWidth={2}
          strokeLinecap="round"
        />
        <path
          d="M5 -15 L18 -18"
          stroke={STICKER_STYLE.stroke}
          strokeWidth={2}
          strokeLinecap="round"
        />

        {/* Sad mouth */}
        <path
          d="M-8 18 Q0 12, 8 18"
          stroke={STICKER_STYLE.stroke}
          strokeWidth={2}
          strokeLinecap="round"
          fill="none"
        />

        {/* Tear */}
        <ellipse cx="-18" cy="5" rx="3" ry="4" fill="#87CEEB" />
      </g>

      {/* WiFi/Signal symbol with X */}
      <g transform="translate(130, 60)">
        {/* Signal bars (grayed out) */}
        <rect x="-20" y="15" width="6" height="10" rx="1" fill="#D1D5DB" />
        <rect x="-10" y="10" width="6" height="15" rx="1" fill="#D1D5DB" />
        <rect x="0" y="5" width="6" height="20" rx="1" fill="#D1D5DB" />
        <rect x="10" y="0" width="6" height="25" rx="1" fill="#D1D5DB" />

        {/* X over signal */}
        <g
          className={
            animate ? "animate-[glow-pulse_1.5s_ease-in-out_infinite]" : ""
          }
        >
          <circle
            cx="0"
            cy="12"
            r="18"
            fill="none"
            stroke="#EF4444"
            strokeWidth={2}
          />
          <path
            d="M-8 4 L8 20 M8 4 L-8 20"
            stroke="#EF4444"
            strokeWidth={3}
            strokeLinecap="round"
          />
        </g>
      </g>

      {/* Broken connection lines */}
      <g stroke="#D1D5DB" strokeWidth={2} strokeDasharray="4 2">
        <path d="M100 85 L115 75" />
      </g>

      {/* Text */}
      <text
        x="90"
        y="145"
        textAnchor="middle"
        fill={STICKER_STYLE.stroke}
        fontSize="14"
        fontWeight="bold"
      >
        Hors connexion
      </text>
    </g>
  );
}

/**
 * Empty state - Lonely Eggy
 */
function ErrorEmpty({ animate }: { animate: boolean }) {
  return (
    <g>
      {/* Dust particles */}
      <g
        opacity={0.4}
        className={animate ? "animate-[float_6s_ease-in-out_infinite]" : ""}
      >
        <circle cx="50" cy="70" r="2" fill="#D1D5DB" />
        <circle cx="130" cy="80" r="3" fill="#D1D5DB" />
        <circle cx="60" cy="110" r="2" fill="#D1D5DB" />
        <circle cx="120" cy="60" r="2" fill="#D1D5DB" />
      </g>

      {/* Eggy looking lonely */}
      <g
        transform="translate(90, 80)"
        className={animate ? "animate-[float_4s_ease-in-out_infinite]" : ""}
      >
        {/* Eggy body */}
        <ellipse
          cx="0"
          cy="0"
          rx="28"
          ry="35"
          fill={STICKER_STYLE.fillEgg}
          stroke={STICKER_STYLE.stroke}
          strokeWidth={2}
        />

        {/* Sad puppy eyes */}
        <ellipse cx="-9" cy="-5" rx="6" ry="8" fill={STICKER_STYLE.stroke} />
        <ellipse cx="9" cy="-5" rx="6" ry="8" fill={STICKER_STYLE.stroke} />
        <circle cx="-8" cy="-6" r="2.5" fill="white" />
        <circle cx="10" cy="-6" r="2.5" fill="white" />

        {/* Sad eyebrows */}
        <path
          d="M-18 -18 L-5 -13"
          stroke={STICKER_STYLE.stroke}
          strokeWidth={2}
          strokeLinecap="round"
        />
        <path
          d="M5 -13 L18 -18"
          stroke={STICKER_STYLE.stroke}
          strokeWidth={2}
          strokeLinecap="round"
        />

        {/* Sad mouth */}
        <path
          d="M-8 18 Q0 12, 8 18"
          stroke={STICKER_STYLE.stroke}
          strokeWidth={2}
          strokeLinecap="round"
          fill="none"
        />

        {/* Blush (even when sad) */}
        <ellipse cx="-20" cy="8" rx="5" ry="3" fill="#FFB6C1" opacity={0.3} />
        <ellipse cx="20" cy="8" rx="5" ry="3" fill="#FFB6C1" opacity={0.3} />
      </g>

      {/* Empty box outline */}
      <rect
        x="45"
        y="115"
        width="90"
        height="15"
        rx="2"
        fill="none"
        stroke="#D1D5DB"
        strokeWidth={2}
        strokeDasharray="6 3"
      />

      {/* Text */}
      <text
        x="90"
        y="145"
        textAnchor="middle"
        fill="#9CA3AF"
        fontSize="12"
        fontWeight="medium"
      >
        Rien à afficher
      </text>
    </g>
  );
}

/**
 * Permission denied - Eggy blocked
 */
function ErrorPermission({ animate }: { animate: boolean }) {
  return (
    <g>
      {/* Lock */}
      <g transform="translate(90, 50)">
        <rect
          x="-20"
          y="0"
          width="40"
          height="30"
          rx="4"
          fill="#6B7280"
          stroke={STICKER_STYLE.stroke}
          strokeWidth={2}
        />
        <path
          d="M-12 0 L-12 -10 Q-12 -25, 0 -25 Q12 -25, 12 -10 L12 0"
          fill="none"
          stroke={STICKER_STYLE.stroke}
          strokeWidth={4}
        />
        <circle cx="0" cy="12" r="5" fill={STICKER_STYLE.stroke} />
        <rect x="-2" y="14" width="4" height="8" fill={STICKER_STYLE.stroke} />
      </g>

      {/* Blocked Eggy behind */}
      <g transform="translate(90, 100)">
        {/* Eggy body (partially visible) */}
        <ellipse
          cx="0"
          cy="0"
          rx="25"
          ry="30"
          fill={STICKER_STYLE.fillEgg}
          stroke={STICKER_STYLE.stroke}
          strokeWidth={2}
        />

        {/* Sad/worried eyes */}
        <ellipse cx="-8" cy="-5" rx="4" ry="5" fill={STICKER_STYLE.stroke} />
        <ellipse cx="8" cy="-5" rx="4" ry="5" fill={STICKER_STYLE.stroke} />
        <circle cx="-7" cy="-6" r="1.5" fill="white" />
        <circle cx="9" cy="-6" r="1.5" fill="white" />

        {/* Worried mouth */}
        <ellipse
          cx="0"
          cy="12"
          rx="4"
          ry="3"
          fill={STICKER_STYLE.fillEgg}
          stroke={STICKER_STYLE.stroke}
          strokeWidth={1.5}
        />
      </g>

      {/* Red X marks */}
      <g
        stroke="#EF4444"
        strokeWidth={3}
        strokeLinecap="round"
        className={
          animate ? "animate-[glow-pulse_1.5s_ease-in-out_infinite]" : ""
        }
      >
        <path d="M40 40 L50 50 M50 40 L40 50" />
        <path d="M130 45 L140 55 M140 45 L130 55" />
      </g>

      {/* Text */}
      <text
        x="90"
        y="145"
        textAnchor="middle"
        fill="#EF4444"
        fontSize="12"
        fontWeight="bold"
      >
        Accès refusé
      </text>
    </g>
  );
}

/**
 * Error illustration component
 */
export function ErrorIllustration({
  type,
  size = "md",
  animate = true,
  className,
  ...props
}: ErrorIllustrationProps) {
  const renderError = () => {
    switch (type) {
      case "404":
        return <Error404 animate={animate} />;
      case "500":
        return <Error500 animate={animate} />;
      case "offline":
        return <ErrorOffline animate={animate} />;
      case "empty":
        return <ErrorEmpty animate={animate} />;
      case "permission":
        return <ErrorPermission animate={animate} />;
    }
  };

  return (
    <svg
      viewBox="0 0 180 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(sizeMap[size], className)}
      {...props}
    >
      {renderError()}
    </svg>
  );
}

export default ErrorIllustration;
