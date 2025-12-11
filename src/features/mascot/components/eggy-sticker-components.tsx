"use client";

import { motion } from "motion/react";

/**
 * ------------------------------------------------------------------
 * TOKENS DE COULEUR
 * ------------------------------------------------------------------
 */
export const COLORS = {
  brand: { primary: "#FBBF24", secondary: "#F59E0B" },
  ui: { dark: "#0C0A09", card: "#1C1917", text: "#E7E5E4" },
  sticker: { stroke: "#000000", strokeWidth: "2" },
};

// Neo-style shadow for sticker illustrations
export const NEO_STICKER_SHADOW = "drop-shadow(4px 4px 0px rgba(0,0,0,0.15))";

/**
 * ------------------------------------------------------------------
 * BASE SHAPES
 * ------------------------------------------------------------------
 */
export const BaseEggShape = ({
  fill = "#FFFFFF",
  stroke = "#000000",
  strokeWidth = "3",
}) => (
  <path
    d="M50 5 C 25 5, 5 35, 5 70 C 5 105, 25 115, 50 115 C 75 115, 95 105, 95 70 C 95 35, 75 5, 50 5 Z"
    fill={fill}
    stroke={stroke}
    strokeWidth={strokeWidth}
  />
);

/**
 * ------------------------------------------------------------------
 * COLLECTION EGGY (MASCOTTES - STYLE STICKER)
 * ------------------------------------------------------------------
 */

export const EggyHappy = ({ className = "w-32 h-32" }) => (
  <motion.div
    className={className}
    animate={{ y: [0, -5, 0] }}
    transition={{ repeat: Infinity, duration: 3 }}
  >
    <svg viewBox="0 0 100 120" className="h-full w-full drop-shadow-xl">
      <BaseEggShape />
      <g transform="translate(0, 10)">
        <circle cx="35" cy="55" r="4" fill="#000" />
        <circle cx="65" cy="55" r="4" fill="#000" />
        <path
          d="M40 70 Q 50 80 60 70"
          stroke="#000"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
      </g>
    </svg>
  </motion.div>
);

export const EggyCool = ({ className = "w-32 h-32" }) => (
  <motion.div className={className} whileHover={{ scale: 1.1 }}>
    <svg viewBox="0 0 120 120" className="h-full w-full drop-shadow-xl">
      <g transform="translate(10, 0)">
        <BaseEggShape />
        <g transform="translate(0, 10)">
          <path
            d="M15 50 L 85 50 L 85 65 Q 85 80 70 80 L 65 80 Q 50 80 50 65 L 50 50 L 50 65 Q 50 80 35 80 L 30 80 Q 15 80 15 65 Z"
            fill="#000"
          />
          <path
            d="M20 55 L 40 55 C 35 70 25 70 20 55"
            fill="#333"
            opacity="0.5"
          />
          <path
            d="M60 55 L 80 55 C 75 70 65 70 60 55"
            fill="#333"
            opacity="0.5"
          />
          <path
            d="M40 85 Q 50 95 60 85"
            stroke="#000"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
        </g>
        <g transform="translate(-20, 40) rotate(-20)">
          <rect x="0" y="0" width="10" height="40" fill="#000" rx="2" />
          <path
            d="M-10 -30 L 20 -30 L 20 0 L -10 0 Z"
            fill="#333"
            stroke="#000"
            strokeWidth="2"
          />
          <line
            x1="0"
            y1="-20"
            x2="10"
            y2="-20"
            stroke="#FFF"
            strokeWidth="2"
          />
          <line
            x1="0"
            y1="-10"
            x2="10"
            y2="-10"
            stroke="#FFF"
            strokeWidth="2"
          />
        </g>
        <path
          d="M15 60 Q -5 50 5 40"
          stroke="#000"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M85 60 Q 105 50 95 65"
          stroke="#000"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />
      </g>
    </svg>
  </motion.div>
);

