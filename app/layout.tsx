import { TailwindIndicator } from "@/components/utils/tailwind-indicator";
import { FloatingLegalFooter } from "@/features/legal/floating-legal-footer";
import { NextTopLoader } from "@/features/page/next-top-loader";
import { ServerToaster } from "@/features/server-sonner/server-toaster";
import { defaultLocale } from "@/i18n/config";
import { LangSetter } from "@/features/i18n/lang-setter";
import { getServerUrl } from "@/lib/server-url";
import { cn } from "@/lib/utils";
import { SiteConfig } from "@/site-config";
import type { Metadata, Viewport } from "next";
import { Fredoka, Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Suspense } from "react";
import "./globals.css";
import { Providers } from "./providers";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: SiteConfig.title,
  description: SiteConfig.description,
  metadataBase: new URL(getServerUrl()),
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: SiteConfig.title,
  },
  formatDetection: {
    telephone: false,
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

// Heading font - Rounded, friendly, egg-like
const HeadingFont = Fredoka({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["400", "500", "600", "700"],
});

// Body font - Modern, clean, very readable
const BodyFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});

// Monospace font for code
const MonoFont = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

// Loading fallback for Suspense
function LoadingFallback() {
  return (
    <div className="bg-background flex h-full items-center justify-center">
      <div className="border-primary size-8 animate-spin rounded-full border-4 border-t-transparent" />
    </div>
  );
}

export default function RootLayout(props: LayoutProps<"/">) {
  return (
    <html lang={defaultLocale} className="h-full" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={cn(
          "bg-background h-full font-sans antialiased",
          HeadingFont.variable,
          BodyFont.variable,
          MonoFont.variable,
        )}
      >
        <Suspense fallback={<LoadingFallback />}>
          <LocaleAwareLayout {...props} />
        </Suspense>
      </body>
    </html>
  );
}

async function LocaleAwareLayout({ children, modal }: LayoutProps<"/">) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <>
      <LangSetter locale={locale} />
      <NextIntlClientProvider messages={messages} locale={locale}>
        <NuqsAdapter>
          <Providers>
            <NextTopLoader
              delay={100}
              showSpinner={false}
              color="hsl(var(--primary))"
            />
            <Suspense fallback={<LoadingFallback />}>
              {children}
              {modal}
            </Suspense>
            <TailwindIndicator />
            <FloatingLegalFooter />
            <Suspense>
              <ServerToaster />
            </Suspense>
          </Providers>
        </NuqsAdapter>
      </NextIntlClientProvider>
    </>
  );
}
