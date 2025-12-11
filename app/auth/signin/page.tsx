import { Typography } from "@/components/nowts/typography";
import { NeoAvatar } from "@/components/neo/neo-avatar";
import {
  NeoCard,
  NeoCardContent,
  NeoCardDescription,
  NeoCardHeader,
} from "@/components/neo/neo-card";
import { SocialProviders } from "@/lib/auth";
import { getUser } from "@/lib/auth/auth-user";
import { SiteConfig } from "@/site-config";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { SignInProviders } from "./sign-in-providers";

export const metadata: Metadata = {
  title: `Sign In | ${SiteConfig.title}`,
  description:
    "Sign in to your account to access testimonials and manage your projects.",
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <AuthSignInPage />
    </Suspense>
  );
}

async function AuthSignInPage() {
  const user = await getUser();

  if (user) {
    redirect("/fridge");
  }

  const providers = Object.keys(SocialProviders ?? {});

  return (
    <NeoCard
      variant="elevated"
      className="mx-auto h-auto w-full max-w-md lg:max-w-lg"
      padding="lg"
    >
      <NeoCardHeader className="flex flex-col items-center justify-center gap-2">
        <div className="mx-auto mt-4 flex flex-row items-center gap-2">
          <NeoAvatar
            src={SiteConfig.appIcon}
            alt="app logo"
            fallback={SiteConfig.title.substring(0, 1).toUpperCase()}
            size="sm"
            shape="square"
          />
          <Typography variant="large">{SiteConfig.title}</Typography>
        </div>

        <NeoCardDescription className="text-center">
          Please sign in to your account to continue.
        </NeoCardDescription>
      </NeoCardHeader>
      <NeoCardContent className="mt-4">
        <SignInProviders providers={providers} />
      </NeoCardContent>
    </NeoCard>
  );
}
