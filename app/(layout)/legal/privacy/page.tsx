import { Typography } from "@/components/nowts/typography";
import { Layout, LayoutContent } from "@/features/page/layout";
import { SiteConfig } from "@/site-config";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote-client/rsc";

const markdown = `
**Dernière mise à jour : 11 Décembre 2025**

La protection de vos données personnelles est au cœur de nos préoccupations.

## 1. Données collectées
Nous collectons les données suivantes :
- Données d'identification (Nom, Email) lors de l'inscription.
- Données d'utilisation (Inventaire du frigo, historique de consommation).
- Données techniques (Adresse IP, type de navigateur) à des fins de sécurité et de statistiques.

## 2. Utilisation des données
Vos données sont utilisées pour :
- Fournir et gérer le Service.
- Vous envoyer des notifications de fraîcheur (si activées).
- Améliorer nos fonctionnalités via des statistiques anonymisées.

## 3. Partage des données
Nous ne vendons pas vos données personnelles. Elles peuvent être partagées avec des prestataires tiers uniquement pour le bon fonctionnement du service (hébergement, envoi d'emails).

## 4. Vos droits
Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, et de suppression de vos données. Vous pouvez exercer ces droits directement dans les paramètres de votre compte ou en nous contactant.

## 5. Sécurité
Nous mettons en œuvre toutes les mesures techniques et organisationnelles nécessaires pour protéger vos données contre tout accès non autorisé, perte ou altération.
`;

export const metadata: Metadata = {
  title: `${SiteConfig.title} - Confidentialité`,
  description: "Politique de Confidentialité",
};

export default function PrivacyPage() {
  return (
    <div>
      <div className="bg-card flex w-full items-center justify-center p-8 lg:p-12">
        <Typography variant="h1">Politique de Confidentialité</Typography>
      </div>
      <Layout>
        <LayoutContent className="typography m-auto mb-8 max-w-3xl">
          <MDXRemote source={markdown} />
        </LayoutContent>
      </Layout>
    </div>
  );
}