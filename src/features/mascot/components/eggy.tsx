"use client";

import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

export type EggyMood =
  | "happy"
  | "worried"
  | "sad"
  | "chef"
  | "sleeping"
  | "cracked"
  // New moods
  | "excited"
  | "thinking"
  | "timer"
  | "cooking"
  | "hero"
  | "waving"
  | "celebrating"
  | "searching"
  | "fresh-extra"
  | "expired-warning";

type EggyProps = ComponentProps<"svg"> & {
  mood?: EggyMood;
  size?: "sm" | "md" | "lg" | "xl";
  animate?: boolean;
};

const sizeMap = {
  sm: "w-12 h-12",
  md: "w-20 h-20",
  lg: "w-32 h-32",
  xl: "w-48 h-48",
};

const animationMap: Record<EggyMood, string> = {
  // Original moods
  happy: "animate-[bounce-subtle_2s_ease-in-out_infinite]",
  worried: "animate-[wobble_0.5s_ease-in-out_infinite]",
  sad: "",
  chef: "animate-[float_3s_ease-in-out_infinite]",
  sleeping: "",
  cracked: "animate-[crack_0.3s_ease-in-out]",
  // New moods
  excited: "animate-[bounce-excited_0.6s_ease-in-out_infinite]",
  thinking: "",
  timer: "animate-[pulse-ring_1.5s_ease-in-out_infinite]",
  cooking: "animate-[float_3s_ease-in-out_infinite]",
  hero: "animate-[float-cape_4s_ease-in-out_infinite]",
  waving: "animate-[wave-hand_1s_ease-in-out_infinite]",
  celebrating: "animate-[bounce-excited_0.6s_ease-in-out_infinite]",
  searching: "animate-[magnify-pulse_2s_ease-in-out_infinite]",
  "fresh-extra": "animate-[glow-pulse_2s_ease-in-out_infinite]",
  "expired-warning": "animate-[shake-alert_0.5s_ease-in-out_infinite]",
};

export function Eggy({
  mood = "happy",
  size = "md",
  animate = true,
  className,
  ...props
}: EggyProps) {
  return (
    <svg
      viewBox="0 0 100 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(sizeMap[size], animate && animationMap[mood], className)}
      {...props}
    >
      {/* Egg body - white shell */}
      <ellipse
        cx="50"
        cy="65"
        rx="40"
        ry="50"
        className="stroke-foreground fill-[#FDFBF7]"
        strokeWidth="2"
      />

      {/* Face based on mood */}
      {mood === "happy" && <EggyHappyFace />}
      {mood === "worried" && <EggyWorriedFace />}
      {mood === "sad" && <EggySadFace />}
      {mood === "chef" && <EggyChefFace />}
      {mood === "sleeping" && <EggySleepingFace />}
      {mood === "cracked" && <EggyCrackedFace />}
      {/* New moods */}
      {mood === "excited" && <EggyExcitedFace />}
      {mood === "thinking" && <EggyThinkingFace />}
      {mood === "timer" && <EggyTimerFace />}
      {mood === "cooking" && <EggyCookingFace />}
      {mood === "hero" && <EggyHeroFace />}
      {mood === "waving" && <EggyWavingFace />}
      {mood === "celebrating" && <EggyCelebratingFace />}
      {mood === "searching" && <EggySearchingFace />}
      {mood === "fresh-extra" && <EggyFreshExtraFace />}
      {mood === "expired-warning" && <EggyExpiredWarningFace />}
    </svg>
  );
}

function EggyHappyFace() {
  return (
    <g>
      {/* Eyes */}
      <ellipse cx="35" cy="55" rx="6" ry="7" className="fill-foreground" />
      <ellipse cx="65" cy="55" rx="6" ry="7" className="fill-foreground" />
      {/* Eye shine */}
      <circle cx="37" cy="53" r="2" className="fill-white" />
      <circle cx="67" cy="53" r="2" className="fill-white" />
      {/* Blush */}
      <ellipse cx="25" cy="70" rx="6" ry="4" className="fill-[#FFB6C1]/40" />
      <ellipse cx="75" cy="70" rx="6" ry="4" className="fill-[#FFB6C1]/40" />
      {/* Smile */}
      <path
        d="M35 75 Q50 90, 65 75"
        className="stroke-foreground"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
    </g>
  );
}

