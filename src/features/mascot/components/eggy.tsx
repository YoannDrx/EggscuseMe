"use client";

import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

export type EggyMood =
  | "happy"
  | "worried"
  | "sad"
  | "chef"
  | "sleeping"
  | "cracked";

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
  happy: "animate-[bounce-subtle_2s_ease-in-out_infinite]",
  worried: "animate-[wobble_0.5s_ease-in-out_infinite]",
  sad: "",
  chef: "animate-[float_3s_ease-in-out_infinite]",
  sleeping: "",
  cracked: "animate-[crack_0.3s_ease-in-out]",
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

export default Eggy;
