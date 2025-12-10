import { getServerUrl } from "@/lib/server-url";
import { SiteConfig } from "@/site-config";
import { Heading, Preview, Section, Text } from "@react-email/components";
import {
  EMAIL_COLORS,
  EggscuseMeEmailLayout,
  EmailButton,
  EmailInfoBox,
  EmailLanguageSeparator,
} from "./utils/eggscuseme-email-layout";

type ChangeEmailEmailProps = {
  newEmail: string;
  url: string;
};

export default function ChangeEmailEmail({
  newEmail = "nouveau@example.com",
  url = "https://eggscuseme.app/auth/verify-email?token=abc123",
}: ChangeEmailEmailProps) {
  let baseUrl = getServerUrl();

  if (baseUrl.startsWith("http://localhost")) {
    baseUrl = SiteConfig.prodUrl;
  }

  return (
    <EggscuseMeEmailLayout eggyMood="waving">
      <Preview>
        Confirmez votre nouvelle adresse email / Confirm your new email -{" "}
        {SiteConfig.title}
      </Preview>

      {/* ==================== FRENCH VERSION ==================== */}
      <Heading
        style={{
          fontSize: "24px",
          fontWeight: "bold",
          color: EMAIL_COLORS.text,
          textAlign: "center",
          margin: "0 0 24px 0",
        }}
      >
        Confirmez votre nouvelle adresse email
      </Heading>

      <Text style={{ fontSize: "16px", color: EMAIL_COLORS.text }}>
        Bonjour,
      </Text>

      <Text style={{ fontSize: "16px", color: EMAIL_COLORS.text }}>
        Vous avez demande a changer votre adresse email sur {SiteConfig.title}.
      </Text>

      <EmailInfoBox>
        <Text
          style={{
            fontSize: "14px",
            color: EMAIL_COLORS.textMuted,
            margin: "0 0 8px 0",
          }}
        >
          Nouvelle adresse email :
        </Text>
        <Text
          style={{
            fontSize: "18px",
            fontWeight: "bold",
            color: EMAIL_COLORS.text,
            margin: 0,
          }}
        >
          {newEmail}
        </Text>
      </EmailInfoBox>

      <Text style={{ fontSize: "16px", color: EMAIL_COLORS.text }}>
        Cliquez sur le bouton ci-dessous pour verifier cette adresse :
      </Text>

      <Section style={{ textAlign: "center", margin: "32px 0" }}>
        <EmailButton href={url}>Verifier cette adresse</EmailButton>
      </Section>

      <Text
        style={{
          fontSize: "14px",
          color: EMAIL_COLORS.textMuted,
          textAlign: "center",
        }}
      >
        Ce lien expire dans 24 heures.
      </Text>

      <Text
        style={{
          fontSize: "12px",
          color: EMAIL_COLORS.textLight,
          textAlign: "center",
          marginTop: "16px",
        }}
      >
        Si vous n&apos;avez pas demande ce changement, ignorez cet email.
      </Text>

      {/* ==================== SEPARATOR ==================== */}
      <EmailLanguageSeparator />

      {/* ==================== ENGLISH VERSION ==================== */}
      <Heading
        style={{
          fontSize: "24px",
          fontWeight: "bold",
          color: EMAIL_COLORS.text,
          textAlign: "center",
          margin: "0 0 24px 0",
        }}
      >
        Confirm your new email address
      </Heading>

      <Text style={{ fontSize: "16px", color: EMAIL_COLORS.text }}>Hello,</Text>

      <Text style={{ fontSize: "16px", color: EMAIL_COLORS.text }}>
        You requested to change your email address on {SiteConfig.title}.
      </Text>

      <EmailInfoBox>
        <Text
          style={{
            fontSize: "14px",
            color: EMAIL_COLORS.textMuted,
            margin: "0 0 8px 0",
          }}
        >
          New email address:
        </Text>
        <Text
          style={{
            fontSize: "18px",
            fontWeight: "bold",
            color: EMAIL_COLORS.text,
            margin: 0,
          }}
        >
          {newEmail}
        </Text>
      </EmailInfoBox>

      <Text style={{ fontSize: "16px", color: EMAIL_COLORS.text }}>
        Click the button below to verify this address:
      </Text>

      <Section style={{ textAlign: "center", margin: "32px 0" }}>
        <EmailButton href={url}>Verify this address</EmailButton>
      </Section>

      <Text
        style={{
          fontSize: "14px",
          color: EMAIL_COLORS.textMuted,
          textAlign: "center",
        }}
      >
        This link expires in 24 hours.
      </Text>

      <Text
        style={{
          fontSize: "12px",
          color: EMAIL_COLORS.textLight,
          textAlign: "center",
          marginTop: "16px",
        }}
      >
        If you didn&apos;t request this change, please ignore this email.
      </Text>
    </EggscuseMeEmailLayout>
  );
}
