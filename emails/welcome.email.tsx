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

type WelcomeEmailProps = {
  user: {
    name?: string | null;
    email: string;
  };
};

export default function WelcomeEmail({
  user = { name: "Chef", email: "utilisateur@example.com" },
}: WelcomeEmailProps) {
  let baseUrl = getServerUrl();

  if (baseUrl.startsWith("http://localhost")) {
    baseUrl = SiteConfig.prodUrl;
  }

  const userName = user.name ?? "Chef";
  const fridgeUrl = `${baseUrl}/fridge`;

  const featuresFr = [
    "Ajoutez vos boites d'oeufs avec leur date d'achat",
    "Suivez la fraicheur en temps reel avec des indicateurs visuels",
    "Recevez des alertes avant expiration",
    "Partagez votre frigo avec votre famille",
    "Obtenez des recommandations de cuisson personnalisees",
  ];

  const featuresEn = [
    "Add your egg boxes with their purchase date",
    "Track freshness in real-time with visual indicators",
    "Receive alerts before expiration",
    "Share your fridge with your family",
    "Get personalized cooking recommendations",
  ];

  return (
    <EggscuseMeEmailLayout eggyMood="celebrating">
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
        Bienvenue dans la communaute !
      </Heading>

      <Text style={{ fontSize: "16px", color: EMAIL_COLORS.text }}>
        Bonjour {userName},
      </Text>

      <Text style={{ fontSize: "16px", color: EMAIL_COLORS.text }}>
        Merci d&apos;avoir rejoint {SiteConfig.title} ! Eggy est ravi de vous
        accueillir dans notre communaute de gardiens d&apos;oeufs.
      </Text>

      <Text style={{ fontSize: "16px", color: EMAIL_COLORS.text }}>
        Dites adieu aux oeufs jetes ! Avec {SiteConfig.title}, vous ne gaspillez
        plus jamais un seul oeuf.
      </Text>

      <EmailInfoBox>
        <Text
          style={{
            fontSize: "16px",
            fontWeight: "600",
            color: EMAIL_COLORS.text,
            margin: "0 0 12px 0",
          }}
        >
          Voici ce que vous pouvez faire :
        </Text>

        {featuresFr.map((feature, index) => (
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
              {feature}
            </Text>
          </Section>
        ))}
      </EmailInfoBox>

      <Section style={{ textAlign: "center", margin: "32px 0" }}>
        <EmailButton href={fridgeUrl}>Decouvrir mon frigo</EmailButton>
      </Section>

      <Text
        style={{
          fontSize: "14px",
          color: EMAIL_COLORS.textMuted,
          textAlign: "center",
          fontStyle: "italic",
        }}
      >
        Astuce : Commencez par ajouter votre premiere boite d&apos;oeufs pour
        voir la magie operer !
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
        Welcome to the community!
      </Heading>

      <Text style={{ fontSize: "16px", color: EMAIL_COLORS.text }}>
        Hello {userName},
      </Text>

      <Text style={{ fontSize: "16px", color: EMAIL_COLORS.text }}>
        Thank you for joining {SiteConfig.title}! Eggy is thrilled to welcome
        you to our egg guardian community.
      </Text>

      <Text style={{ fontSize: "16px", color: EMAIL_COLORS.text }}>
        Say goodbye to thrown-away eggs! With {SiteConfig.title}, you&apos;ll
        never waste a single egg again.
      </Text>

      <EmailInfoBox>
        <Text
          style={{
            fontSize: "16px",
            fontWeight: "600",
            color: EMAIL_COLORS.text,
            margin: "0 0 12px 0",
          }}
        >
          Here&apos;s what you can do:
        </Text>

        {featuresEn.map((feature, index) => (
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
              {feature}
            </Text>
          </Section>
        ))}
      </EmailInfoBox>

      <Section style={{ textAlign: "center", margin: "32px 0" }}>
        <EmailButton href={fridgeUrl}>Discover my fridge</EmailButton>
      </Section>

      <Text
        style={{
          fontSize: "14px",
          color: EMAIL_COLORS.textMuted,
          textAlign: "center",
          fontStyle: "italic",
        }}
      >
        Tip: Start by adding your first egg box to see the magic happen!
      </Text>
    </EggscuseMeEmailLayout>
  );
}
