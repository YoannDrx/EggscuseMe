import { SiteConfig } from "@/site-config";
import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SiteConfig.title} - Gérez vos œufs`,
    short_name: SiteConfig.title,
    description: SiteConfig.pwa.description,
    start_url: "/fridge",
    display: "standalone",
    orientation: "portrait",
    background_color: SiteConfig.pwa.backgroundColor,
    theme_color: SiteConfig.brand.primary,
    categories: SiteConfig.pwa.categories,
    lang: "fr",
    dir: "ltr",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icons/icon-maskable-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "Mon Frigo",
        short_name: "Frigo",
        url: "/fridge",
        icons: [{ src: "/icons/shortcut-fridge.png", sizes: "96x96" }],
      },
      {
        name: "Minuteur",
        short_name: "Timer",
        url: "/fridge/timer",
        icons: [{ src: "/icons/shortcut-timer.png", sizes: "96x96" }],
      },
      {
        name: "Ajouter des œufs",
        short_name: "Ajouter",
        url: "/fridge",
        icons: [{ src: "/icons/shortcut-add.png", sizes: "96x96" }],
      },
    ],
    related_applications: [],
    prefer_related_applications: false,
  };
}
