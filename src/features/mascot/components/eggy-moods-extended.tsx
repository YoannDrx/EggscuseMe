"use client";

import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";
import {
  BaseEggShape,
  Blush,
  ClosedHappyEyes,
  Confetti,
  HappySmile,
  HeartEyes,
  OMouth,
  SleepingEyes,
  Sparkles,
  STICKER_STYLE,
  SweatDrop,
} from "@/components/eggscuseme/illustrations/base/sticker-base";

export type ExtendedEggyMood =
  | "zen"
  | "gamer"
  | "sick"
  | "party"
  | "ninja"
  | "cool"
  | "love"
  | "sleepy-hard"
  | "detective"
  | "astronaut"
  | "pirate"
  | "student";

type ExtendedEggyProps = ComponentProps<"svg"> & {
  mood: ExtendedEggyMood;
  size?: "sm" | "md" | "lg" | "xl";
  animate?: boolean;
};

const sizeMap = {
  sm: "w-12 h-12",
  md: "w-20 h-20",
  lg: "w-32 h-32",
  xl: "w-48 h-48",
};

const animationMap: Record<ExtendedEggyMood, string> = {
  zen: "animate-[float_4s_ease-in-out_infinite]",
  gamer: "animate-[wobble_0.3s_ease-in-out_infinite]",
  sick: "",
  party: "animate-[bounce-excited_0.6s_ease-in-out_infinite]",
  ninja: "animate-[float_2s_ease-in-out_infinite]",
  cool: "animate-[float_3s_ease-in-out_infinite]",
  love: "animate-[pulse-ring_2s_ease-in-out_infinite]",
  "sleepy-hard": "",
  detective: "animate-[magnify-pulse_2s_ease-in-out_infinite]",
  astronaut: "animate-[float_5s_ease-in-out_infinite]",
  pirate: "animate-[wobble_1s_ease-in-out_infinite]",
  student: "",
};

/**
 * Extended Eggy moods - additional personalities
 */
export function EggyExtended({
  mood,
  size = "md",
  animate = true,
  className,
  ...props
}: ExtendedEggyProps) {
  return (
    <svg
      viewBox="0 0 100 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(sizeMap[size], animate && animationMap[mood], className)}
      {...props}
    >
      <BaseEggShape />
      {mood === "zen" && <EggyZenFace />}
      {mood === "gamer" && <EggyGamerFace />}
      {mood === "sick" && <EggySickFace />}
      {mood === "party" && <EggyPartyFace />}
      {mood === "ninja" && <EggyNinjaFace />}
      {mood === "cool" && <EggyCoolFace />}
      {mood === "love" && <EggyLoveFace />}
      {mood === "sleepy-hard" && <EggySleepyHardFace />}
      {mood === "detective" && <EggyDetectiveFace />}
      {mood === "astronaut" && <EggyAstronautFace />}
      {mood === "pirate" && <EggyPirateFace />}
      {mood === "student" && <EggyStudentFace />}
    </svg>
  );
}

/**
 * Zen mood - meditation pose with closed peaceful eyes
 */
function EggyZenFace() {
  return (
    <g>
      {/* Lotus flower cushion */}
      <ellipse cx="50" cy="112" rx="25" ry="8" fill="#F472B6" opacity={0.3} />
      <path
        d="M30 108 Q35 100, 50 102 Q65 100, 70 108"
        fill="#F9A8D4"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={1}
      />

      {/* Aura glow */}
      <ellipse cx="50" cy="65" rx="48" ry="58" fill="#A78BFA" opacity={0.1} />

      {/* Peaceful closed eyes */}
      <path
        d="M28 55 Q35 50, 42 55"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={2.5}
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M58 55 Q65 50, 72 55"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={2.5}
        strokeLinecap="round"
        fill="none"
      />

      {/* Serene small smile */}
      <path
        d="M42 78 Q50 82, 58 78"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={2}
        strokeLinecap="round"
        fill="none"
      />

      {/* Soft blush */}
      <Blush opacity={0.3} />

      {/* Om symbol floating */}
      <text x="75" y="30" fill="#A78BFA" className="text-[14px]">
        ॐ
      </text>
    </g>
  );
}

/**
 * Gamer mood - headset and focused eyes
 */
