import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  experimental: {
    authInterrupts: true,
  },
  cacheComponents: true,
  typedRoutes: true,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },

  // Redirect legacy /account/* routes to new /fridge/settings/*
  async redirects() {
    return [
      {
        source: "/account",
        destination: "/fridge/settings/profile",
        permanent: true,
      },
      {
        source: "/account/email",
        destination: "/fridge/settings/notifications",
        permanent: true,
      },
      {
        source: "/account/change-password",
        destination: "/fridge/settings/security",
        permanent: true,
      },
      {
        source: "/account/change-email",
        destination: "/fridge/settings/security",
        permanent: true,
      },
      {
        source: "/account/danger",
        destination: "/fridge/settings/danger",
        permanent: true,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
