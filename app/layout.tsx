import { TailwindIndicator } from "@/components/utils/tailwind-indicator";
import { FloatingLegalFooter } from "@/features/legal/floating-legal-footer";
import { NextTopLoader } from "@/features/page/next-top-loader";
import { ServerToaster } from "@/features/server-sonner/server-toaster";
import { defaultLocale } from "@/i18n/config";
import { getServerUrl } from "@/lib/server-url";
import { cn } from "@/lib/utils";
import { SiteConfig } from "@/site-config";
import type { Metadata } from "next";
import { Geist_Mono, Inter, Space_Grotesk } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import type { ReactNode } from "react";
import { Suspense } from "react";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: SiteConfig.title,
  description: SiteConfig.description,
  metadataBase: new URL(getServerUrl()),
};

const CaptionFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-caption",
});

const GeistSans = Inter({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const GeistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

// Loading fallback for Suspense
function LoadingFallback() {
  return (
    <div className="bg-background flex h-full items-center justify-center">
      <div className="border-primary size-8 animate-spin rounded-full border-4 border-t-transparent" />
    </div>
  );
}

// Async wrapper component for i18n - wrapped in Suspense
async function LocaleWrapper({
  children,
  modal,
}: {
  children: ReactNode;
  modal: ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <NuqsAdapter>
        <Providers>
          <NextTopLoader
            delay={100}
            showSpinner={false}
            color="hsl(var(--primary))"
          />
          <Suspense fallback={null}>
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
  );
}

export default function RootLayout({ children, modal }: LayoutProps<"/">) {
  return (
    <html lang={defaultLocale} className="h-full" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={cn(
          "bg-background h-full font-sans antialiased",
          GeistMono.variable,
          GeistSans.variable,
          CaptionFont.variable,
        )}
      >
        <Suspense fallback={<LoadingFallback />}>
          <LocaleWrapper modal={modal}>{children}</LocaleWrapper>
        </Suspense>
      </body>
    </html>
  );
}