function EggyWorriedFace() {
  return (
    <g>
      {/* Worried eyes */}
      <ellipse cx="35" cy="55" rx="6" ry="7" className="fill-foreground" />
      <ellipse cx="65" cy="55" rx="6" ry="7" className="fill-foreground" />
      <circle cx="37" cy="53" r="2" className="fill-white" />
      <circle cx="67" cy="53" r="2" className="fill-white" />
      {/* Worried eyebrows */}
      <path
        d="M28 45 L42 50"
        className="stroke-foreground"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M72 45 L58 50"
        className="stroke-foreground"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Sweat drop */}
      <path
        d="M80 40 Q82 48, 80 52 Q78 48, 80 40"
        className="stroke-foreground fill-[#87CEEB]"
        strokeWidth="1"
      />
      {/* Worried mouth */}
      <path
        d="M40 80 Q50 75, 60 80"
        className="stroke-foreground"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
    </g>
  );
}

function EggySadFace() {
  return (
    <g>
      {/* Sad eyes */}
      <ellipse cx="35" cy="58" rx="5" ry="6" className="fill-foreground" />
      <ellipse cx="65" cy="58" rx="5" ry="6" className="fill-foreground" />
      <circle cx="37" cy="56" r="1.5" className="fill-white" />
      <circle cx="67" cy="56" r="1.5" className="fill-white" />
      {/* Sad eyebrows */}
      <path
        d="M28 48 L40 52"
        className="stroke-foreground"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M72 48 L60 52"
        className="stroke-foreground"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Tear */}
      <ellipse cx="28" cy="68" rx="3" ry="5" className="fill-[#87CEEB]" />
      {/* Sad mouth */}
      <path
        d="M38 82 Q50 72, 62 82"
        className="stroke-foreground"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
    </g>
  );
}

function EggyChefFace() {
  return (
    <g>
      {/* Chef hat */}
      <ellipse
        cx="50"
        cy="12"
        rx="30"
        ry="12"
        className="stroke-foreground fill-white"
        strokeWidth="2"
      />
      <rect
        x="25"
        y="10"
        width="50"
        height="15"
        className="stroke-foreground fill-white"
        strokeWidth="2"
      />
      <ellipse cx="50" cy="10" rx="25" ry="10" className="fill-white" />
      {/* Hat poof */}
      <circle
        cx="35"
        cy="8"
        r="10"
        className="stroke-foreground fill-white"
        strokeWidth="1.5"
      />
      <circle
        cx="50"
        cy="5"
        r="12"
        className="stroke-foreground fill-white"
        strokeWidth="1.5"
      />
      <circle
        cx="65"
        cy="8"
        r="10"
        className="stroke-foreground fill-white"
        strokeWidth="1.5"
      />
      {/* Happy chef eyes */}
      <ellipse cx="35" cy="55" rx="6" ry="7" className="fill-foreground" />
      <ellipse cx="65" cy="55" rx="6" ry="7" className="fill-foreground" />
      <circle cx="37" cy="53" r="2" className="fill-white" />
      <circle cx="67" cy="53" r="2" className="fill-white" />
      {/* Confident smile */}
      <path
        d="M35 75 Q50 88, 65 75"
        className="stroke-foreground"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Blush */}
      <ellipse cx="25" cy="70" rx="5" ry="3" className="fill-[#FFB6C1]/40" />
      <ellipse cx="75" cy="70" rx="5" ry="3" className="fill-[#FFB6C1]/40" />
    </g>
  );
}

