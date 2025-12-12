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

type ExpiringEgg = {
  name: string;
  daysLeft: number;
  quantity: number;
};

type ExpirationWarningEmailProps = {
  userName: string;
  eggs: ExpiringEgg[];
  fridgeName: string;
  unsubscribeUrl?: string;
};

function getFreshnessColor(daysLeft: number): string {
  if (daysLeft <= 1) return EMAIL_COLORS.expired;
  if (daysLeft <= 3) return EMAIL_COLORS.cookThoroughly;
  return EMAIL_COLORS.fresh;
}

function getDaysLeftTextFr(daysLeft: number): string {
  if (daysLeft === 0) return "Expire aujourd'hui";
  if (daysLeft === 1) return "1 jour restant";
  return `${daysLeft} jours restants`;
}

function getDaysLeftTextEn(daysLeft: number): string {
  if (daysLeft === 0) return "Expires today";
  if (daysLeft === 1) return "1 day left";
  return `${daysLeft} days left`;
}

export default function ExpirationWarningEmail({
  userName = "Chef",
  eggs = [
    { name: "Ferme du Coin", daysLeft: 2, quantity: 4 },
    { name: "Marche bio", daysLeft: 3, quantity: 6 },
  ],
  fridgeName = "Mon Frigo",
  unsubscribeUrl,
}: ExpirationWarningEmailProps) {
  let baseUrl = getServerUrl();

  if (baseUrl.startsWith("http://localhost")) {
    baseUrl = SiteConfig.prodUrl;
  }

  const fridgeUrl = `${baseUrl}/fridge`;
  const settingsUrl = `${baseUrl}/fridge/settings/notifications`;
  const totalEggs = eggs.reduce((sum, egg) => sum + egg.quantity, 0);

  return (
    <EggscuseMeEmailLayout eggyMood="chef">
      <Preview>
        {`${totalEggs} oeufs vont expirer / ${totalEggs} eggs expiring soon - ${fridgeName}`}
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
        Alerte Fraicheur
      </Heading>

      <Text style={{ fontSize: "16px", color: EMAIL_COLORS.text }}>
        Bonjour {userName},
      </Text>

      <Text style={{ fontSize: "16px", color: EMAIL_COLORS.text }}>
        Certains oeufs de votre frigo <strong>{fridgeName}</strong> arrivent
        bientot a expiration. Il est temps de les cuisiner !
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
          Oeufs a consommer rapidement :
        </Heading>

        {eggs.map((egg, index) => (
          <Section
            key={`fr-${index}`}
            style={{
              backgroundColor: "#FDFBF7",
              border: "1px solid #1C1917",
              borderLeft: `4px solid ${getFreshnessColor(egg.daysLeft)}`,
              boxShadow: "2px 2px 0px #1C1917",
              borderRadius: "8px",
              padding: "12px",
              marginBottom: "12px",
            }}
          >
            <Text
              style={{
                fontSize: "14px",
                fontWeight: "500",
                color: EMAIL_COLORS.text,
                margin: "0 0 4px 0",
              }}
            >
              {egg.name || "Boite d'oeufs"}
            </Text>
            <Text
              style={{
                fontSize: "14px",
                color: EMAIL_COLORS.textMuted,
                margin: 0,
              }}
            >
              {egg.quantity} oeufs restants •{" "}
              <strong style={{ color: getFreshnessColor(egg.daysLeft) }}>
                {getDaysLeftTextFr(egg.daysLeft)}
              </strong>
            </Text>
          </Section>
        ))}
      </EmailInfoBox>

      <Text
        style={{
          fontSize: "14px",
          color: EMAIL_COLORS.textMuted,
          fontStyle: "italic",
        }}
      >
        Idees de recettes : oeufs durs, quiche, omelette, ou patisserie sont
        parfaits pour utiliser des oeufs proches de l&apos;expiration !
      </Text>

      <Section style={{ textAlign: "center", margin: "24px 0" }}>
        <EmailButton href={fridgeUrl}>Voir mon frigo</EmailButton>
      </Section>

      <Text
        style={{
          fontSize: "12px",
          color: EMAIL_COLORS.textLight,
          textAlign: "center",
        }}
      >
        Vous recevez cet email car les notifications sont activees.
        {unsubscribeUrl ? (
          <>
            {" "}
            <a
              href={unsubscribeUrl}
              style={{
                color: EMAIL_COLORS.textLight,
                textDecoration: "underline",
              }}
            >
              Se desabonner
            </a>
            {" | "}
          </>
        ) : null}
        <a
          href={settingsUrl}
          style={{ color: EMAIL_COLORS.textLight, textDecoration: "underline" }}
        >
          Gerer mes preferences
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
        Freshness Alert
      </Heading>

      <Text style={{ fontSize: "16px", color: EMAIL_COLORS.text }}>
        Hello {userName},
      </Text>

      <Text style={{ fontSize: "16px", color: EMAIL_COLORS.text }}>
        Some eggs in your fridge <strong>{fridgeName}</strong> are about to
        expire. Time to cook them!
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
          Eggs to consume quickly:
        </Heading>

        {eggs.map((egg, index) => (
          <Section
            key={`en-${index}`}
            style={{
              backgroundColor: "#FDFBF7",
              border: "1px solid #1C1917",
              borderLeft: `4px solid ${getFreshnessColor(egg.daysLeft)}`,
              boxShadow: "2px 2px 0px #1C1917",
              borderRadius: "8px",
              padding: "12px",
              marginBottom: "12px",
            }}
          >
            <Text
              style={{
                fontSize: "14px",
                fontWeight: "500",
                color: EMAIL_COLORS.text,
                margin: "0 0 4px 0",
              }}
            >
              {egg.name || "Egg box"}
            </Text>
            <Text
              style={{
                fontSize: "14px",
                color: EMAIL_COLORS.textMuted,
                margin: 0,
              }}
            >
              {egg.quantity} eggs remaining •{" "}
              <strong style={{ color: getFreshnessColor(egg.daysLeft) }}>
                {getDaysLeftTextEn(egg.daysLeft)}
              </strong>
            </Text>
          </Section>
        ))}
      </EmailInfoBox>

      <Text
        style={{
          fontSize: "14px",
          color: EMAIL_COLORS.textMuted,
          fontStyle: "italic",
        }}
      >
        Recipe ideas: hard-boiled eggs, quiche, omelette, or pastries are
        perfect for using eggs close to expiration!
      </Text>

      <Section style={{ textAlign: "center", margin: "24px 0" }}>
        <EmailButton href={fridgeUrl}>View my fridge</EmailButton>
      </Section>

      <Text
        style={{
          fontSize: "12px",
          color: EMAIL_COLORS.textLight,
          textAlign: "center",
        }}
      >
        You received this email because notifications are enabled.
        {unsubscribeUrl ? (
          <>
            {" "}
            <a
              href={unsubscribeUrl}
              style={{
                color: EMAIL_COLORS.textLight,
                textDecoration: "underline",
              }}
            >
              Unsubscribe
            </a>
            {" | "}
          </>
        ) : null}
        <a
          href={settingsUrl}
          style={{
            color: EMAIL_COLORS.textLight,
            textDecoration: "underline",
          }}
        >
          Manage preferences
        </a>
      </Text>
    </EggscuseMeEmailLayout>
  );
}
