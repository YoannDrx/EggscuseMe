"use client";

import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";
import {
  EggyHappy,
  EggyCool,
  EggyChefMix,
  EggyScared,
  EggyZen,
  EggySick,
  EggyParty,
  EggyNinja,
  IconTimerSticker,
} from "./eggy-sticker-components";

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

type EggyProps = ComponentProps<"div"> & {
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

export function Eggy({
  mood = "happy",
  size = "md",
  animate: _animate = true, // Animation is built-in to the components
  className,
  ...props
}: EggyProps) {
  const finalClass = cn(sizeMap[size], className);

  // Mapping logic
  switch (mood) {
    case "happy":
    case "waving":
    case "fresh-extra":
      return <EggyHappy className={finalClass} {...props} />;

    case "chef":
    case "cooking":
      return <EggyChefMix className={finalClass} {...props} />;

    case "worried":
    case "expired-warning":
    case "cracked": // Fallback for cracked
      return <EggyScared className={finalClass} {...props} />;

    case "sad":
      return <EggySick className={finalClass} {...props} />;

    case "sleeping":
    case "thinking":
      return <EggyZen className={finalClass} {...props} />;

    case "excited":
    case "celebrating":
      return <EggyParty className={finalClass} {...props} />;

    case "timer":
      // Wrapping IconTimerSticker in a div to ensure sizing works if it expects specific props
      return (
        <div className={finalClass} {...props}>
          <IconTimerSticker className="h-full w-full" />
        </div>
      );

    case "searching":
      return <EggyCool className={finalClass} {...props} />;

    case "hero":
      return <EggyNinja className={finalClass} {...props} />;

    default:
      return <EggyHappy className={finalClass} {...props} />;
  }
}