function EggySleepingFace() {
  return (
    <g>
      {/* Closed eyes - lines */}
      <path
        d="M28 55 Q35 60, 42 55"
        className="stroke-foreground"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M58 55 Q65 60, 72 55"
        className="stroke-foreground"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Blush */}
      <ellipse cx="25" cy="68" rx="6" ry="4" className="fill-[#FFB6C1]/40" />
      <ellipse cx="75" cy="68" rx="6" ry="4" className="fill-[#FFB6C1]/40" />
      {/* Sleeping mouth */}
      <ellipse cx="50" cy="80" rx="4" ry="3" className="fill-foreground/20" />
      {/* Zzz */}
      <text x="78" y="35" className="fill-foreground text-[12px] font-bold">
        Z
      </text>
      <text x="85" y="25" className="fill-foreground text-[10px] font-bold">
        z
      </text>
      <text x="90" y="18" className="fill-foreground text-[8px] font-bold">
        z
      </text>
    </g>
  );
}

function EggyCrackedFace() {
  return (
    <g>
      {/* Crack lines on shell */}
      <path
        d="M30 40 L35 55 L28 65"
        className="stroke-foreground"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M70 35 L65 50 L72 60"
        className="stroke-foreground"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M50 20 L48 30 L52 38"
        className="stroke-foreground"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Happy but dizzy eyes */}
      <g>
        <ellipse cx="35" cy="55" rx="6" ry="7" className="fill-foreground" />
        <ellipse cx="65" cy="55" rx="6" ry="7" className="fill-foreground" />
        {/* Spiral eyes */}
        <circle cx="35" cy="55" r="3" className="fill-white" />
        <circle cx="65" cy="55" r="3" className="fill-white" />
        <circle cx="35" cy="55" r="1" className="fill-foreground" />
        <circle cx="65" cy="55" r="1" className="fill-foreground" />
      </g>
      {/* Smile */}
      <path
        d="M38 78 Q50 85, 62 78"
        className="stroke-foreground"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
    </g>
  );
}

/* ============================================
 * NEW MOOD FACES
 * ============================================ */

function EggyExcitedFace() {
  return (
    <g>
      {/* Big sparkling eyes */}
      <ellipse cx="35" cy="52" rx="8" ry="9" className="fill-foreground" />
      <ellipse cx="65" cy="52" rx="8" ry="9" className="fill-foreground" />
      {/* Big shine spots */}
      <circle cx="38" cy="49" r="3" className="fill-white" />
      <circle cx="68" cy="49" r="3" className="fill-white" />
      <circle cx="33" cy="54" r="1.5" className="fill-white" />
      <circle cx="63" cy="54" r="1.5" className="fill-white" />
      {/* Excited blush */}
      <ellipse cx="22" cy="68" rx="7" ry="5" className="fill-[#FFB6C1]/50" />
      <ellipse cx="78" cy="68" rx="7" ry="5" className="fill-[#FFB6C1]/50" />
      {/* Big open smile */}
      <path
        d="M32 72 Q50 95, 68 72"
        className="stroke-foreground fill-[#FDFBF7]"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Sparkles around */}
      <path
        d="M15 35 L18 40 L15 45"
        className="stroke-amber-400"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M85 35 L82 40 L85 45"
        className="stroke-amber-400"
        strokeWidth="2"
        fill="none"
      />
      <circle cx="20" cy="25" r="2" className="fill-amber-400" />
      <circle cx="80" cy="25" r="2" className="fill-amber-400" />
    </g>
  );
}

function EggyThinkingFace() {
  return (
    <g>
      {/* Eyes looking up */}
      <ellipse cx="35" cy="52" rx="6" ry="7" className="fill-foreground" />
      <ellipse cx="65" cy="52" rx="6" ry="7" className="fill-foreground" />
      {/* Pupils looking up-right */}
      <circle cx="38" cy="49" r="2" className="fill-white" />
      <circle cx="68" cy="49" r="2" className="fill-white" />
      {/* Raised eyebrow */}
      <path
        d="M28 42 Q35 38, 42 42"
        className="stroke-foreground"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      {/* Small thoughtful mouth */}
      <ellipse cx="50" cy="80" rx="5" ry="3" className="fill-foreground/30" />
      {/* Thinking dots */}
      <circle cx="78" cy="35" r="3" className="fill-foreground/60" />
      <circle cx="85" cy="25" r="4" className="fill-foreground/40" />
      <circle cx="90" cy="12" r="5" className="fill-foreground/20" />
    </g>
  );
}

