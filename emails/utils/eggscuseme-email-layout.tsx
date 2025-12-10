import { getServerUrl } from "@/lib/server-url";
import { SiteConfig } from "@/site-config";
import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Section,
  Text,
} from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";
import type { PropsWithChildren } from "react";
import { EmailEggy, type EmailEggyMood } from "./email-eggy";

/**
 * Email color tokens - matches the design system
 */
export const EMAIL_COLORS = {
  background: "#FDFBF7",
  card: "#FFFFFF",
  primary: "#FFC800",
  primaryForeground: "#2D2D2D",
  text: "#2D2D2D",
  textMuted: "#666666",
  textLight: "#999999",
  border: "#FFC800",
  borderLight: "rgba(255, 200, 0, 0.3)",
  // Freshness colors
  freshExtra: "#22C55E",
  fresh: "#EAB308",
  cookThoroughly: "#F97316",
  expired: "#EF4444",
};

type EggscuseMeEmailLayoutProps = PropsWithChildren<{
  /**
   * Preview text shown in email clients
   */
  preview?: string;
  /**
   * Eggy mood to display in header
   */
  eggyMood?: EmailEggyMood;
  /**
   * Whether to show Eggy in the header
   */
  showEggy?: boolean;
  /**
   * Footer text override
   */
  footerText?: string;
}>;

/**
 * EggscuseMe branded email layout
 *
 * Features:
 * - Consistent branding with golden egg theme
 * - Optional Eggy mascot in header
 * - Mobile-responsive design
 * - Follows design system tokens
 */
export function EggscuseMeEmailLayout({
  children,
  eggyMood = "happy",
  showEggy = true,
  footerText,
}: EggscuseMeEmailLayoutProps) {
  let baseUrl = getServerUrl();

  if (baseUrl.startsWith("http://localhost")) {
    baseUrl = SiteConfig.prodUrl;
  }

  return (
    <Html>
      <Head />
      <Tailwind>
        <Body
          style={{
            backgroundColor: EMAIL_COLORS.background,
            fontFamily:
              "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
            margin: "0 auto",
            padding: "20px 0",
          }}
        >
          <Container
            style={{
              maxWidth: "500px",
              margin: "0 auto",
              backgroundColor: EMAIL_COLORS.card,
              borderRadius: "12px",
              border: `2px solid ${EMAIL_COLORS.border}`,
              padding: "32px",
            }}
          >
            {/* Header */}
            <Section style={{ textAlign: "center", marginBottom: "24px" }}>
              {showEggy && (
                <div style={{ marginBottom: "16px" }}>
                  <EmailEggy mood={eggyMood} size="md" />
                </div>
              )}
              <table
                cellPadding={0}
                cellSpacing={0}
                style={{ margin: "0 auto" }}
              >
                <tr>
                  <td style={{ paddingRight: "8px" }}>
                    <Img
                      src={`${baseUrl}${SiteConfig.appIcon}`}
                      width={32}
                      height={32}
                      alt={SiteConfig.title}
                      style={{ display: "inline-block" }}
                    />
                  </td>
                  <td>
                    <Text
                      style={{
                        fontSize: "20px",
                        fontWeight: "bold",
                        color: EMAIL_COLORS.text,
                        margin: 0,
                      }}
                    >
                      {SiteConfig.title}
                    </Text>
                  </td>
                </tr>
              </table>
            </Section>

            <Hr
              style={{
                borderColor: EMAIL_COLORS.borderLight,
                margin: "24px 0",
              }}
            />

            {/* Content */}
            <Section>{children}</Section>

            <Hr
              style={{
                borderColor: EMAIL_COLORS.borderLight,
                margin: "24px 0",
              }}
            />

            {/* Footer */}
            <Section style={{ textAlign: "center" }}>
              {footerText && (
                <Text
                  style={{
                    fontSize: "12px",
                    color: EMAIL_COLORS.textLight,
                    marginBottom: "8px",
                  }}
                >
                  {footerText}
                </Text>
              )}
              <Text
                style={{
                  fontSize: "12px",
                  color: EMAIL_COLORS.textLight,
                  margin: "4px 0",
                }}
              >
                {SiteConfig.company.name}
              </Text>
              <Text
                style={{
                  fontSize: "12px",
                  color: EMAIL_COLORS.textLight,
                  margin: "4px 0",
                }}
              >
                {SiteConfig.company.address}
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

/**
 * Email button component with EggscuseMe styling
 */
export function EmailButton({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      style={{
        display: "inline-block",
        backgroundColor: EMAIL_COLORS.primary,
        color: EMAIL_COLORS.primaryForeground,
        padding: "12px 24px",
        borderRadius: "8px",
        fontWeight: "600",
        fontSize: "16px",
        textDecoration: "none",
        textAlign: "center",
      }}
    >
      {children}
    </a>
  );
}

/**
 * Info box component for emails
 */
export function EmailInfoBox({ children }: { children: React.ReactNode }) {
  return (
    <Section
      style={{
        backgroundColor: `${EMAIL_COLORS.primary}1A`, // 10% opacity
        borderRadius: "8px",
        padding: "16px",
        margin: "16px 0",
      }}
    >
      {children}
    </Section>
  );
}

/**
 * Language separator component for bilingual emails
 */
export function EmailLanguageSeparator() {
  return (
    <Section style={{ margin: "32px 0" }}>
      <table
        cellPadding={0}
        cellSpacing={0}
        style={{ width: "100%", borderCollapse: "collapse" }}
      >
        <tr>
          <td
            style={{
              borderBottom: `2px solid ${EMAIL_COLORS.borderLight}`,
              width: "40%",
            }}
          />
          <td
            style={{
              textAlign: "center",
              padding: "0 16px",
              whiteSpace: "nowrap",
            }}
          >
            <Text
              style={{
                fontSize: "12px",
                color: EMAIL_COLORS.textMuted,
                margin: 0,
                fontWeight: "600",
              }}
            >
              ENGLISH VERSION BELOW
            </Text>
          </td>
          <td
            style={{
              borderBottom: `2px solid ${EMAIL_COLORS.borderLight}`,
              width: "40%",
            }}
          />
        </tr>
      </table>
    </Section>
  );
}