export const EggyChefMix = ({ className = "w-32 h-32" }) => (
  <motion.div className={className}>
    <svg viewBox="-20 0 160 130" className="h-full w-full drop-shadow-xl">
      <g transform="translate(20, 10)">
        <BaseEggShape />
        <g transform="translate(0, -15)">
          <path
            d="M20 15 C 20 0, 40 -10, 50 5 C 60 -10, 80 0, 80 15 L 80 25 L 20 25 Z"
            fill="#FFF"
            stroke="#000"
            strokeWidth="3"
          />
          <rect
            x="22"
            y="25"
            width="56"
            height="10"
            fill="#FBBF24"
            stroke="#000"
            strokeWidth="3"
          />
        </g>
        <g transform="translate(0, 15)">
          <circle cx="35" cy="50" r="3" fill="#000" />
          <circle cx="65" cy="50" r="3" fill="#000" />
          <path
            d="M40 60 Q 50 70 60 60"
            stroke="#000"
            strokeWidth="2"
            fill="none"
          />
          <path d="M52 65 Q 55 75 58 65" fill="#EF4444" />
        </g>
        <g transform="translate(-10, 50)">
          <path
            d="M10 20 L -10 10"
            stroke="#000"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <g transform="translate(-25, -10) rotate(-15)">
            <path d="M10 0 L 10 20" stroke="#666" strokeWidth="3" />
            <ellipse
              cx="10"
              cy="-10"
              rx="8"
              ry="12"
              stroke="#666"
              strokeWidth="2"
              fill="none"
            />
            <ellipse
              cx="10"
              cy="-10"
              rx="4"
              ry="10"
              stroke="#666"
              strokeWidth="2"
              fill="none"
            />
          </g>
        </g>
        <g transform="translate(90, 60)">
          <path
            d="M-5 10 L 15 20"
            stroke="#000"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M0 0 L 30 0 C 30 15, 15 25, 0 25 C -15 25, -30 15, -30 0 Z"
            fill="#A8A29E"
            stroke="#000"
            strokeWidth="3"
          />
          <path d="M-25 2 Q 0 10 25 2" fill="#FCD34D" />
        </g>
      </g>
    </svg>
  </motion.div>
);

export const EggyScared = ({ className = "w-32 h-32" }) => (
  <motion.div
    className={className}
    animate={{ rotate: [-2, 2, -2] }}
    transition={{ repeat: Infinity, duration: 0.2 }}
  >
    <svg viewBox="0 0 100 120" className="h-full w-full drop-shadow-xl">
      <BaseEggShape />
      <path
        d="M50 5 L 40 25 L 55 35"
        stroke="#000"
        strokeWidth="2"
        fill="none"
      />
      <g transform="translate(0, 15)">
        <path
          d="M30 45 L 40 50"
          stroke="#000"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M70 45 L 60 50"
          stroke="#000"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle cx="35" cy="60" r="3" fill="#000" />
        <circle cx="65" cy="60" r="3" fill="#000" />
        <path
          d="M40 80 Q 50 70 60 80"
          stroke="#000"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M85 30 Q 90 40 85 45 Q 80 40 85 30"
          fill="#38BDF8"
          stroke="#000"
          strokeWidth="1"
        />
      </g>
    </svg>
  </motion.div>
);

// --- NOUVEAUX PERSONNAGES ---

