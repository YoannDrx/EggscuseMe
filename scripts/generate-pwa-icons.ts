/**
 * Generate PWA icons from eggy-icon.svg
 *
 * Run with: pnpm tsx scripts/generate-pwa-icons.ts
 */
import { Resvg } from "@resvg/resvg-js";
import * as fs from "node:fs";
import * as path from "node:path";

const SOURCE_SVG = path.join(process.cwd(), "public/images/eggy-icon.svg");
const OUTPUT_DIR = path.join(process.cwd(), "public/icons");

// Icon configurations
const ICONS = [
  { name: "icon-192x192.png", size: 192, padding: 0 },
  { name: "icon-512x512.png", size: 512, padding: 0 },
  { name: "icon-maskable-192.png", size: 192, padding: 40 }, // Safe zone padding
  { name: "icon-maskable-512.png", size: 512, padding: 100 }, // Safe zone padding
  { name: "apple-touch-icon.png", size: 180, padding: 20 },
  { name: "badge-72x72.png", size: 72, padding: 0 },
  { name: "shortcut-fridge.png", size: 96, padding: 10 },
  { name: "shortcut-timer.png", size: 96, padding: 10 },
  { name: "shortcut-add.png", size: 96, padding: 10 },
];

async function generateIcons() {
  // Read the source SVG
  const svgContent = fs.readFileSync(SOURCE_SVG, "utf8");

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  console.log("Generating PWA icons from eggy-icon.svg...\n");

  for (const icon of ICONS) {
    // For maskable icons, we need to add padding (safe zone)
    let finalSvg = svgContent;

    if (icon.padding > 0) {
      // Calculate the inner size after padding
      const innerSize = icon.size - icon.padding * 2;
      const scale = innerSize / 512; // Original SVG is 512x512

      // Wrap the original SVG content in a new SVG with padding
      finalSvg = `<svg width="${icon.size}" height="${icon.size}" viewBox="0 0 ${icon.size} ${icon.size}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#FDFBF7"/>
        <g transform="translate(${icon.padding}, ${icon.padding}) scale(${scale})">
          ${svgContent.replace(/<svg[^>]*>/, "").replace(/<\/svg>/, "")}
        </g>
      </svg>`;
    }

    // Render SVG to PNG
    const resvg = new Resvg(finalSvg, {
      fitTo: {
        mode: "width",
        value: icon.size,
      },
      background: icon.padding > 0 ? "#FDFBF7" : "transparent",
    });

    const pngData = resvg.render();
    const pngBuffer = pngData.asPng();

    const outputPath = path.join(OUTPUT_DIR, icon.name);
    fs.writeFileSync(outputPath, pngBuffer);

    console.log(`  Generated: ${icon.name} (${icon.size}x${icon.size})`);
  }

  console.log("\nAll icons generated successfully!");
  console.log(`Output directory: ${OUTPUT_DIR}`);
}

generateIcons().catch(console.error);
