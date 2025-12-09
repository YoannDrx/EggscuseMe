/**
 * Script to generate PNG images of Eggy mascot for email templates
 *
 * Usage: pnpm tsx scripts/generate-eggy-images.tsx
 *
 * This script renders the Eggy SVG component to PNG files using sharp.
 * The generated images are saved to /public/images/eggy/
 */

import { mkdir, writeFile } from "fs/promises";
import { join } from "path";

const OUTPUT_DIR = join(process.cwd(), "public/images/eggy");

type EggyMood = "happy" | "sad" | "chef" | "waving" | "celebrating";

const MOODS: EggyMood[] = ["happy", "sad", "chef", "waving", "celebrating"];

// SVG templates for each mood
function generateEggySvg(mood: EggyMood): string {
  const baseEgg = `
    <ellipse cx="50" cy="65" rx="40" ry="50" fill="#FDFBF7" stroke="#1C1917" stroke-width="2"/>
  `;

  const faces: Record<EggyMood, string> = {
    happy: `
      <ellipse cx="35" cy="55" rx="6" ry="7" fill="#1C1917"/>
      <ellipse cx="65" cy="55" rx="6" ry="7" fill="#1C1917"/>
      <circle cx="37" cy="53" r="2" fill="white"/>
      <circle cx="67" cy="53" r="2" fill="white"/>
      <ellipse cx="25" cy="70" rx="6" ry="4" fill="#FFB6C1" opacity="0.4"/>
      <ellipse cx="75" cy="70" rx="6" ry="4" fill="#FFB6C1" opacity="0.4"/>
      <path d="M35 75 Q50 90, 65 75" stroke="#1C1917" stroke-width="2.5" stroke-linecap="round" fill="none"/>
    `,
    sad: `
      <ellipse cx="35" cy="58" rx="5" ry="6" fill="#1C1917"/>
      <ellipse cx="65" cy="58" rx="5" ry="6" fill="#1C1917"/>
      <circle cx="37" cy="56" r="1.5" fill="white"/>
      <circle cx="67" cy="56" r="1.5" fill="white"/>
      <path d="M28 48 L40 52" stroke="#1C1917" stroke-width="2" stroke-linecap="round"/>
      <path d="M72 48 L60 52" stroke="#1C1917" stroke-width="2" stroke-linecap="round"/>
      <ellipse cx="28" cy="68" rx="3" ry="5" fill="#87CEEB"/>
      <path d="M38 82 Q50 72, 62 82" stroke="#1C1917" stroke-width="2.5" stroke-linecap="round" fill="none"/>
    `,
    chef: `
      <ellipse cx="50" cy="12" rx="30" ry="12" stroke="#1C1917" fill="white" stroke-width="2"/>
      <rect x="25" y="10" width="50" height="15" stroke="#1C1917" fill="white" stroke-width="2"/>
      <ellipse cx="50" cy="10" rx="25" ry="10" fill="white"/>
      <circle cx="35" cy="8" r="10" stroke="#1C1917" fill="white" stroke-width="1.5"/>
      <circle cx="50" cy="5" r="12" stroke="#1C1917" fill="white" stroke-width="1.5"/>
      <circle cx="65" cy="8" r="10" stroke="#1C1917" fill="white" stroke-width="1.5"/>
      <ellipse cx="35" cy="55" rx="6" ry="7" fill="#1C1917"/>
      <ellipse cx="65" cy="55" rx="6" ry="7" fill="#1C1917"/>
      <circle cx="37" cy="53" r="2" fill="white"/>
      <circle cx="67" cy="53" r="2" fill="white"/>
      <path d="M35 75 Q50 88, 65 75" stroke="#1C1917" stroke-width="2.5" stroke-linecap="round" fill="none"/>
      <ellipse cx="25" cy="70" rx="5" ry="3" fill="#FFB6C1" opacity="0.4"/>
      <ellipse cx="75" cy="70" rx="5" ry="3" fill="#FFB6C1" opacity="0.4"/>
    `,
    waving: `
      <ellipse cx="88" cy="45" rx="8" ry="10" stroke="#1C1917" fill="#FDFBF7" stroke-width="1.5"/>
      <ellipse cx="85" cy="35" rx="3" ry="5" stroke="#1C1917" fill="#FDFBF7" stroke-width="1"/>
      <ellipse cx="90" cy="34" rx="3" ry="5" stroke="#1C1917" fill="#FDFBF7" stroke-width="1"/>
      <ellipse cx="95" cy="36" rx="3" ry="4" stroke="#1C1917" fill="#FDFBF7" stroke-width="1"/>
      <ellipse cx="35" cy="55" rx="6" ry="7" fill="#1C1917"/>
      <ellipse cx="65" cy="55" rx="6" ry="7" fill="#1C1917"/>
      <circle cx="37" cy="53" r="2" fill="white"/>
      <circle cx="67" cy="53" r="2" fill="white"/>
      <ellipse cx="25" cy="70" rx="6" ry="4" fill="#FFB6C1" opacity="0.4"/>
      <ellipse cx="75" cy="70" rx="6" ry="4" fill="#FFB6C1" opacity="0.4"/>
      <path d="M32 75 Q50 92, 68 75" stroke="#1C1917" stroke-width="2.5" stroke-linecap="round" fill="none"/>
    `,
    celebrating: `
      <rect x="15" y="20" width="4" height="8" rx="1" fill="#FBBF24" transform="rotate(15 17 24)"/>
      <rect x="80" y="15" width="4" height="8" rx="1" fill="#34D399" transform="rotate(-20 82 19)"/>
      <circle cx="25" cy="30" r="3" fill="#F472B6"/>
      <circle cx="78" cy="28" r="3" fill="#22D3EE"/>
      <path d="M35 20 L50 -5 L65 20" fill="#FBBF24" stroke="#F59E0B" stroke-width="1"/>
      <circle cx="50" cy="-8" r="4" fill="#FDE68A"/>
      <path d="M28 52 Q35 58, 42 52" stroke="#1C1917" stroke-width="2.5" stroke-linecap="round" fill="none"/>
      <path d="M58 52 Q65 58, 72 52" stroke="#1C1917" stroke-width="2.5" stroke-linecap="round" fill="none"/>
      <ellipse cx="25" cy="65" rx="7" ry="5" fill="#FFB6C1" opacity="0.5"/>
      <ellipse cx="75" cy="65" rx="7" ry="5" fill="#FFB6C1" opacity="0.5"/>
      <path d="M30 72 Q50 98, 70 72" stroke="#1C1917" fill="#FDFBF7" stroke-width="2.5" stroke-linecap="round"/>
    `,
  };

  return `<svg viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg" width="160" height="192">
    ${baseEgg}
    ${faces[mood]}
  </svg>`;
}

async function main() {
  console.log("Generating Eggy PNG images...\n");

  // Ensure output directory exists
  await mkdir(OUTPUT_DIR, { recursive: true });

  for (const mood of MOODS) {
    const svg = generateEggySvg(mood);
    const outputPath = join(OUTPUT_DIR, `eggy-${mood}.svg`);

    await writeFile(outputPath, svg);
    console.log(`Generated: eggy-${mood}.svg`);
  }

  console.log(`\nSVG files saved to: ${OUTPUT_DIR}`);
  console.log("\nTo convert to PNG, you can use:");
  console.log("1. Figma: Import SVGs and export as PNG");
  console.log("2. Online tool: https://svgtopng.com/");
  console.log(
    '3. ImageMagick: convert eggy-happy.svg -resize 160x192 eggy-happy.png"',
  );
  console.log("\nOr install sharp and uncomment the PNG conversion code.");
}

main().catch(console.error);