function EggyGamerFace() {
  return (
    <g>
      {/* Gaming headset */}
      <path
        d="M15 50 Q15 25, 50 25 Q85 25, 85 50"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={4}
        fill="none"
      />
      {/* Left ear cup */}
      <ellipse
        cx="15"
        cy="55"
        rx="8"
        ry="12"
        fill="#374151"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={2}
      />
      {/* Right ear cup */}
      <ellipse
        cx="85"
        cy="55"
        rx="8"
        ry="12"
        fill="#374151"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={2}
      />
      {/* Mic */}
      <path
        d="M15 65 Q5 75, 25 85"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={3}
        fill="none"
      />
      <circle
        cx="25"
        cy="87"
        r="4"
        fill="#374151"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={1.5}
      />

      {/* Concentrated eyes */}
      <rect
        x="28"
        y="52"
        width="14"
        height="6"
        rx={1}
        fill={STICKER_STYLE.stroke}
      />
      <rect
        x="58"
        y="52"
        width="14"
        height="6"
        rx={1}
        fill={STICKER_STYLE.stroke}
      />
      <rect x="31" y="53" width={3} height={4} fill="white" />
      <rect x="61" y="53" width={3} height={4} fill="white" />

      {/* Focused frown */}
      <path
        d="M40 78 L60 78"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={2.5}
        strokeLinecap="round"
      />

      {/* Sweat drop from intensity */}
      <SweatDrop cx={82} cy={42} />
    </g>
  );
}

/**
 * Sick mood - thermometer and green tint
 */
function EggySickFace() {
  return (
    <g>
      {/* Green sick overlay */}
      <ellipse cx="50" cy="65" rx="38" ry="48" fill="#86EFAC" opacity={0.2} />

      {/* Thermometer */}
      <rect
        x="70"
        y="35"
        width="6"
        height="30"
        rx={3}
        fill="white"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={1.5}
      />
      <circle
        cx="73"
        cy="60"
        r="5"
        fill="#EF4444"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={1}
      />
      <rect x="71.5" y="42" width={3} height={15} fill="#EF4444" />

      {/* Sick droopy eyes */}
      <ellipse cx="35" cy="58" rx={5} ry={4} fill={STICKER_STYLE.stroke} />
      <ellipse cx="65" cy="58" rx={5} ry={4} fill={STICKER_STYLE.stroke} />
      <circle cx="36" cy="57" r={1.5} fill="white" />
      <circle cx="66" cy="57" r={1.5} fill="white" />

      {/* Tired eyebrows */}
      <path
        d="M28 50 L40 54"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={2}
        strokeLinecap="round"
      />
      <path
        d="M72 50 L60 54"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={2}
        strokeLinecap="round"
      />

      {/* Queasy wavy mouth */}
      <path
        d="M35 80 Q42 76, 50 80 Q58 84, 65 80"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={2}
        strokeLinecap="round"
        fill="none"
      />

      {/* Green blush */}
      <Blush color="#86EFAC" opacity={0.5} />
    </g>
  );
}

/**
 * Party mood - party hat and confetti
 */
function EggyPartyFace() {
  return (
    <g>
      <Confetti />

      {/* Party hat */}
      <path
        d="M30 25 L50 -10 L70 25"
        fill="#FBBF24"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={2}
      />
      {/* Hat stripes */}
      <path d="M38 15 L50 -5 L62 15" fill="#F472B6" />
      {/* Pom pom */}
      <circle
        cx="50"
        cy="-12"
        r="6"
        fill="#60A5FA"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={1}
      />

      {/* Ecstatic closed eyes */}
      <ClosedHappyEyes cy={52} />

      {/* Big blush */}
      <Blush opacity={0.5} />

      {/* Huge open smile */}
      <path
        d="M30 72 Q50 100, 70 72"
        stroke={STICKER_STYLE.stroke}
        fill={STICKER_STYLE.fillEgg}
        strokeWidth={2.5}
        strokeLinecap="round"
      />

      {/* Noise maker */}
      <path
        d="M85 70 L95 65 L95 75 L85 70"
        fill="#34D399"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={1}
      />
      <rect
        x="80"
        y="68"
        width={6}
        height={4}
        fill="#34D399"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={1}
      />
    </g>
  );
}

/**
 * Ninja mood - ninja headband and focused eyes
 */
