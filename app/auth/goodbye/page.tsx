import { NeoAvatar } from "@/components/neo/neo-avatar";
import { NeoButton } from "@/components/neo/neo-button";
import {
  NeoCard,
  NeoCardDescription,
  NeoCardFooter,
  NeoCardHeader,
} from "@/components/neo/neo-card";
import { SiteConfig } from "@/site-config";
import { CheckCircle } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: `Account Deleted | ${SiteConfig.title}`,
  description:
    "Your account has been successfully deleted. Thank you for using our service.",
};

export default function GoodbyePage() {
  return (
    <NeoCard
      variant="elevated"
      className="mx-auto w-full max-w-md lg:max-w-lg"
      padding="lg"
    >
      <NeoCardHeader>
        <div className="flex justify-center">
          <NeoAvatar
            fallback="GB"
            size="lg"
            shape="square"
            className="flex items-center justify-center"
          >
            <CheckCircle className="text-neo-accent size-6" />
          </NeoAvatar>
        </div>
        <NeoCardHeader className="text-center">Account Deleted</NeoCardHeader>

        <NeoCardDescription className="text-center">
          Your account has been successfully deleted. We're sorry to see you go.
        </NeoCardDescription>
      </NeoCardHeader>
      <NeoCardFooter className="border-t-neo-border border-t-[length:var(--border-neo)] pt-6">
        <div className="w-full space-y-4 text-center">
          <p className="text-neo-text-muted text-sm">
            Your account and all associated data have been permanently removed
            from our system.
          </p>
          <p className="text-neo-text-muted text-sm">
            If you change your mind, you're welcome to create a new account
            anytime.
          </p>
          <NeoButton asChild className="w-full">
            <Link href="/auth/signup">Create New Account</Link>
          </NeoButton>
        </div>
      </NeoCardFooter>
    </NeoCard>
  );
}