export const EggyZen = ({ className = "w-32 h-32" }) => (
  <motion.div
    className={className}
    animate={{ y: [0, -10, 0] }}
    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
  >
    <svg viewBox="0 0 100 120" className="h-full w-full drop-shadow-xl">
      <BaseEggShape />
      {/* Lotus Flower on head */}
      <path
        d="M50 5 Q 35 -5 50 -15 Q 65 -5 50 5"
        fill="#F472B6"
        stroke="#000"
        strokeWidth="2"
      />
      <path
        d="M50 5 Q 20 0 30 -10 Q 40 5 50 5"
        fill="#F472B6"
        stroke="#000"
        strokeWidth="2"
      />
      <path
        d="M50 5 Q 80 0 70 -10 Q 60 5 50 5"
        fill="#F472B6"
        stroke="#000"
        strokeWidth="2"
      />

      <g transform="translate(0, 15)">
        {/* Closed Eyes */}
        <path
          d="M30 55 Q 35 60 40 55"
          stroke="#000"
          strokeWidth="3"
          fill="none"
        />
        <path
          d="M60 55 Q 65 60 70 55"
          stroke="#000"
          strokeWidth="3"
          fill="none"
        />
        {/* Calm smile */}
        <path
          d="M45 70 Q 50 72 55 70"
          stroke="#000"
          strokeWidth="2"
          fill="none"
        />
        {/* Hands in Mudra */}
        <circle
          cx="20"
          cy="80"
          r="6"
          fill="#FFF"
          stroke="#000"
          strokeWidth="2"
        />
        <circle
          cx="80"
          cy="80"
          r="6"
          fill="#FFF"
          stroke="#000"
          strokeWidth="2"
        />
      </g>
    </svg>
  </motion.div>
);

export const EggyGamer = ({ className = "w-32 h-32" }) => (
  <motion.div className={className}>
    <svg viewBox="0 0 120 120" className="h-full w-full drop-shadow-xl">
      <g transform="translate(10, 0)">
        <BaseEggShape />
        {/* Headset */}
        <path
          d="M15 60 L 15 40 C 15 20, 35 10, 50 10 C 65 10, 85 20, 85 40 L 85 60"
          fill="none"
          stroke="#333"
          strokeWidth="6"
        />
        <rect
          x="5"
          y="45"
          width="15"
          height="30"
          rx="5"
          fill="#EF4444"
          stroke="#000"
          strokeWidth="3"
        />
        <rect
          x="80"
          y="45"
          width="15"
          height="30"
          rx="5"
          fill="#EF4444"
          stroke="#000"
          strokeWidth="3"
        />
        {/* Mic */}
        <path d="M10 70 L -10 85" stroke="#000" strokeWidth="3" />
        <circle
          cx="-10"
          cy="85"
          r="5"
          fill="#333"
          stroke="#000"
          strokeWidth="2"
        />

        <g transform="translate(0, 10)">
          {/* Intense Eyes */}
          <path d="M30 50 L 45 50" stroke="#000" strokeWidth="4" />
          <path d="M55 50 L 70 50" stroke="#000" strokeWidth="4" />
          {/* Tongue out concentration */}
          <path
            d="M45 75 Q 50 80 55 75"
            stroke="#000"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M55 75 Q 60 80 55 85 Q 50 80 55 75"
            fill="#F472B6"
            stroke="#000"
            strokeWidth="1"
          />
        </g>
      </g>
    </svg>
  </motion.div>
);

export const EggySick = ({ className = "w-32 h-32" }) => (
  <motion.div
    className={className}
    animate={{ x: [-1, 1, -1] }}
    transition={{ repeat: Infinity, duration: 0.1 }}
  >
    <svg viewBox="0 0 100 120" className="h-full w-full drop-shadow-xl">
      <BaseEggShape fill="#ECFCCB" /> {/* Green tint */}
      <g transform="translate(0, 15)">
        {/* Sick Eyes */}
        <path
          d="M30 50 L 40 55 M 40 50 L 30 55"
          stroke="#000"
          strokeWidth="2"
        />
        <path
          d="M60 50 L 70 55 M 70 50 L 60 55"
          stroke="#000"
          strokeWidth="2"
        />
        {/* Thermometer */}
        <line
          x1="40"
          y1="75"
          x2="80"
          y2="65"
          stroke="#FFF"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <line
          x1="40"
          y1="75"
          x2="80"
          y2="65"
          stroke="#EF4444"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="5,2"
        />
        <circle cx="40" cy="75" r="5" fill="#EF4444" />
        {/* Ice pack */}
        <path
          d="M30 20 Q 50 10 70 20 L 75 30 Q 50 40 25 30 Z"
          fill="#60A5FA"
          stroke="#000"
          strokeWidth="2"
        />
      </g>
    </svg>
  </motion.div>
);