function EggyTimerFace() {
  return (
    <g>
      {/* Timer/stopwatch on head */}
      <circle
        cx="50"
        cy="8"
        r="12"
        className="stroke-foreground fill-white"
        strokeWidth="2"
      />
      <circle
        cx="50"
        cy="8"
        r="8"
        className="stroke-foreground"
        strokeWidth="1"
        fill="none"
      />
      <line
        x1="50"
        y1="8"
        x2="50"
        y2="2"
        className="stroke-foreground"
        strokeWidth="2"
      />
      <line
        x1="50"
        y1="8"
        x2="55"
        y2="8"
        className="stroke-amber-500"
        strokeWidth="2"
      />
      {/* Button on top */}
      <rect
        x="47"
        y="-5"
        width="6"
        height="4"
        rx="1"
        className="fill-foreground"
      />
      {/* Concentrated eyes */}
      <ellipse cx="35" cy="55" rx="5" ry="6" className="fill-foreground" />
      <ellipse cx="65" cy="55" rx="5" ry="6" className="fill-foreground" />
      <circle cx="36" cy="53" r="1.5" className="fill-white" />
      <circle cx="66" cy="53" r="1.5" className="fill-white" />
      {/* Concentrated mouth - small line */}
      <path
        d="M42 78 L58 78"
        className="stroke-foreground"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Sweat drop */}
      <path
        d="M82 45 Q84 52, 82 56 Q80 52, 82 45"
        className="stroke-foreground fill-[#87CEEB]"
        strokeWidth="1"
      />
    </g>
  );
}

function EggyCookingFace() {
  return (
    <g>
      {/* Chef hat (smaller than chef mood) */}
      <ellipse
        cx="50"
        cy="15"
        rx="22"
        ry="8"
        className="stroke-foreground fill-white"
        strokeWidth="1.5"
      />
      <rect x="32" y="12" width="36" height="10" className="fill-white" />
      <circle
        cx="40"
        cy="10"
        r="7"
        className="stroke-foreground fill-white"
        strokeWidth="1"
      />
      <circle
        cx="50"
        cy="8"
        r="8"
        className="stroke-foreground fill-white"
        strokeWidth="1"
      />
      <circle
        cx="60"
        cy="10"
        r="7"
        className="stroke-foreground fill-white"
        strokeWidth="1"
      />
      {/* Spatula */}
      <rect
        x="82"
        y="50"
        width="4"
        height="25"
        rx="1"
        className="fill-amber-600"
      />
      <ellipse
        cx="84"
        cy="48"
        rx="8"
        ry="5"
        className="stroke-foreground fill-stone-400"
        strokeWidth="1"
      />
      {/* Happy eyes */}
      <ellipse cx="35" cy="55" rx="6" ry="7" className="fill-foreground" />
      <ellipse cx="65" cy="55" rx="6" ry="7" className="fill-foreground" />
      <circle cx="37" cy="53" r="2" className="fill-white" />
      <circle cx="67" cy="53" r="2" className="fill-white" />
      {/* Confident smile */}
      <path
        d="M35 75 Q50 88, 65 75"
        className="stroke-foreground"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Steam wisps */}
      <path
        d="M8 55 Q5 50, 8 45"
        className="stroke-foreground/40"
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M12 60 Q9 55, 12 50"
        className="stroke-foreground/30"
        strokeWidth="1.5"
        fill="none"
      />
    </g>
  );
}

function EggyHeroFace() {
  return (
    <g>
      {/* Cape behind */}
      <path
        d="M15 50 Q10 80, 20 110 L50 100 L80 110 Q90 80, 85 50"
        className="fill-amber-500/80 stroke-amber-600"
        strokeWidth="1"
      />
      {/* Mask */}
      <path
        d="M25 48 L35 52 L50 48 L65 52 L75 48 L75 58 Q50 65, 25 58 Z"
        className="fill-amber-500 stroke-amber-600"
        strokeWidth="1"
      />
      {/* Heroic eyes through mask */}
      <ellipse cx="35" cy="55" rx="5" ry="6" className="fill-white" />
      <ellipse cx="65" cy="55" rx="5" ry="6" className="fill-white" />
      <circle cx="36" cy="54" r="3" className="fill-foreground" />
      <circle cx="66" cy="54" r="3" className="fill-foreground" />
      <circle cx="37" cy="53" r="1" className="fill-white" />
      <circle cx="67" cy="53" r="1" className="fill-white" />
      {/* Determined smile */}
      <path
        d="M38 78 Q50 88, 62 78"
        className="stroke-foreground"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Wind effect lines */}
      <path
        d="M-5 60 L8 60"
        className="stroke-foreground/30"
        strokeWidth="1.5"
      />
      <path
        d="M-8 70 L5 70"
        className="stroke-foreground/20"
        strokeWidth="1.5"
      />
    </g>
  );
}

