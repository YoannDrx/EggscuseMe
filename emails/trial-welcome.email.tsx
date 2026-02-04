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

type TrialWelcomeEmailProps = {
  user: {
    name?: string | null;
    email: string;
  };
  planName: "Brigade" | "Chef";
  trialDays: number;
  trialEndDate: Date;
};

export default function TrialWelcomeEmail({
  user = { name: "Chef", email: "utilisateur@example.com" },
  planName = "Brigade",
  trialDays = 14,
  trialEndDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
}: TrialWelcomeEmailProps) {
  let baseUrl = getServerUrl();

  if (baseUrl.startsWith("http://localhost")) {
    baseUrl = SiteConfig.prodUrl;
  }

  const userName = user.name ?? "Chef";
  const fridgeUrl = `${baseUrl}/fridge`;
  const billingUrl = `${baseUrl}/fridge/settings/billing`;

  const trialEndDateFr = new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(trialEndDate);

  const trialEndDateEn = new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(trialEndDate);

  // Features depend on plan
  const isBrigade = planName === "Brigade";
  const isChef = planName === "Chef";

  const featuresFr = [
    "Boites d'oeufs illimitees",
    ...(isBrigade || isChef ? ["Jusqu'a 5 membres dans votre frigo"] : []),
    ...(isChef ? ["Fridges illimites pour gerer plusieurs lieux"] : []),
    "Historique de consommation complet",
    "Statistiques detaillees et tendances",
    "Alertes personnalisables",
    "Support prioritaire",
  ];

  const featuresEn = [
    "Unlimited egg boxes",
    ...(isBrigade || isChef ? ["Up to 5 members in your fridge"] : []),
    ...(isChef ? ["Unlimited fridges to manage multiple locations"] : []),
    "Complete consumption history",
    "Detailed statistics and trends",
    "Customizable alerts",
    "Priority support",
  ];

  return (
    <EggscuseMeEmailLayout eggyMood="chef">
      <Preview>
        Votre essai {planName} commence ! / Your {planName} trial starts now! -{" "}
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
        Bienvenue dans {SiteConfig.title} {planName} !
      </Heading>

      <Text style={{ fontSize: "16px", color: EMAIL_COLORS.text }}>
        Bonjour {userName},
      </Text>

      <Text style={{ fontSize: "16px", color: EMAIL_COLORS.text }}>
        Felicitations ! Vous beneficiez maintenant de{" "}
        <strong>{trialDays} jours d&apos;essai gratuit</strong> du plan{" "}
        <strong>{planName}</strong>.
      </Text>

      <Section
        style={{
          backgroundColor: EMAIL_COLORS.primary,
          border: `2px solid ${EMAIL_COLORS.border}`,
          boxShadow: `4px 4px 0px ${EMAIL_COLORS.shadow}`,
          borderRadius: "12px",
          padding: "16px",
          margin: "24px 0",
          textAlign: "center",
        }}
      >
        <Text
          style={{
            fontSize: "14px",
            fontWeight: "600",
            color: EMAIL_COLORS.text,
            margin: 0,
          }}
        >
          Votre essai se termine le
        </Text>
        <Text
          style={{
            fontSize: "20px",
            fontWeight: "800",
            color: EMAIL_COLORS.text,
            margin: "8px 0 0 0",
          }}
        >
          {trialEndDateFr}
        </Text>
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
          Fonctionnalites {planName} incluses :
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
        <EmailButton href={fridgeUrl}>
          Explorer mes nouvelles fonctionnalites
        </EmailButton>
      </Section>

      <Text
        style={{
          fontSize: "12px",
          color: EMAIL_COLORS.textLight,
          textAlign: "center",
        }}
      >
        A la fin de l&apos;essai, vous serez automatiquement passe au plan Solo
        gratuit.{" "}
        <a
          href={billingUrl}
          style={{ color: EMAIL_COLORS.textLight, textDecoration: "underline" }}
        >
          Gerer mon abonnement
        </a>
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
        Welcome to {SiteConfig.title} {planName}!
      </Heading>

      <Text style={{ fontSize: "16px", color: EMAIL_COLORS.text }}>
        Hello {userName},
      </Text>

      <Text style={{ fontSize: "16px", color: EMAIL_COLORS.text }}>
        Congratulations! You now have{" "}
        <strong>{trialDays} days of free trial</strong> for the{" "}
        <strong>{planName}</strong> plan.
      </Text>

      <Section
        style={{
          backgroundColor: EMAIL_COLORS.primary,
          border: `2px solid ${EMAIL_COLORS.border}`,
          boxShadow: `4px 4px 0px ${EMAIL_COLORS.shadow}`,
          borderRadius: "12px",
          padding: "16px",
          margin: "24px 0",
          textAlign: "center",
        }}
      >
        <Text
          style={{
            fontSize: "14px",
            fontWeight: "600",
            color: EMAIL_COLORS.text,
            margin: 0,
          }}
        >
          Your trial ends on
        </Text>
        <Text
          style={{
            fontSize: "20px",
            fontWeight: "800",
            color: EMAIL_COLORS.text,
            margin: "8px 0 0 0",
          }}
        >
          {trialEndDateEn}
        </Text>
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
          {planName} features included:
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
        <EmailButton href={fridgeUrl}>Explore my new features</EmailButton>
      </Section>

      <Text
        style={{
          fontSize: "12px",
          color: EMAIL_COLORS.textLight,
          textAlign: "center",
        }}
      >
        At the end of the trial, you&apos;ll automatically switch to the free
        Solo plan.{" "}
        <a
          href={billingUrl}
          style={{ color: EMAIL_COLORS.textLight, textDecoration: "underline" }}
        >
          Manage my subscription
        </a>
      </Text>
    </EggscuseMeEmailLayout>
  );
}