export const EggyParty = ({ className = "w-32 h-32" }) => (
  <motion.div
    className={className}
    animate={{ rotate: [-5, 5, -5] }}
    transition={{ repeat: Infinity, duration: 2 }}
  >
    <svg viewBox="0 0 100 130" className="h-full w-full drop-shadow-xl">
      <g transform="translate(0, 15)">
        <BaseEggShape />
        {/* Face */}
        <g transform="translate(0, 10)">
          <circle cx="35" cy="55" r="4" fill="#000" />
          <circle cx="65" cy="55" r="4" fill="#000" />
          <path
            d="M40 70 Q 50 85 60 70"
            stroke="#000"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
        </g>
        {/* Party Hat */}
        <g transform="translate(50, 5) rotate(15)">
          <path
            d="M-15 0 L 15 0 L 0 -40 Z"
            fill="#8B5CF6"
            stroke="#000"
            strokeWidth="2"
          />
          <circle
            cx="0"
            cy="-40"
            r="4"
            fill="#FCD34D"
            stroke="#000"
            strokeWidth="2"
          />
        </g>
        {/* Confetti */}
        <rect
          x="10"
          y="20"
          width="5"
          height="5"
          fill="#EF4444"
          transform="rotate(20)"
        />
        <rect
          x="85"
          y="30"
          width="5"
          height="5"
          fill="#3B82F6"
          transform="rotate(-10)"
        />
        <circle cx="20" cy="90" r="3" fill="#10B981" />
      </g>
    </svg>
  </motion.div>
);

export const EggyNinja = ({ className = "w-32 h-32" }) => (
  <motion.div className={className}>
    <svg viewBox="0 0 100 120" className="h-full w-full drop-shadow-xl">
      <BaseEggShape />
      {/* Headband */}
      <path
        d="M10 40 Q 50 50 90 40 L 90 55 Q 50 65 10 55 Z"
        fill="#EF4444"
        stroke="#000"
        strokeWidth="2"
      />
      {/* Bandana tie */}
      <path
        d="M85 45 L 100 40 L 95 55 Z"
        fill="#EF4444"
        stroke="#000"
        strokeWidth="2"
      />

      <g transform="translate(0, 10)">
        {/* Angry Eyes visible through mask gap? No just white eyes on red band */}
        <path d="M25 50 L 40 55" stroke="#FFF" strokeWidth="3" />
        <path d="M75 50 L 60 55" stroke="#FFF" strokeWidth="3" />
        <circle cx="35" cy="58" r="2" fill="#FFF" />
        <circle cx="65" cy="58" r="2" fill="#FFF" />
      </g>
      {/* Ninja Star held */}
      <g transform="translate(20, 80)">
        <path
          d="M0 0 L 5 10 L 15 5 L 10 15 L 20 20 L 10 25 L 15 35 L 5 30 L 0 40 L -5 30 L -15 35 L -10 25 L -20 20 L -10 15 L -15 5 L -5 10 Z"
          fill="#9CA3AF"
          stroke="#000"
          strokeWidth="1"
          transform="scale(0.5)"
        />
      </g>
    </svg>
  </motion.div>
);

/**
 * ------------------------------------------------------------------
 * ILLUSTRATIONS DE SCÈNE & ICONES FUN
 * ------------------------------------------------------------------
 */

export const IlluFridgeWeb = ({ className = "w-48 h-48" }) => (
  <svg viewBox="0 0 200 200" className={className}>
    <rect
      x="40"
      y="20"
      width="100"
      height="160"
      rx="10"
      fill="#6EE7B7"
      stroke="#000"
      strokeWidth="4"
    />
    <rect
      x="50"
      y="30"
      width="80"
      height="140"
      rx="5"
      fill="#FFF"
      stroke="#000"
      strokeWidth="3"
    />
    <line x1="50" y1="70" x2="130" y2="70" stroke="#000" strokeWidth="2" />
    <line x1="50" y1="110" x2="130" y2="110" stroke="#000" strokeWidth="2" />
    <path
      d="M50 30 L 90 30 L 90 70"
      fill="none"
      stroke="#000"
      strokeWidth="1.5"
    />
    <line x1="50" y1="30" x2="80" y2="60" stroke="#000" strokeWidth="1" />
    <circle cx="80" cy="65" r="4" fill="#000" />
    <line x1="80" y1="30" x2="80" y2="65" stroke="#000" strokeWidth="1" />
    <path
      d="M140 20 L 180 35 L 180 165 L 140 180"
      fill="#A7F3D0"
      stroke="#000"
      strokeWidth="3"
      strokeLinejoin="round"
    />
  </svg>
);