function EggyWavingFace() {
  return (
    <g>
      {/* Waving hand/arm */}
      <ellipse
        cx="88"
        cy="45"
        rx="8"
        ry="10"
        className="stroke-foreground fill-[#FDFBF7]"
        strokeWidth="1.5"
      />
      {/* Fingers */}
      <ellipse
        cx="85"
        cy="35"
        rx="3"
        ry="5"
        className="stroke-foreground fill-[#FDFBF7]"
        strokeWidth="1"
      />
      <ellipse
        cx="90"
        cy="34"
        rx="3"
        ry="5"
        className="stroke-foreground fill-[#FDFBF7]"
        strokeWidth="1"
      />
      <ellipse
        cx="95"
        cy="36"
        rx="3"
        ry="4"
        className="stroke-foreground fill-[#FDFBF7]"
        strokeWidth="1"
      />
      {/* Happy welcoming eyes */}
      <ellipse cx="35" cy="55" rx="6" ry="7" className="fill-foreground" />
      <ellipse cx="65" cy="55" rx="6" ry="7" className="fill-foreground" />
      <circle cx="37" cy="53" r="2" className="fill-white" />
      <circle cx="67" cy="53" r="2" className="fill-white" />
      {/* Blush */}
      <ellipse cx="25" cy="70" rx="6" ry="4" className="fill-[#FFB6C1]/40" />
      <ellipse cx="75" cy="70" rx="6" ry="4" className="fill-[#FFB6C1]/40" />
      {/* Big welcoming smile */}
      <path
        d="M32 75 Q50 92, 68 75"
        className="stroke-foreground"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
    </g>
  );
}

function EggyCelebratingFace() {
  return (
    <g>
      {/* Confetti */}
      <rect
        x="15"
        y="20"
        width="4"
        height="8"
        rx="1"
        className="fill-amber-400"
        transform="rotate(15 17 24)"
      />
      <rect
        x="80"
        y="15"
        width="4"
        height="8"
        rx="1"
        className="fill-emerald-400"
        transform="rotate(-20 82 19)"
      />
      <circle cx="25" cy="30" r="3" className="fill-pink-400" />
      <circle cx="78" cy="28" r="3" className="fill-cyan-400" />
      <rect
        x="10"
        y="40"
        width="3"
        height="6"
        rx="1"
        className="fill-purple-400"
        transform="rotate(30 11.5 43)"
      />
      <rect
        x="88"
        y="35"
        width="3"
        height="6"
        rx="1"
        className="fill-orange-400"
        transform="rotate(-25 89.5 38)"
      />
      {/* Party hat */}
      <path
        d="M35 20 L50 -5 L65 20"
        className="fill-amber-400 stroke-amber-500"
        strokeWidth="1"
      />
      <circle cx="50" cy="-8" r="4" className="fill-amber-300" />
      {/* Ecstatic eyes - closed happy */}
      <path
        d="M28 52 Q35 58, 42 52"
        className="stroke-foreground"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M58 52 Q65 58, 72 52"
        className="stroke-foreground"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Big blush */}
      <ellipse cx="25" cy="65" rx="7" ry="5" className="fill-[#FFB6C1]/50" />
      <ellipse cx="75" cy="65" rx="7" ry="5" className="fill-[#FFB6C1]/50" />
      {/* Huge smile */}
      <path
        d="M30 72 Q50 98, 70 72"
        className="stroke-foreground fill-[#FDFBF7]"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </g>
  );
}

