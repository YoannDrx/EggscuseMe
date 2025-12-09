import { getServerUrl } from "@/lib/server-url";
import { SiteConfig } from "@/site-config";
import { Heading, Preview, Section, Text } from "@react-email/components";
import {
  EMAIL_COLORS,
  EggscuseMeEmailLayout,
  EmailButton,
  EmailInfoBox,
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
};

function getFreshnessColor(daysLeft: number): string {
  if (daysLeft <= 1) return EMAIL_COLORS.expired;
  if (daysLeft <= 3) return EMAIL_COLORS.cookThoroughly;
  return EMAIL_COLORS.fresh;
}

function getDaysLeftText(daysLeft: number): string {
  if (daysLeft === 0) return "Expire aujourd'hui";
  if (daysLeft === 1) return "1 jour restant";
  return `${daysLeft} jours restants`;
}

export default function ExpirationWarningEmail({
  userName = "Chef",
  eggs = [
    { name: "Ferme du Coin", daysLeft: 2, quantity: 4 },
    { name: "Marche bio", daysLeft: 3, quantity: 6 },
  ],
  fridgeName = "Mon Frigo",
}: ExpirationWarningEmailProps) {
  let baseUrl = getServerUrl();

  if (baseUrl.startsWith("http://localhost")) {
    baseUrl = SiteConfig.prodUrl;
  }

  const fridgeUrl = `${baseUrl}/fridge`;
  const totalEggs = eggs.reduce((sum, egg) => sum + egg.quantity, 0);

  return (
    <EggscuseMeEmailLayout
      eggyMood="chef"
      footerText="Vous recevez cet email car les notifications sont activees dans vos preferences."
    >
      <Preview>
        {`${totalEggs} oeufs vont bientot expirer dans ${fridgeName}`}
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
        Alerte Fraicheur
      </Heading>

      {/* Greeting */}
      <Text style={{ fontSize: "16px", color: EMAIL_COLORS.text }}>
        Bonjour {userName},
      </Text>

      <Text style={{ fontSize: "16px", color: EMAIL_COLORS.text }}>
        Certains oeufs de votre frigo <strong>{fridgeName}</strong> arrivent
        bientot a expiration. Il est temps de les cuisiner !
      </Text>

      {/* Eggs list */}
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
            key={index}
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "6px",
              padding: "12px",
              marginBottom: index < eggs.length - 1 ? "8px" : "0",
              borderLeft: `4px solid ${getFreshnessColor(egg.daysLeft)}`,
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
                {getDaysLeftText(egg.daysLeft)}
              </strong>
            </Text>
          </Section>
        ))}
      </EmailInfoBox>

      {/* Cooking tips */}
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

      {/* CTA Button */}
      <Section style={{ textAlign: "center", margin: "24px 0" }}>
        <EmailButton href={fridgeUrl}>Voir mon frigo</EmailButton>
      </Section>
    </EggscuseMeEmailLayout>
  );
}