export const IlluFreshnessScale = ({ className = "w-full h-32" }) => (
  <div className={`relative ${className} flex items-center justify-center`}>
    <svg viewBox="0 0 400 120" className="h-full w-full">
      <rect
        x="20"
        y="80"
        width="360"
        height="30"
        rx="15"
        fill="#FFF"
        stroke="#000"
        strokeWidth="4"
      />
      <rect x="25" y="85" width="110" height="20" rx="10" fill="#34D399" />
      <rect x="145" y="85" width="110" height="20" rx="10" fill="#FCD34D" />
      <rect x="265" y="85" width="110" height="20" rx="10" fill="#EF4444" />
      <text x="80" y="100" textAnchor="middle" fontSize="12" fontWeight="bold">
        FRESH
      </text>
      <text x="200" y="100" textAnchor="middle" fontSize="12" fontWeight="bold">
        OKAY
      </text>
      <text x="320" y="100" textAnchor="middle" fontSize="12" fontWeight="bold">
        EXPIRED
      </text>
      <g transform="translate(180, 20)">
        <path d="M10 50 L 5 60 L 15 60 Z" fill="#000" />
        <path d="M30 50 L 25 60 L 35 60 Z" fill="#000" />
        <path
          d="M20 5 C 5 5, -5 30, 0 55 L 40 55 C 45 30, 35 5, 20 5 Z"
          fill="#FFF"
          stroke="#000"
          strokeWidth="3"
        />
        <circle cx="15" cy="25" r="2" fill="#000" />
        <circle cx="25" cy="25" r="2" fill="#000" />
        <path
          d="M18 30 Q 20 33 22 30"
          stroke="#000"
          strokeWidth="2"
          fill="none"
        />
        <line x1="40" y1="30" x2="40" y2="10" stroke="#000" strokeWidth="2" />
        <path
          d="M40 10 L 55 15 L 40 20"
          fill="#FCD34D"
          stroke="#000"
          strokeWidth="2"
        />
      </g>
    </svg>
  </div>
);

// --- NOUVELLES ILLUSTRATIONS FUN ---

export const IlluChickenMom = ({ className = "w-32 h-32" }) => (
  <svg viewBox="0 0 100 100" className={className}>
    {/* Hen Body */}
    <path
      d="M20 50 Q 20 20 50 20 Q 80 20 80 50 Q 80 80 50 80 L 20 80 Z"
      fill="#FFF"
      stroke="#000"
      strokeWidth="3"
    />
    {/* Comb */}
    <path
      d="M40 20 Q 40 10 45 15 Q 50 5 55 15 Q 60 10 60 20"
      fill="#EF4444"
      stroke="#000"
      strokeWidth="2"
    />
    {/* Beak */}
    <path
      d="M75 40 L 85 45 L 75 50"
      fill="#FBBF24"
      stroke="#000"
      strokeWidth="2"
    />
    {/* Eye */}
    <circle cx="65" cy="40" r="3" fill="#000" />
    {/* Question Mark */}
    <text x="85" y="30" fontSize="20" fontWeight="bold" fill="#000">
      ?
    </text>
    {/* Egg below */}
    <ellipse
      cx="30"
      cy="85"
      rx="8"
      ry="10"
      fill="#FDE68A"
      stroke="#000"
      strokeWidth="2"
    />
  </svg>
);

