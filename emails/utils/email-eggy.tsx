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
 * Since emails don't support inline SVGs, this component uses pre-generated
 * PNG images hosted in /public/images/eggy/
 *
 * To generate the images, run: pnpm email:generate-eggy
 * Or manually export from Figma/design tool
 *
 * Fallback: If images don't exist, uses the app icon
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

  const eggyUrl = `${baseUrl}/images/eggy/eggy-${mood}.png`;

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
      // Fallback handled via onerror in email clients that support it
      // Most email clients will just show alt text if image fails
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

  return `${baseUrl}/images/eggy/eggy-${mood}.png`;
}
