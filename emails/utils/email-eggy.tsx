import { getServerUrl } from "@/lib/server-url";
import { SiteConfig } from "@/site-config";
import { Img } from "@react-email/components";

export type EmailEggyMood = "happy" | "sad" | "chef" | "waving" | "celebrating";

type EmailEggyProps = {
  mood?: EmailEggyMood;
  size?: "sm" | "md" | "lg";
  alt?: string;
};

const sizeMap = {
  sm: { width: 48, height: 58 },
  md: { width: 80, height: 96 },
  lg: { width: 120, height: 144 },
};

/**
 * Eggy component for emails
 *
 * Uses SVG images hosted in /public/images/eggy/
 * Modern email clients (Gmail, Apple Mail, Outlook web) support SVG.
 *
 * To generate the images, run: pnpm tsx scripts/generate-eggy-images.tsx
 */
export function EmailEggy({
  mood = "happy",
  size = "md",
  alt = "Eggy mascot",
}: EmailEggyProps) {
  let baseUrl = getServerUrl();

  if (baseUrl.startsWith("http://localhost")) {
    baseUrl = SiteConfig.prodUrl;
  }

  const { width, height } = sizeMap[size];

  // Use SVG files (modern email clients support them)
  const eggyUrl = `${baseUrl}/images/eggy/eggy-${mood}.svg`;

  return (
    <Img
      src={eggyUrl}
      width={width}
      height={height}
      alt={alt}
      style={{
        margin: "0 auto",
        display: "block",
      }}
    />
  );
}

/**
 * Get the URL for an Eggy image
 */
export function getEggyImageUrl(mood: EmailEggyMood = "happy"): string {
  let baseUrl = getServerUrl();

  if (baseUrl.startsWith("http://localhost")) {
    baseUrl = SiteConfig.prodUrl;
  }

  return `${baseUrl}/images/eggy/eggy-${mood}.svg`;
}