export const IlluBrokenHeart = ({ className = "w-32 h-32" }) => (
  <svg viewBox="0 0 100 100" className={className}>
    <path
      d="M50 10 C 25 10, 10 40, 10 70 C 10 90, 30 95, 50 95 C 70 95, 90 90, 90 70 C 90 40, 75 10, 50 10 Z"
      fill="#FEE2E2"
      stroke="#000"
      strokeWidth="3"
    />
    {/* Crack */}
    <path
      d="M50 10 L 40 40 L 60 60 L 50 95"
      stroke="#000"
      strokeWidth="2"
      fill="none"
    />
    {/* Bandage */}
    <rect
      x="30"
      y="45"
      width="40"
      height="15"
      rx="2"
      fill="#FCD34D"
      stroke="#000"
      strokeWidth="2"
      transform="rotate(-15 50 52)"
    />
    <circle cx="45" cy="50" r="1" fill="#FFF" />
    <circle cx="55" cy="53" r="1" fill="#FFF" />
  </svg>
);

export const IlluPanFace = ({ className = "w-32 h-32" }) => (
  <svg viewBox="0 0 100 100" className={className}>
    {/* Handle */}
    <rect
      x="70"
      y="70"
      width="30"
      height="10"
      rx="5"
      fill="#4B5563"
      stroke="#000"
      strokeWidth="3"
      transform="rotate(45 70 70)"
    />
    {/* Pan */}
    <circle
      cx="45"
      cy="45"
      r="35"
      fill="#1F2937"
      stroke="#000"
      strokeWidth="3"
    />
    <circle cx="45" cy="45" r="28" fill="#374151" />
    {/* Face */}
    <circle cx="35" cy="40" r="3" fill="#FFF" />
    <circle cx="55" cy="40" r="3" fill="#FFF" />
    <path
      d="M35 55 Q 45 65 55 55"
      stroke="#FFF"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
    />
  </svg>
);

// --- ICONES UI STICKER ---

export const IconTrashSticker = ({ className = "w-16 h-16" }) => (
  <svg viewBox="0 0 100 100" className={className}>
    <path
      d="M30 35 L 35 85 Q 36 90 50 90 Q 64 90 65 85 L 70 35"
      fill="#FFF"
      stroke="#000"
      strokeWidth="3"
    />
    <rect
      x="25"
      y="25"
      width="50"
      height="10"
      rx="3"
      fill="#FFF"
      stroke="#000"
      strokeWidth="3"
    />
    <path
      d="M40 25 L 40 20 Q 40 15 50 15 Q 60 15 60 20 L 60 25"
      fill="none"
      stroke="#000"
      strokeWidth="3"
    />
  </svg>
);

export const IconTimerSticker = ({ className = "w-16 h-16" }) => (
  <svg viewBox="0 0 100 100" className={className}>
    <path
      d="M25 25 L 75 25"
      stroke="#000"
      strokeWidth="4"
      strokeLinecap="round"
    />
    <path
      d="M25 75 L 75 75"
      stroke="#000"
      strokeWidth="4"
      strokeLinecap="round"
    />
    <path
      d="M30 25 Q 30 50 50 50 Q 70 50 70 25"
      fill="#FFF"
      stroke="#000"
      strokeWidth="3"
    />
    <path
      d="M30 75 Q 30 50 50 50 Q 70 50 70 75"
      fill="#FCD34D"
      stroke="#000"
      strokeWidth="3"
    />
    <circle cx="50" cy="55" r="1" fill="#F59E0B" />
    <circle cx="50" cy="60" r="1" fill="#F59E0B" />
  </svg>
);

export const IconChefHatSticker = ({ className = "w-16 h-16" }) => (
  <svg viewBox="0 0 100 100" className={className}>
    <path
      d="M25 65 L 75 65 L 75 80 Q 50 85 25 80 Z"
      fill="#FCD34D"
      stroke="#000"
      strokeWidth="3"
    />
    <path
      d="M25 65 C 10 50, 20 20, 50 20 C 80 20, 90 50, 75 65"
      fill="#FFF"
      stroke="#000"
      strokeWidth="3"
    />
  </svg>
);