function EggySearchingFace() {
  return (
    <g>
      {/* Magnifying glass */}
      <circle
        cx="25"
        cy="50"
        r="15"
        className="stroke-foreground fill-cyan-100/30"
        strokeWidth="2"
      />
      <line
        x1="36"
        y1="61"
        x2="48"
        y2="73"
        className="stroke-foreground"
        strokeWidth="4"
      />
      {/* One eye visible, one behind magnifier */}
      <ellipse cx="25" cy="50" rx="8" ry="10" className="fill-foreground" />
      <circle cx="27" cy="47" r="3" className="fill-white" />
      {/* Normal eye */}
      <ellipse cx="65" cy="55" rx="6" ry="7" className="fill-foreground" />
      <circle cx="67" cy="53" r="2" className="fill-white" />
      {/* Curious raised eyebrow */}
      <path
        d="M58 45 Q65 40, 72 45"
        className="stroke-foreground"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      {/* Small curious mouth */}
      <ellipse cx="55" cy="80" rx="6" ry="4" className="fill-foreground/20" />
    </g>
  );
}

function EggyFreshExtraFace() {
  return (
    <g>
      {/* Green glow effect behind */}
      <ellipse
        cx="50"
        cy="65"
        rx="45"
        ry="55"
        className="fill-emerald-400/20"
      />
      {/* Leaf crown */}
      <path
        d="M30 25 Q35 15, 40 20 Q42 10, 50 15 Q58 10, 60 20 Q65 15, 70 25"
        className="fill-emerald-500 stroke-emerald-600"
        strokeWidth="1"
      />
      {/* Sparkling fresh eyes */}
      <ellipse cx="35" cy="55" rx="6" ry="7" className="fill-foreground" />
      <ellipse cx="65" cy="55" rx="6" ry="7" className="fill-foreground" />
      <circle cx="37" cy="52" r="2.5" className="fill-white" />
      <circle cx="67" cy="52" r="2.5" className="fill-white" />
      <circle cx="33" cy="56" r="1" className="fill-emerald-400" />
      <circle cx="63" cy="56" r="1" className="fill-emerald-400" />
      {/* Fresh blush */}
      <ellipse cx="25" cy="70" rx="6" ry="4" className="fill-emerald-300/40" />
      <ellipse cx="75" cy="70" rx="6" ry="4" className="fill-emerald-300/40" />
      {/* Proud smile */}
      <path
        d="M35 75 Q50 88, 65 75"
        className="stroke-foreground"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Sparkles */}
      <circle cx="18" cy="40" r="2" className="fill-emerald-400" />
      <circle cx="82" cy="40" r="2" className="fill-emerald-400" />
    </g>
  );
}

function EggyExpiredWarningFace() {
  return (
    <g>
      {/* Warning sign above */}
      <path
        d="M50 0 L60 18 L40 18 Z"
        className="fill-red-500 stroke-red-600"
        strokeWidth="1"
      />
      <text x="47" y="15" className="fill-white text-[10px] font-bold">
        !
      </text>
      {/* Worried/panicked eyes */}
      <ellipse cx="35" cy="55" rx="7" ry="9" className="fill-foreground" />
      <ellipse cx="65" cy="55" rx="7" ry="9" className="fill-foreground" />
      {/* Small pupils - scared */}
      <circle cx="36" cy="54" r="2" className="fill-white" />
      <circle cx="66" cy="54" r="2" className="fill-white" />
      {/* Panicked eyebrows */}
      <path
        d="M25 42 L42 48"
        className="stroke-foreground"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M75 42 L58 48"
        className="stroke-foreground"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Sweat drops */}
      <path d="M20 45 Q22 52, 20 56 Q18 52, 20 45" className="fill-[#87CEEB]" />
      <path d="M80 42 Q82 49, 80 53 Q78 49, 80 42" className="fill-[#87CEEB]" />
      {/* Worried wavy mouth */}
      <path
        d="M35 82 Q42 78, 50 82 Q58 78, 65 82"
        className="stroke-foreground"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
    </g>
  );
}

export default Eggy;
