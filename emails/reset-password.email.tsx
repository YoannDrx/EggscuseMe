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

type ResetPasswordEmailProps = {
  user: {
    name?: string | null;
    email: string;
  };
  url: string;
};

export default function ResetPasswordEmail({
  user = { name: "Chef", email: "utilisateur@example.com" },
  url = "https://eggscuseme.app/auth/reset-password?token=abc123",
}: ResetPasswordEmailProps) {
  let baseUrl = getServerUrl();

  if (baseUrl.startsWith("http://localhost")) {
    baseUrl = SiteConfig.prodUrl;
  }

  const userName = user.name ?? "Chef";

  return (
    <EggscuseMeEmailLayout eggyMood="chef">
      <Preview>
        Reinitialisation de mot de passe / Password reset - {SiteConfig.title}
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
        Reinitialisation de mot de passe
      </Heading>

      <Text style={{ fontSize: "16px", color: EMAIL_COLORS.text }}>
        Bonjour {userName},
      </Text>

      <Text style={{ fontSize: "16px", color: EMAIL_COLORS.text }}>
        Vous avez demande a reinitialiser votre mot de passe pour votre compte{" "}
        {SiteConfig.title}.
      </Text>

      <Text style={{ fontSize: "16px", color: EMAIL_COLORS.text }}>
        Cliquez sur le bouton ci-dessous pour creer un nouveau mot de passe :
      </Text>

      <Section style={{ textAlign: "center", margin: "32px 0" }}>
        <EmailButton href={url}>Reinitialiser mon mot de passe</EmailButton>
      </Section>

      <EmailInfoBox>
        <Text style={{ fontSize: "14px", color: EMAIL_COLORS.text, margin: 0 }}>
          Pour votre securite :
        </Text>
        <Text
          style={{
            fontSize: "14px",
            color: EMAIL_COLORS.textMuted,
            margin: "8px 0 0 0",
          }}
        >
          • Ce lien expire dans 1 heure
        </Text>
        <Text
          style={{
            fontSize: "14px",
            color: EMAIL_COLORS.textMuted,
            margin: "4px 0 0 0",
          }}
        >
          • Ne partagez jamais ce lien
        </Text>
      </EmailInfoBox>

      <Text
        style={{
          fontSize: "12px",
          color: EMAIL_COLORS.textLight,
          textAlign: "center",
        }}
      >
        Si vous n&apos;avez pas fait cette demande, ignorez cet email.
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
        Password Reset
      </Heading>

      <Text style={{ fontSize: "16px", color: EMAIL_COLORS.text }}>
        Hello {userName},
      </Text>

      <Text style={{ fontSize: "16px", color: EMAIL_COLORS.text }}>
        You requested to reset your password for your {SiteConfig.title}{" "}
        account.
      </Text>

      <Text style={{ fontSize: "16px", color: EMAIL_COLORS.text }}>
        Click the button below to create a new password:
      </Text>

      <Section style={{ textAlign: "center", margin: "32px 0" }}>
        <EmailButton href={url}>Reset my password</EmailButton>
      </Section>

      <EmailInfoBox>
        <Text style={{ fontSize: "14px", color: EMAIL_COLORS.text, margin: 0 }}>
          For your security:
        </Text>
        <Text
          style={{
            fontSize: "14px",
            color: EMAIL_COLORS.textMuted,
            margin: "8px 0 0 0",
          }}
        >
          • This link expires in 1 hour
        </Text>
        <Text
          style={{
            fontSize: "14px",
            color: EMAIL_COLORS.textMuted,
            margin: "4px 0 0 0",
          }}
        >
          • Never share this link with anyone
        </Text>
      </EmailInfoBox>

      <Text
        style={{
          fontSize: "12px",
          color: EMAIL_COLORS.textLight,
          textAlign: "center",
        }}
      >
        If you didn&apos;t make this request, please ignore this email.
      </Text>
    </EggscuseMeEmailLayout>
  );
}
