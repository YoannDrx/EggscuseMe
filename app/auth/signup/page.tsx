import { Loader } from "@/components/nowts/loader";
import { Typography } from "@/components/nowts/typography";
import { NeoAvatar } from "@/components/neo/neo-avatar";
import {
  NeoCard,
  NeoCardContent,
  NeoCardDescription,
  NeoCardHeader,
  NeoCardTitle,
} from "@/components/neo/neo-card";
import { getUser } from "@/lib/auth/auth-user";
import { SiteConfig } from "@/site-config";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { SignUpCredentialsForm } from "./sign-up-credentials-form";

export const metadata: Metadata = {
  title: `Sign Up | ${SiteConfig.title}`,
  description:
    "Create your account to start collecting powerful testimonials for your projects.",
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
    redirect("/");
  }

  return (
    <NeoCard
      variant="elevated"
      className="mx-auto w-full max-w-md lg:max-w-lg"
      padding="lg"
    >
      <NeoCardHeader className="flex flex-col items-center justify-center gap-1">
        <NeoAvatar
          src={SiteConfig.appIcon}
          alt="app logo"
          fallback={SiteConfig.title.substring(0, 1).toUpperCase()}
          size="lg"
          shape="square"
          className="mb-4"
        />
        <NeoCardTitle>Sign up to {SiteConfig.title}</NeoCardTitle>
        <NeoCardDescription>
          We just need a few details to get you started.
        </NeoCardDescription>
      </NeoCardHeader>
      <NeoCardContent>
        <Suspense fallback={<Loader />}>
          <SignUpCredentialsForm />
        </Suspense>

        <Typography variant="muted" className="mt-4 text-xs">
          You already have an account?{" "}
          <Typography variant="link" as={Link} href="/auth/signin">
            Sign in
          </Typography>
        </Typography>
      </NeoCardContent>
    </NeoCard>
  );
}