function EggyNinjaFace() {
  return (
    <g>
      {/* Ninja headband */}
      <rect x="10" y="35" width="80" height="12" fill="#1C1917" />
      {/* Headband knot tails */}
      <path d="M85 38 Q95 35, 98 45 Q92 42, 88 50" fill="#1C1917" />
      <path d="M88 42 Q100 40, 102 52 Q95 48, 92 58" fill="#1C1917" />

      {/* Intense ninja eyes */}
      <ellipse cx="35" cy="55" rx="7" ry="4" fill={STICKER_STYLE.stroke} />
      <ellipse cx="65" cy="55" rx="7" ry="4" fill={STICKER_STYLE.stroke} />
      <ellipse cx="36" cy="55" rx={2} ry={1.5} fill="white" />
      <ellipse cx="66" cy="55" rx={2} ry={1.5} fill="white" />

      {/* Determined eyebrows */}
      <path
        d="M25 48 L42 52"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={3}
        strokeLinecap="round"
      />
      <path
        d="M75 48 L58 52"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={3}
        strokeLinecap="round"
      />

      {/* Covered mouth (mask) */}
      <path
        d="M25 70 Q50 85, 75 70"
        fill="#1C1917"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={1}
      />

      {/* Shuriken */}
      <g transform="translate(8, 60) scale(0.4)">
        <path
          d="M0 -15 L5 -5 L15 0 L5 5 L0 15 L-5 5 L-15 0 L-5 -5 Z"
          fill="#6B7280"
          stroke={STICKER_STYLE.stroke}
          strokeWidth={2}
        />
      </g>
    </g>
  );
}

/**
 * Cool mood - sunglasses
 */
function EggyCoolFace() {
  return (
    <g>
      {/* Sunglasses */}
      <rect x="22" y="48" width="22" height="16" rx={3} fill="#1C1917" />
      <rect x="56" y="48" width="22" height="16" rx={3} fill="#1C1917" />
      {/* Lens shine */}
      <path d="M26 52 L34 52 L30 56 Z" fill="white" opacity={0.3} />
      <path d="M60 52 L68 52 L64 56 Z" fill="white" opacity={0.3} />
      {/* Bridge */}
      <path
        d="M44 54 Q50 50, 56 54"
        stroke="#1C1917"
        strokeWidth={3}
        fill="none"
      />
      {/* Temple arms */}
      <path d="M22 52 L10 48" stroke="#1C1917" strokeWidth={3} />
      <path d="M78 52 L90 48" stroke="#1C1917" strokeWidth={3} />

      {/* Cool smirk */}
      <path
        d="M38 78 Q50 85, 62 78"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={2.5}
        strokeLinecap="round"
        fill="none"
      />

      {/* Sparkle */}
      <Sparkles positions={[{ x: 85, y: 35 }]} />
    </g>
  );
}

/**
 * Love mood - heart eyes
 */
function EggyLoveFace() {
  return (
    <g>
      {/* Floating hearts around */}
      <path
        d="M15 35 C10 30, 5 35, 15 45 C25 35, 20 30, 15 35"
        fill="#F472B6"
        opacity={0.6}
      />
      <path
        d="M85 30 C82 27, 78 30, 85 37 C92 30, 88 27, 85 30"
        fill="#F472B6"
        opacity={0.4}
      />
      <path
        d="M80 50 C78 48, 75 50, 80 55 C85 50, 82 48, 80 50"
        fill="#F472B6"
        opacity={0.3}
      />

      {/* Heart eyes */}
      <HeartEyes />

      {/* Big blush */}
      <Blush color="#F472B6" opacity={0.5} />

      {/* Dreamy smile */}
      <path
        d="M35 75 Q50 90, 65 75"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={2.5}
        strokeLinecap="round"
        fill="none"
      />
    </g>
  );
}

/**
 * Sleepy hard mood - night cap and intense zzz
 */
