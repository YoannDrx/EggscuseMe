"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { NeoButton, NeoInput } from "@/components/neo";
import { Mail, Smartphone } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { subscribeToNewsletter } from "./newsletter.action";
import { useState } from "react";
import { toast } from "sonner";
import Image from "next/image";

type NewsletterSectionProps = {
  className?: string;
};

export function NewsletterSection({ className }: NewsletterSectionProps) {
  const t = useTranslations("newsletter");
  const [email, setEmail] = useState("");

  const { execute, isPending } = useAction(subscribeToNewsletter, {
    onSuccess: ({ data }) => {
      if (data.alreadySubscribed) {
        toast.info(t("alreadySubscribed"));
      } else {
        toast.success(t("success"));
        setEmail("");
      }
    },
    onError: () => {
      toast.error(t("error"));
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    execute({ email });
  };

  return (
    <section className={cn("bg-neo-bg py-16 sm:py-24", className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={cn(
            "bg-neo-card border-neo-border",
            "relative overflow-hidden",
            "rounded-[var(--radius-neo-xl)] border-[length:var(--border-neo)]",
            "px-6 py-12 shadow-[var(--shadow-neo-lg)] sm:px-12 sm:py-16",
          )}
        >
          {/* Dot Pattern Overlay */}
          <div className="dot-pattern-newsletter pointer-events-none absolute inset-0 opacity-10" />

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center gap-8 lg:flex-row lg:justify-between lg:gap-12">
            {/* Left - Text Content */}
            <div className="flex-1 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="mb-3 inline-flex items-center gap-2"
              >
                <Mail className="text-neo-accent size-5" />
                <span className="text-neo-accent text-sm font-bold tracking-wider uppercase">
                  Newsletter
                </span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="font-heading text-neo-text text-2xl font-bold sm:text-3xl"
              >
                {t("title")}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="text-neo-text-muted mt-3 max-w-md text-base"
              >
                {t("subtitle")}
              </motion.p>
            </div>

            {/* Right - Form + App Badges */}
            <div className="w-full max-w-md flex-shrink-0">
              {/* Email Form */}
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                onSubmit={handleSubmit}
                className="flex flex-col gap-3 sm:flex-row"
              >
                <NeoInput
                  type="email"
                  placeholder={t("placeholder")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1"
                  required
                />
                <NeoButton
                  type="submit"
                  variant="primary"
                  disabled={isPending}
                  className="whitespace-nowrap"
                >
                  {isPending ? t("submitting") : t("submit")}
                </NeoButton>
              </motion.form>

              {/* App Store Badges */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="mt-6"
              >
                <div className="mb-3 flex items-center justify-center gap-2 lg:justify-start">
                  <Smartphone className="text-neo-text-muted size-4" />
                  <span className="text-neo-text-muted text-sm font-medium">
                    {t("comingSoon")}
                  </span>
                </div>
                <div className="flex items-center justify-center gap-3 lg:justify-start">
                  <div
                    className={cn(
                      "border-neo-border/50 bg-neo-bg/50",
                      "flex h-10 items-center gap-2 rounded-lg border px-3",
                      "opacity-60",
                    )}
                  >
                    <Image
                      src="/icons/apple-logo.svg"
                      alt="App Store"
                      width={20}
                      height={20}
                      className="dark:invert"
                    />
                    <span className="text-neo-text text-xs font-medium">
                      App Store
                    </span>
                  </div>
                  <div
                    className={cn(
                      "border-neo-border/50 bg-neo-bg/50",
                      "flex h-10 items-center gap-2 rounded-lg border px-3",
                      "opacity-60",
                    )}
                  >
                    <Image
                      src="/icons/google-play-logo.svg"
                      alt="Google Play"
                      width={20}
                      height={20}
                    />
                    <span className="text-neo-text text-xs font-medium">
                      Google Play
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="bg-neo-accent/10 pointer-events-none absolute -top-20 -left-20 size-40 rounded-full blur-3xl" />
          <div className="bg-neo-accent/5 pointer-events-none absolute -right-20 -bottom-20 size-60 rounded-full blur-3xl" />
        </motion.div>
      </div>
    </section>
  );
}
