import { Typography } from "@/components/nowts/typography";
import { Layout, LayoutContent } from "@/features/page/layout";
import { SiteConfig } from "@/site-config";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote-client/rsc";

const markdown = `
**Dernière mise à jour : 11 Décembre 2025**

Bienvenue sur EggscuseMe. En utilisant notre application, vous acceptez les présentes Conditions Générales d'Utilisation.

## 1. Objet
Les présentes CGU ont pour objet de définir les modalités de mise à disposition des services de l'application EggscuseMe, ci-après nommé "le Service", et les conditions d'utilisation du Service par l'Utilisateur.

## 2. Accès au service
Le Service est accessible gratuitement à tout Utilisateur disposant d'un accès à internet. Tous les coûts afférents à l'accès au Service, que ce soit les frais matériels, logiciels ou d'accès à internet sont exclusivement à la charge de l'utilisateur.

Certaines fonctionnalités sont réservées aux abonnés Premium (Offres Brigade ou Chef).

## 3. Données personnelles
EggscuseMe s'engage à ce que la collecte et le traitement de vos données, effectués à partir du site, soient conformes au règlement général sur la protection des données (RGPD). Pour plus d'informations, référez-vous à notre Politique de Confidentialité.

## 4. Propriété intellectuelle
Les marques, logos, signes ainsi que tout le contenu du site (textes, images, son...) font l'objet d'une protection par le Code de la propriété intellectuelle et plus particulièrement par le droit d'auteur.

## 5. Responsabilité
Les informations communiquées sur l'application (notamment les dates de fraîcheur et conseils de cuisson) sont fournies à titre indicatif. L'utilisateur reste seul responsable de la vérification de la qualité des aliments qu'il consomme. EggscuseMe ne saurait être tenu responsable en cas de problème sanitaire lié à la consommation d'œufs.

## 6. Modification des CGU
EggscuseMe se réserve le droit de modifier les termes, conditions et mentions des présentes à tout moment. Il est ainsi conseillé à l'Utilisateur de consulter régulièrement la dernière version des CGU disponible sur le site.
`;

export const metadata: Metadata = {
  title: `${SiteConfig.title} - CGU`,
  description: "Conditions Générales d'Utilisation",
};

export default function TermsPage() {
  return (
    <div>
      <div className="bg-card flex w-full items-center justify-center p-8 lg:p-12">
        <Typography variant="h1">Conditions Générales d'Utilisation</Typography>
      </div>
      <Layout>
        <LayoutContent className="typography m-auto mb-8 max-w-3xl">
          <MDXRemote source={markdown} />
        </LayoutContent>
      </Layout>
    </div>
  );
}