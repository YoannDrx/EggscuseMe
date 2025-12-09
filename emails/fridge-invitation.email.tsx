import { getServerUrl } from "@/lib/server-url";
import { SiteConfig } from "@/site-config";
import { Heading, Preview, Section, Text } from "@react-email/components";
import {
  EMAIL_COLORS,
  EggscuseMeEmailLayout,
  EmailButton,
  EmailInfoBox,
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
  const expiresFormatted = new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(expiresAt);

  return (
    <EggscuseMeEmailLayout
      eggyMood="waving"
      footerText="Si vous n'attendiez pas cette invitation, vous pouvez ignorer cet email."
    >
      <Preview>
        {inviterName} vous invite a rejoindre son frigo sur EggscuseMe
      </Preview>

      {/* Title */}
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

      {/* Greeting */}
      <Text style={{ fontSize: "16px", color: EMAIL_COLORS.text }}>
        Bonjour,
      </Text>

      <Text style={{ fontSize: "16px", color: EMAIL_COLORS.text }}>
        <strong>{inviterName}</strong> vous invite a rejoindre son frigo{" "}
        <strong>&quot;{fridgeName}&quot;</strong> sur EggscuseMe.
      </Text>

      {/* Benefits */}
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

        {[
          "Voir les boites d'oeufs et leur fraicheur",
          "Consommer des oeufs et enregistrer vos repas",
          "Acceder aux recettes et suggestions de cuisson",
          "Utiliser le minuteur intelligent",
        ].map((benefit, index) => (
          <Section
            key={index}
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "6px",
              padding: "12px",
              marginBottom: index < 3 ? "8px" : "0",
            }}
          >
            <Text
              style={{
                fontSize: "14px",
                color: EMAIL_COLORS.text,
                margin: 0,
              }}
            >
              {benefit}
            </Text>
          </Section>
        ))}
      </EmailInfoBox>

      {/* CTA Button */}
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
        Cette invitation expire le {expiresFormatted}
      </Text>
    </EggscuseMeEmailLayout>
  );
}
