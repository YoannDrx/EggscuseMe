"use client";

import { motion } from 'motion/react';

export type EggyMood = "happy" | "chef" | "timer" | "sad";

type EggyProps = {
  mood?: EggyMood;
  size?: "sm" | "md" | "lg";
};

const Eggy = ({ mood = "happy", size = "md" }: EggyProps) => {
  const sizeClasses = { sm: "w-12 h-12", md: "w-24 h-24", lg: "w-40 h-40" };

  const variants = {
    happy: {
      y: [0, -5, 0],
      transition: { repeat: Infinity, duration: 3, ease: "easeInOut" as const },
    },
    chef: {
      rotate: [0, 5, 0, -5, 0],
      transition: { repeat: Infinity, duration: 4 },
    },
    timer: {
      scale: [1, 1.05, 1],
      transition: { repeat: Infinity, duration: 1 },
    },
    sad: { y: 5, rotate: 10 },
  };

  return (
    <motion.div
      className={`${sizeClasses[size]} relative flex items-center justify-center`}
      animate={mood}
      variants={variants}
    >
      <svg viewBox="0 0 100 120" className="h-full w-full drop-shadow-xl">
        <path
          d="M50 5 C 25 5, 5 35, 5 70 C 5 105, 25 115, 50 115 C 75 115, 95 105, 95 70 C 95 35, 75 5, 50 5 Z"
          fill="#FBFBF2"
          stroke="#D6D3D1"
          strokeWidth="2"
        />
        {mood === "happy" && (
          <g transform="translate(0, 10)">
            <circle cx="35" cy="55" r="4" fill="#1C1917" />
            <circle cx="65" cy="55" r="4" fill="#1C1917" />
            <path
              d="M40 70 Q 50 80 60 70"
              stroke="#1C1917"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
            <circle cx="30" cy="65" r="3" fill="#F472B6" opacity="0.5" />
            <circle cx="70" cy="65" r="3" fill="#F472B6" opacity="0.5" />
          </g>
        )}
        {mood === "chef" && (
          <>
            <g transform="translate(0, 10)">
              <path
                d="M35 75 Q 50 65 65 75"
                stroke="#1C1917"
                strokeWidth="2"
                fill="none"
              />
              <circle cx="35" cy="55" r="4" fill="#1C1917" />
              <circle cx="65" cy="55" r="4" fill="#1C1917" />
            </g>
            <path
              d="M30 15 L 30 5 C 30 -10, 70 -10, 70 5 L 70 15 Z"
              fill="#FFFFFF"
              stroke="#E5E5E5"
              strokeWidth="1"
            />
            <path
              d="M25 15 L 75 15 L 75 25 L 25 25 Z"
              fill="#FFFFFF"
              stroke="#E5E5E5"
              strokeWidth="1"
            />
          </>
        )}
        {mood === "timer" && (
          <g transform="translate(0, 10)">
            <circle cx="35" cy="55" r="4" fill="#1C1917" />
            <circle cx="65" cy="55" r="4" fill="#1C1917" />
            <path
              d="M45 75 Q 50 70 55 75"
              stroke="#1C1917"
              strokeWidth="2"
              fill="none"
            />
            <path d="M80 30 Q 85 40 80 45 Q 75 40 80 30" fill="#38BDF8" />
          </g>
        )}
      </svg>
    </motion.div>
  );
};

export default Eggy;
