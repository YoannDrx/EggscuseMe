import {
  NeoCard,
  NeoCardContent,
  NeoCardDescription,
  NeoCardFooter,
  NeoCardHeader,
  NeoCardTitle,
} from "@/components/neo/neo-card";
import { SiteConfig } from "@/site-config";
import { Mail } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Verify Your Email | ${SiteConfig.title}`,
  description:
    "Please check your email and click the verification link to complete your account setup.",
};

export default function VerificationCard() {
  return (
    <NeoCard
      variant="elevated"
      className="mx-auto w-full max-w-md"
      padding="lg"
    >
      <NeoCardHeader className="text-center">
        <div className="bg-neo-accent/10 border-neo-border mx-auto mb-4 flex size-12 items-center justify-center rounded-full border-[length:var(--border-neo)]">
          <Mail className="text-neo-accent size-6" />
        </div>
        <NeoCardTitle className="text-2xl">Verify Your Email</NeoCardTitle>
        <NeoCardDescription>
          We've sent a verification link to your email address
        </NeoCardDescription>
      </NeoCardHeader>
      <NeoCardContent className="space-y-4">
        <div className="bg-neo-bg border-neo-border rounded-[var(--radius-neo-lg)] border-[length:var(--border-neo)] p-4 text-sm">
          <p className="text-neo-text mb-2 font-medium">
            Please check your inbox
          </p>
          <p className="text-neo-text-muted">
            To complete your account setup, please open the verification email
            we just sent and click on the link inside.
          </p>
        </div>
        <div className="text-neo-text-muted text-sm">
          <p>
            If you don't see the email in your inbox, please check your spam
            folder or request a new verification link.
          </p>
        </div>
      </NeoCardContent>
      <NeoCardFooter className="border-t-neo-border flex justify-center border-t-[length:var(--border-neo)] pt-6">
        <p className="text-neo-text-muted text-center text-xs">
          Having trouble? Contact our support team for assistance.
        </p>
      </NeoCardFooter>
    </NeoCard>
  );
}
