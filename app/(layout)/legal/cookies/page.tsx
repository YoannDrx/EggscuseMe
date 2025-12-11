import { Typography } from "@/components/nowts/typography";
import { Layout, LayoutContent } from "@/features/page/layout";
import { SiteConfig } from "@/site-config";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote-client/rsc";

const markdown = `
**Dernière mise à jour : 11 Décembre 2025**

## Qu'est-ce qu'un cookie ?
Un cookie est un petit fichier texte déposé sur votre terminal (ordinateur, tablette ou mobile) lors de la visite d'un site ou de la consultation d'une publicité. Ils ont notamment pour but de collecter des informations relatives à votre navigation sur les sites et de vous adresser des services personnalisés.

## Les cookies que nous utilisons

### 1. Cookies strictement nécessaires
Ces cookies sont indispensables au bon fonctionnement de l'application (ex: maintien de votre session connectée). Ils ne peuvent pas être désactivés.

### 2. Cookies de performance et d'analyse
Nous utilisons des outils comme Vercel Analytics pour comprendre comment notre site est utilisé et améliorer l'expérience utilisateur. Ces données sont anonymisées.

### 3. Cookies de préférences
Ils permettent de mémoriser vos choix (langue, thème clair/sombre) pour faciliter votre navigation future.

## Gestion des cookies
Vous pouvez à tout moment désactiver les cookies via les paramètres de votre navigateur. Notez cependant que la désactivation des cookies nécessaires peut empêcher l'utilisation de certaines fonctionnalités de l'application (comme la connexion à votre compte).
`;

export const metadata: Metadata = {
  title: `${SiteConfig.title} - Cookies`,
  description: "Politique de Cookies",
};

export default function CookiesPage() {
  return (
    <div>
      <div className="bg-card flex w-full items-center justify-center p-8 lg:p-12">
        <Typography variant="h1">Politique de Cookies</Typography>
      </div>
      <Layout>
        <LayoutContent className="typography m-auto mb-8 max-w-3xl">
          <MDXRemote source={markdown} />
        </LayoutContent>
      </Layout>
    </div>
  );
}