function EggySleepyHardFace() {
  return (
    <g>
      {/* Night cap */}
      <path
        d="M25 30 Q30 15, 50 20 Q75 18, 80 50"
        fill="#6366F1"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={2}
      />
      {/* Cap pom pom */}
      <circle
        cx="82"
        cy="52"
        r="6"
        fill="white"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={1.5}
      />
      {/* Cap band */}
      <path d="M25 30 Q50 40, 75 32" stroke="white" strokeWidth={4} />

      {/* Sleeping eyes */}
      <SleepingEyes />

      {/* Drool */}
      <path
        d="M55 85 Q58 95, 52 100"
        stroke={STICKER_STYLE.tear}
        strokeWidth={3}
        strokeLinecap="round"
        fill="none"
      />

      {/* Sleep blush */}
      <Blush opacity={0.3} />

      {/* Extra big Zzz */}
      <text x="75" y="25" fill="#6366F1" className="text-[16px] font-bold">
        Z
      </text>
      <text x="85" y="12" fill="#6366F1" className="text-[14px] font-bold">
        Z
      </text>
      <text x="92" y="2" fill="#6366F1" className="text-[12px] font-bold">
        Z
      </text>
    </g>
  );
}

/**
 * Detective mood - magnifying glass and detective hat
 */
function EggyDetectiveFace() {
  return (
    <g>
      {/* Detective hat */}
      <ellipse
        cx="50"
        cy="22"
        rx="35"
        ry="8"
        fill="#78716C"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={2}
      />
      <path
        d="M20 22 Q50 10, 80 22"
        fill="#57534E"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={2}
      />
      {/* Hat band */}
      <rect x="20" y="20" width="60" height="4" fill="#1C1917" />

      {/* Magnifying glass */}
      <circle
        cx="25"
        cy="55"
        r="18"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={3}
        fill="#E0F2FE"
        fillOpacity={0.4}
      />
      <line
        x1="38"
        y1="68"
        x2="52"
        y2="82"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={5}
      />
      <line x1="38" y1="68" x2="52" y2="82" stroke="#92400E" strokeWidth={3} />

      {/* One big eye through magnifier */}
      <ellipse cx="25" cy="55" rx="10" ry="12" fill={STICKER_STYLE.stroke} />
      <circle cx="28" cy="52" r="4" fill="white" />

      {/* Normal eye */}
      <ellipse cx="68" cy="55" rx="6" ry="7" fill={STICKER_STYLE.stroke} />
      <circle cx="70" cy="53" r={2} fill="white" />

      {/* Raised eyebrow */}
      <path
        d="M60 45 Q68 40, 76 45"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={2}
        strokeLinecap="round"
        fill="none"
      />

      {/* Curious mouth */}
      <OMouth cx={60} cy={80} rx={4} ry={3} />
    </g>
  );
}

/**
 * Astronaut mood - space helmet
 */
function EggyAstronautFace() {
  return (
    <g>
      {/* Helmet glass dome */}
      <ellipse
        cx="50"
        cy="55"
        rx="48"
        ry="55"
        fill="#E0F2FE"
        fillOpacity={0.3}
        stroke={STICKER_STYLE.stroke}
        strokeWidth={3}
      />
      {/* Helmet frame */}
      <ellipse
        cx="50"
        cy="55"
        rx="48"
        ry="55"
        fill="none"
        stroke="white"
        strokeWidth={6}
      />
      {/* Helmet shine */}
      <path
        d="M20 40 Q30 25, 50 30"
        stroke="white"
        strokeWidth={4}
        strokeLinecap="round"
        fill="none"
        opacity={0.6}
      />

      {/* Antenna */}
      <line
        x1="50"
        y1="0"
        x2="50"
        y2="-15"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={2}
      />
      <circle
        cx="50"
        cy="-18"
        r="5"
        fill="#EF4444"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={1}
      />

      {/* Wonder eyes */}
      <ellipse cx="35" cy="52" rx="7" ry="8" fill={STICKER_STYLE.stroke} />
      <ellipse cx="65" cy="52" rx="7" ry="8" fill={STICKER_STYLE.stroke} />
      <circle cx="37" cy="49" r="2.5" fill="white" />
      <circle cx="67" cy="49" r="2.5" fill="white" />
      <circle cx="33" cy="53" r="1" fill="white" />
      <circle cx="63" cy="53" r="1" fill="white" />

      {/* Amazed smile */}
      <HappySmile />

      {/* Stars */}
      <Sparkles
        positions={[
          { x: -5, y: 30 },
          { x: 105, y: 40 },
          { x: 0, y: 80 },
        ]}
      />
    </g>
  );
}

/**
 * Pirate mood - eye patch and bandana
 */
