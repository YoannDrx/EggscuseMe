import { getServerUrl } from "@/lib/server-url";
import { SiteConfig } from "@/site-config";
import { Heading, Preview, Section, Text } from "@react-email/components";
import {
  EMAIL_COLORS,
  EggscuseMeEmailLayout,
  EmailButton,
  EmailLanguageSeparator,
} from "./utils/eggscuseme-email-layout";

type OtpSigninEmailProps = {
  email: string;
  otp: string;
  autoLoginUrl?: string;
};

export default function OtpSigninEmail({
  email = "utilisateur@example.com",
  otp = "123456",
  autoLoginUrl,
}: OtpSigninEmailProps) {
  let baseUrl = getServerUrl();

  if (baseUrl.startsWith("http://localhost")) {
    baseUrl = SiteConfig.prodUrl;
  }

  const loginUrl =
    autoLoginUrl ?? `${baseUrl}/auth/signin/otp?email=${email}&otp=${otp}`;

  return (
    <EggscuseMeEmailLayout eggyMood="happy">
      <Preview>
        {otp} - Votre code de connexion / Your sign-in code - {SiteConfig.title}
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
        Votre code de connexion
      </Heading>

      <Text style={{ fontSize: "16px", color: EMAIL_COLORS.text }}>
        Bonjour,
      </Text>

      <Text style={{ fontSize: "16px", color: EMAIL_COLORS.text }}>
        Utilisez le code ci-dessous pour vous connecter a votre compte{" "}
        {SiteConfig.title} :
      </Text>

      {/* OTP Code - Large and prominent */}
      <Section style={{ textAlign: "center", margin: "32px 0" }}>
        <div
          style={{
            display: "inline-block",
            backgroundColor: EMAIL_COLORS.primary,
            borderRadius: "12px",
            padding: "20px 40px",
          }}
        >
          <Text
            style={{
              fontSize: "36px",
              fontWeight: "bold",
              fontFamily: "monospace",
              letterSpacing: "8px",
              color: EMAIL_COLORS.primaryForeground,
              margin: 0,
            }}
          >
            {otp}
          </Text>
        </div>
      </Section>

      <Text
        style={{
          fontSize: "14px",
          color: EMAIL_COLORS.textMuted,
          textAlign: "center",
        }}
      >
        Ce code expire dans 10 minutes.
      </Text>

      <Section style={{ textAlign: "center", margin: "24px 0" }}>
        <Text
          style={{
            fontSize: "14px",
            color: EMAIL_COLORS.textMuted,
            marginBottom: "12px",
          }}
        >
          Ou cliquez pour vous connecter automatiquement :
        </Text>
        <EmailButton href={loginUrl}>Connexion automatique</EmailButton>
      </Section>

      <Text
        style={{
          fontSize: "12px",
          color: EMAIL_COLORS.textLight,
          textAlign: "center",
        }}
      >
        Si vous n&apos;avez pas demande ce code, ignorez cet email.
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
        Your sign-in code
      </Heading>

      <Text style={{ fontSize: "16px", color: EMAIL_COLORS.text }}>Hello,</Text>

      <Text style={{ fontSize: "16px", color: EMAIL_COLORS.text }}>
        Use the code below to sign in to your {SiteConfig.title} account:
      </Text>

      {/* OTP Code - Large and prominent */}
      <Section style={{ textAlign: "center", margin: "32px 0" }}>
        <div
          style={{
            display: "inline-block",
            backgroundColor: EMAIL_COLORS.primary,
            borderRadius: "12px",
            padding: "20px 40px",
          }}
        >
          <Text
            style={{
              fontSize: "36px",
              fontWeight: "bold",
              fontFamily: "monospace",
              letterSpacing: "8px",
              color: EMAIL_COLORS.primaryForeground,
              margin: 0,
            }}
          >
            {otp}
          </Text>
        </div>
      </Section>

      <Text
        style={{
          fontSize: "14px",
          color: EMAIL_COLORS.textMuted,
          textAlign: "center",
        }}
      >
        This code expires in 10 minutes.
      </Text>

      <Section style={{ textAlign: "center", margin: "24px 0" }}>
        <Text
          style={{
            fontSize: "14px",
            color: EMAIL_COLORS.textMuted,
            marginBottom: "12px",
          }}
        >
          Or click to sign in automatically:
        </Text>
        <EmailButton href={loginUrl}>Automatic sign-in</EmailButton>
      </Section>

      <Text
        style={{
          fontSize: "12px",
          color: EMAIL_COLORS.textLight,
          textAlign: "center",
        }}
      >
        If you didn&apos;t request this code, please ignore this email.
      </Text>
    </EggscuseMeEmailLayout>
  );
}
