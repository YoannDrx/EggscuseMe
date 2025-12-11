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
    <SectionLayout size="lg" className="flex max-lg:flex-col">
      <div className="flex-1 space-y-2">
        <span className="text-neo-accent text-sm font-black tracking-wider uppercase">
          FAQ
        </span>
        <NeoTitle size="2xl">{t("title")}</NeoTitle>
      </div>
      <div className="flex-1">
        <NeoAccordion type="single" collapsible>
          {props.faq.map((e, i) => {
            return (
              <NeoAccordionItem value={`item-${i}`} key={i}>
                <NeoAccordionTrigger className="text-left text-lg">
                  {e.question}
                </NeoAccordionTrigger>
                <NeoAccordionContent className="text-base">
                  <ClientMarkdown>{e.answer}</ClientMarkdown>
                </NeoAccordionContent>
              </NeoAccordionItem>
            );
          })}
        </NeoAccordion>
      </div>
    </SectionLayout>
  );
};