function EggyPirateFace() {
  return (
    <g>
      {/* Bandana */}
      <path
        d="M15 30 Q50 15, 85 30"
        fill="#EF4444"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={2}
      />
      {/* Bandana knot */}
      <circle
        cx="85"
        cy="35"
        r="5"
        fill="#EF4444"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={1}
      />
      <path d="M88 38 Q95 45, 92 55" stroke="#EF4444" strokeWidth={3} />
      <path d="M90 36 Q100 42, 98 55" stroke="#EF4444" strokeWidth={3} />
      {/* Skull on bandana */}
      <circle
        cx="50"
        cy="28"
        r="5"
        fill="white"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={1}
      />
      <circle cx="48" cy="27" r="1" fill={STICKER_STYLE.stroke} />
      <circle cx="52" cy="27" r="1" fill={STICKER_STYLE.stroke} />

      {/* Eye patch */}
      <ellipse cx="35" cy="55" rx="10" ry="8" fill="#1C1917" />
      <line x1="25" y1="50" x2="10" y2="35" stroke="#1C1917" strokeWidth={2} />
      <line x1="45" y1="50" x2="85" y2="35" stroke="#1C1917" strokeWidth={2} />

      {/* Good eye */}
      <ellipse cx="65" cy="55" rx="6" ry="7" fill={STICKER_STYLE.stroke} />
      <circle cx="67" cy="53" r="2" fill="white" />

      {/* Scar */}
      <path
        d="M28 62 L32 70"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={1.5}
        strokeLinecap="round"
      />

      {/* Mischievous grin */}
      <path
        d="M35 78 Q50 88, 65 78"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={2.5}
        strokeLinecap="round"
        fill="none"
      />
      {/* Gold tooth */}
      <rect x="48" y="80" width={4} height={5} fill="#FBBF24" />
    </g>
  );
}

/**
 * Student mood - glasses and book
 */
function EggyStudentFace() {
  return (
    <g>
      {/* Round glasses */}
      <circle
        cx="35"
        cy="55"
        r="12"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={2}
        fill="none"
      />
      <circle
        cx="65"
        cy="55"
        r="12"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={2}
        fill="none"
      />
      {/* Lens shine */}
      <path
        d="M30 50 A 6 6 0 0 1 36 50"
        stroke="white"
        strokeWidth={2}
        fill="none"
        opacity={0.5}
      />
      <path
        d="M60 50 A 6 6 0 0 1 66 50"
        stroke="white"
        strokeWidth={2}
        fill="none"
        opacity={0.5}
      />
      {/* Bridge */}
      <line
        x1="47"
        y1="55"
        x2="53"
        y2="55"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={2}
      />
      {/* Temple arms */}
      <line
        x1="23"
        y1="52"
        x2="10"
        y2="48"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={2}
      />
      <line
        x1="77"
        y1="52"
        x2="90"
        y2="48"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={2}
      />

      {/* Eyes behind glasses */}
      <ellipse cx="35" cy="55" rx="5" ry="6" fill={STICKER_STYLE.stroke} />
      <ellipse cx="65" cy="55" rx="5" ry="6" fill={STICKER_STYLE.stroke} />
      <circle cx="36" cy="53" r="1.5" fill="white" />
      <circle cx="66" cy="53" r="1.5" fill="white" />

      {/* Book */}
      <rect
        x="0"
        y="75"
        width="25"
        height="35"
        rx={2}
        fill="#3B82F6"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={2}
      />
      <line
        x1="12.5"
        y1="78"
        x2="12.5"
        y2="107"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={1}
      />
      {/* Book pages */}
      <line x1="5" y1="82" x2="20" y2="82" stroke="white" strokeWidth={1} />
      <line x1="5" y1="87" x2="20" y2="87" stroke="white" strokeWidth={1} />
      <line x1="5" y1="92" x2="20" y2="92" stroke="white" strokeWidth={1} />

      {/* Concentrated small mouth */}
      <path
        d="M42 80 L58 80"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={2}
        strokeLinecap="round"
      />

      {/* Thinking dots */}
      <circle cx="85" cy="35" r="2" fill="#1C191766" />
      <circle cx="90" cy="28" r="2.5" fill="#1C191744" />
      <circle cx="93" cy="20" r="3" fill="#1C191733" />
    </g>
  );
}

export default EggyExtended;
