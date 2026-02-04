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

type NewsletterConfirmationEmailProps = {
  email: string;
  confirmUrl: string;
};

export default function NewsletterConfirmationEmail({
  email = "utilisateur@example.com",
  confirmUrl = "https://eggscuseme.app/newsletter/confirm?token=abc123",
}: NewsletterConfirmationEmailProps) {
  let baseUrl = getServerUrl();

  if (baseUrl.startsWith("http://localhost")) {
    baseUrl = SiteConfig.prodUrl;
  }

  const contentsFr = [
    "Nouvelles fonctionnalites et mises a jour",
    "Astuces pour mieux conserver vos oeufs",
    "Recettes exclusives de saison",
    "Conseils anti-gaspillage",
  ];

  const contentsEn = [
    "New features and updates",
    "Tips for better egg storage",
    "Exclusive seasonal recipes",
    "Anti-waste tips",
  ];

  return (
    <EggscuseMeEmailLayout eggyMood="happy">
      <Preview>
        Confirmez votre inscription a la newsletter / Confirm your newsletter
        subscription - {SiteConfig.title}
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
        Confirmez votre inscription
      </Heading>

      <Text style={{ fontSize: "16px", color: EMAIL_COLORS.text }}>
        Bonjour,
      </Text>

      <Text style={{ fontSize: "16px", color: EMAIL_COLORS.text }}>
        Vous avez demande a recevoir la newsletter {SiteConfig.title} a
        l&apos;adresse <strong>{email}</strong>.
      </Text>

      <Text style={{ fontSize: "16px", color: EMAIL_COLORS.text }}>
        Eggy est impatient de partager avec vous ses meilleurs conseils !
        Confirmez votre inscription pour ne rien manquer.
      </Text>

      <Section style={{ textAlign: "center", margin: "32px 0" }}>
        <EmailButton href={confirmUrl}>Confirmer mon inscription</EmailButton>
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
          Ce que vous recevrez :
        </Text>

        {contentsFr.map((content, index) => (
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
              style={{
                fontSize: "14px",
                color: EMAIL_COLORS.text,
                margin: 0,
                fontWeight: "500",
              }}
            >
              {content}
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
        Ce lien expire dans 48 heures. Si vous n&apos;avez pas demande cette
        inscription, ignorez simplement cet email.
      </Text>

      <Text
        style={{
          fontSize: "12px",
          color: EMAIL_COLORS.textLight,
          textAlign: "center",
          marginTop: "16px",
        }}
      >
        Nous envoyons maximum 2 emails par mois. Vous pourrez vous desabonner a
        tout moment.
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
        Confirm your subscription
      </Heading>

      <Text style={{ fontSize: "16px", color: EMAIL_COLORS.text }}>Hello,</Text>

      <Text style={{ fontSize: "16px", color: EMAIL_COLORS.text }}>
        You requested to receive the {SiteConfig.title} newsletter at{" "}
        <strong>{email}</strong>.
      </Text>

      <Text style={{ fontSize: "16px", color: EMAIL_COLORS.text }}>
        Eggy can&apos;t wait to share the best tips with you! Confirm your
        subscription so you don&apos;t miss anything.
      </Text>

      <Section style={{ textAlign: "center", margin: "32px 0" }}>
        <EmailButton href={confirmUrl}>Confirm my subscription</EmailButton>
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
          What you&apos;ll receive:
        </Text>

        {contentsEn.map((content, index) => (
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
              style={{
                fontSize: "14px",
                color: EMAIL_COLORS.text,
                margin: 0,
                fontWeight: "500",
              }}
            >
              {content}
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
        This link expires in 48 hours. If you didn&apos;t request this
        subscription, simply ignore this email.
      </Text>

      <Text
        style={{
          fontSize: "12px",
          color: EMAIL_COLORS.textLight,
          textAlign: "center",
          marginTop: "16px",
        }}
      >
        We send maximum 2 emails per month. You can unsubscribe at any time.
      </Text>
    </EggscuseMeEmailLayout>
  );
}
