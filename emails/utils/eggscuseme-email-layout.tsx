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
 * Email color tokens - matches the neo-soft-brutalist design system
 */
export const EMAIL_COLORS = {
  background: "#FDFBF7", // Eggshell
  card: "#FFFFFF",
  primary: "#FFC800", // Yolk
  primaryForeground: "#1C1917", // Stone 900
  text: "#1C1917", // Stone 900
  textMuted: "#57534E", // Stone 500
  textLight: "#78716C", // Stone 400
  border: "#1C1917", // Stone 900 (Thick borders)
  borderLight: "#E7E5E4", // Stone 200
  shadow: "#1C1917", // Hard shadow color
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
 * - Neo-soft-brutalist design (thick borders, hard shadows)
 * - Consistent branding with golden egg theme
 * - Optional Eggy mascot in header
 * - Mobile-responsive design
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
              borderRadius: "16px", // Neo radius
              border: `2px solid ${EMAIL_COLORS.border}`, // Neo border
              boxShadow: `4px 4px 0px ${EMAIL_COLORS.shadow}`, // Neo hard shadow
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
                  <td style={{ paddingRight: "12px" }}>
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
                        fontSize: "24px",
                        fontWeight: "800",
                        color: EMAIL_COLORS.text,
                        margin: 0,
                        letterSpacing: "-0.5px",
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
                borderColor: EMAIL_COLORS.border,
                borderWidth: "2px",
                borderStyle: "dashed",
                margin: "24px 0",
              }}
            />

            {/* Content */}
            <Section>{children}</Section>

            <Hr
              style={{
                borderColor: EMAIL_COLORS.border,
                borderWidth: "2px",
                borderStyle: "dashed",
                margin: "32px 0 24px 0",
              }}
            />

            {/* Footer */}
            <Section style={{ textAlign: "center" }}>
              {footerText && (
                <Text
                  style={{
                    fontSize: "12px",
                    color: EMAIL_COLORS.textMuted,
                    marginBottom: "8px",
                    fontWeight: "500",
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
 * Email button component with EggscuseMe neo-brutalist styling
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
        padding: "14px 28px",
        borderRadius: "9999px", // Pill shape
        border: `2px solid ${EMAIL_COLORS.border}`,
        boxShadow: `4px 4px 0px ${EMAIL_COLORS.shadow}`, // Hard shadow
        fontWeight: "800",
        fontSize: "16px",
        textDecoration: "none",
        textAlign: "center",
        transition: "transform 0.1s ease",
      }}
    >
      {children}
    </a>
  );
}

/**
 * Info box component for emails (Neo-brutalist card style)
 */
export function EmailInfoBox({ children }: { children: React.ReactNode }) {
  return (
    <Section
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: "12px",
        border: `2px solid ${EMAIL_COLORS.border}`,
        boxShadow: `4px 4px 0px ${EMAIL_COLORS.shadow}`,
        padding: "20px",
        margin: "24px 0",
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
    <Section style={{ margin: "40px 0" }}>
      <table
        cellPadding={0}
        cellSpacing={0}
        style={{ width: "100%", borderCollapse: "collapse" }}
      >
        <tr>
          <td
            style={{
              borderBottom: `2px solid ${EMAIL_COLORS.border}`,
              width: "35%",
            }}
          />
          <td
            style={{
              textAlign: "center",
              padding: "0 12px",
              whiteSpace: "nowrap",
            }}
          >
            <Text
              style={{
                fontSize: "12px",
                color: EMAIL_COLORS.text,
                margin: 0,
                fontWeight: "800",
                letterSpacing: "0.5px",
                textTransform: "uppercase",
                backgroundColor: EMAIL_COLORS.primary,
                padding: "4px 8px",
                borderRadius: "4px",
                border: `2px solid ${EMAIL_COLORS.border}`,
              }}
            >
              English Version Below
            </Text>
          </td>
          <td
            style={{
              borderBottom: `2px solid ${EMAIL_COLORS.border}`,
              width: "35%",
            }}
          />
        </tr>
      </table>
    </Section>
  );
}
