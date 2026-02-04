"use client";

import {
  NeoAccordion,
  NeoAccordionContent,
  NeoAccordionItem,
  NeoAccordionTrigger,
  NeoTitle,
} from "@/components/neo";
import { ClientMarkdown } from "../markdown/client-markdown";
import { SectionLayout } from "./section-layout";
import { useTranslations } from "next-intl";
import { HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type Faq = {
  question: string;
  answer: string;
};

type FeaturesPreviewProps = {
  faq: Faq[];
};

export const FAQSection = (props: FeaturesPreviewProps) => {
  const t = useTranslations("landing.faq");

  return (
    <SectionLayout size="lg" className="flex gap-8 max-lg:flex-col lg:gap-16">
      <div className="flex-1 space-y-3">
        <span className="text-neo-accent text-sm font-black tracking-wider uppercase">
          FAQ
        </span>
        <NeoTitle size="2xl">{t("title")}</NeoTitle>
      </div>
      <div className="flex-1">
        <NeoAccordion type="single" collapsible className="flex flex-col gap-3">
          {props.faq.map((e, i) => {
            return (
              <NeoAccordionItem
                value={`item-${i}`}
                key={i}
                className={cn(
                  "border-neo-border/30 bg-neo-card",
                  "rounded-[var(--radius-neo-xl)] border-[length:var(--border-neo)]",
                  "shadow-[var(--shadow-neo-sm)]",
                  "transition-all duration-200",
                  "data-[state=open]:border-neo-accent/30",
                  "data-[state=open]:shadow-[var(--shadow-neo-md)]",
                  "data-[state=open]:bg-neo-accent/5",
                )}
              >
                <NeoAccordionTrigger
                  className={cn(
                    "text-left text-base font-semibold sm:text-lg",
                    "gap-3 p-4 sm:p-5",
                    "group",
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "bg-neo-accent/10 border-neo-border/20",
                        "flex size-8 flex-shrink-0 items-center justify-center",
                        "rounded-[var(--radius-neo-lg)] border-[length:var(--border-neo)]",
                        "transition-colors duration-200",
                        "group-hover:bg-neo-accent/20",
                      )}
                    >
                      <HelpCircle className="text-neo-accent size-4" />
                    </div>
                    <span className="pt-0.5">{e.question}</span>
                  </div>
                </NeoAccordionTrigger>
                <NeoAccordionContent className="px-4 pb-5 pl-[4.25rem] text-base sm:px-5 sm:pl-[4.75rem]">
                  <div className="text-neo-text-muted leading-relaxed">
                    <ClientMarkdown>{e.answer}</ClientMarkdown>
                  </div>
                </NeoAccordionContent>
              </NeoAccordionItem>
            );
          })}
        </NeoAccordion>
      </div>
    </SectionLayout>
  );
};
