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

type FridgeInvitationEmailProps = {
  inviterName: string;
  fridgeName: string;
  inviteToken: string;
  expiresAt: Date;
};

export default function FridgeInvitationEmail({
  inviterName = "Marie",
  fridgeName = "Mon Frigo",
  inviteToken = "abc123def456",
  expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
}: FridgeInvitationEmailProps) {
  let baseUrl = getServerUrl();

  if (baseUrl.startsWith("http://localhost")) {
    baseUrl = SiteConfig.prodUrl;
  }

  const inviteUrl = `${baseUrl}/fridge/invite/${inviteToken}`;
  const expiresFormattedFr = new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(expiresAt);
  const expiresFormattedEn = new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(expiresAt);

  const benefitsFr = [
    "Voir les boites d'oeufs et leur fraicheur",
    "Consommer des oeufs et enregistrer vos repas",
    "Acceder aux recettes et suggestions de cuisson",
    "Utiliser le minuteur intelligent",
  ];

  const benefitsEn = [
    "View egg boxes and their freshness",
    "Consume eggs and log your meals",
    "Access recipes and cooking suggestions",
    "Use the smart cooking timer",
  ];

  return (
    <EggscuseMeEmailLayout eggyMood="waving">
      <Preview>
        {inviterName} vous invite a rejoindre son frigo / {inviterName} invites
        you to join their fridge - {SiteConfig.title}
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
        Invitation a rejoindre un frigo
      </Heading>

      <Text style={{ fontSize: "16px", color: EMAIL_COLORS.text }}>
        Bonjour,
      </Text>

      <Text style={{ fontSize: "16px", color: EMAIL_COLORS.text }}>
        <strong>{inviterName}</strong> vous invite a rejoindre son frigo{" "}
        <strong>&quot;{fridgeName}&quot;</strong> sur {SiteConfig.title}.
      </Text>

      <EmailInfoBox>
        <Heading
          as="h3"
          style={{
            fontSize: "16px",
            fontWeight: "600",
            color: EMAIL_COLORS.text,
            margin: "0 0 12px 0",
          }}
        >
          En tant qu&apos;invite, vous pourrez :
        </Heading>

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
              style={{
                fontSize: "14px",
                color: EMAIL_COLORS.text,
                margin: 0,
                fontWeight: "500",
              }}
            >
              {benefit}
            </Text>
          </Section>
        ))}
      </EmailInfoBox>

      <Section style={{ textAlign: "center", margin: "24px 0" }}>
        <EmailButton href={inviteUrl}>Rejoindre le frigo</EmailButton>
      </Section>

      <Text
        style={{
          fontSize: "14px",
          color: EMAIL_COLORS.textMuted,
          textAlign: "center",
        }}
      >
        Cette invitation expire le {expiresFormattedFr}
      </Text>

      <Text
        style={{
          fontSize: "12px",
          color: EMAIL_COLORS.textLight,
          textAlign: "center",
          marginTop: "16px",
        }}
      >
        Si vous n&apos;attendiez pas cette invitation, ignorez cet email.
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
        Invitation to join a fridge
      </Heading>

      <Text style={{ fontSize: "16px", color: EMAIL_COLORS.text }}>Hello,</Text>

      <Text style={{ fontSize: "16px", color: EMAIL_COLORS.text }}>
        <strong>{inviterName}</strong> invites you to join their fridge{" "}
        <strong>&quot;{fridgeName}&quot;</strong> on {SiteConfig.title}.
      </Text>

      <EmailInfoBox>
        <Heading
          as="h3"
          style={{
            fontSize: "16px",
            fontWeight: "600",
            color: EMAIL_COLORS.text,
            margin: "0 0 12px 0",
          }}
        >
          As a guest, you will be able to:
        </Heading>

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
              style={{
                fontSize: "14px",
                color: EMAIL_COLORS.text,
                margin: 0,
                fontWeight: "500",
              }}
            >
              {benefit}
            </Text>
          </Section>
        ))}
      </EmailInfoBox>

      <Section style={{ textAlign: "center", margin: "24px 0" }}>
        <EmailButton href={inviteUrl}>Join the fridge</EmailButton>
      </Section>

      <Text
        style={{
          fontSize: "14px",
          color: EMAIL_COLORS.textMuted,
          textAlign: "center",
        }}
      >
        This invitation expires on {expiresFormattedEn}
      </Text>

      <Text
        style={{
          fontSize: "12px",
          color: EMAIL_COLORS.textLight,
          textAlign: "center",
          marginTop: "16px",
        }}
      >
        If you weren&apos;t expecting this invitation, please ignore this email.
      </Text>
    </EggscuseMeEmailLayout>
  );
}
