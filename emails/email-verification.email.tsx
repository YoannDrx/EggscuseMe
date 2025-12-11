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

type EmailVerificationEmailProps = {
  user: {
    name?: string | null;
    email: string;
  };
  url: string;
};

export default function EmailVerificationEmail({
  user = { name: "Chef", email: "utilisateur@example.com" },
  url = "https://eggscuseme.app/auth/verify-email?token=abc123",
}: EmailVerificationEmailProps) {
  let baseUrl = getServerUrl();

  if (baseUrl.startsWith("http://localhost")) {
    baseUrl = SiteConfig.prodUrl;
  }

  const userName = user.name ?? "Chef";

  const benefitsFr = [
    "Suivre la fraicheur de vos oeufs avec precision",
    "Recevoir des recommandations de cuisson personnalisees",
    "Reduire le gaspillage alimentaire",
    "Partager votre frigo avec votre famille",
  ];

  const benefitsEn = [
    "Track your eggs freshness with precision",
    "Get personalized cooking recommendations",
    "Reduce food waste",
    "Share your fridge with your family",
  ];

  return (
    <EggscuseMeEmailLayout eggyMood="waving">
      <Preview>
        Bienvenue sur {SiteConfig.title} ! / Welcome to {SiteConfig.title}!
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
        Bienvenue sur {SiteConfig.title} !
      </Heading>

      <Text style={{ fontSize: "16px", color: EMAIL_COLORS.text }}>
        Bonjour {userName},
      </Text>

      <Text style={{ fontSize: "16px", color: EMAIL_COLORS.text }}>
        Merci de rejoindre {SiteConfig.title} ! Nous sommes ravis de vous
        accueillir dans notre communaute de gardiens d&apos;oeufs.
      </Text>

      <Text style={{ fontSize: "16px", color: EMAIL_COLORS.text }}>
        Pour commencer, veuillez verifier votre adresse email :
      </Text>

      <Section style={{ textAlign: "center", margin: "32px 0" }}>
        <EmailButton href={url}>Verifier mon email</EmailButton>
      </Section>

      <EmailInfoBox>
        <Text
          style={{
            fontSize: "16px",
            fontWeight: "600",
            color: EMAIL_COLORS.text,
            margin: "0 0 12px 0",
          }}
        >
          Avec {SiteConfig.title}, vous pourrez :
        </Text>

        {benefitsFr.map((benefit, index) => (
          <Section
            key={index}
            style={{
              backgroundColor: "#FDFBF7",
              border: "1px solid #1C1917",
              boxShadow: "2px 2px 0px #1C1917",
              borderRadius: "8px",
              padding: "12px",
              marginBottom: "12px",
            }}
          >
            <Text
              style={{ fontSize: "14px", color: EMAIL_COLORS.text, margin: 0, fontWeight: "500" }}
            >
              {benefit}
            </Text>
          </Section>
        ))}
      </EmailInfoBox>

      <Text
        style={{
          fontSize: "12px",
          color: EMAIL_COLORS.textLight,
          textAlign: "center",
        }}
      >
        Ce lien expire dans 24 heures.
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
        Welcome to {SiteConfig.title}!
      </Heading>

      <Text style={{ fontSize: "16px", color: EMAIL_COLORS.text }}>
        Hello {userName},
      </Text>

      <Text style={{ fontSize: "16px", color: EMAIL_COLORS.text }}>
        Thank you for joining {SiteConfig.title}! We&apos;re excited to welcome
        you to our community of egg guardians.
      </Text>

      <Text style={{ fontSize: "16px", color: EMAIL_COLORS.text }}>
        To get started, please verify your email address:
      </Text>

      <Section style={{ textAlign: "center", margin: "32px 0" }}>
        <EmailButton href={url}>Verify my email</EmailButton>
      </Section>

      <EmailInfoBox>
        <Text
          style={{
            fontSize: "16px",
            fontWeight: "600",
            color: EMAIL_COLORS.text,
            margin: "0 0 12px 0",
          }}
        >
          With {SiteConfig.title}, you can:
        </Text>

        {benefitsEn.map((benefit, index) => (
          <Section
            key={index}
            style={{
              backgroundColor: "#FDFBF7",
              border: "1px solid #1C1917",
              boxShadow: "2px 2px 0px #1C1917",
              borderRadius: "8px",
              padding: "12px",
              marginBottom: "12px",
            }}
          >
            <Text
              style={{ fontSize: "14px", color: EMAIL_COLORS.text, margin: 0, fontWeight: "500" }}
            >
              {benefit}
            </Text>
          </Section>
        ))}
      </EmailInfoBox>

      <Text
        style={{
          fontSize: "12px",
          color: EMAIL_COLORS.textLight,
          textAlign: "center",
        }}
      >
        This link expires in 24 hours.
      </Text>
    </EggscuseMeEmailLayout>
  );
}
