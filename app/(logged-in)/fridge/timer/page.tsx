import {
  IconChefHatSticker,
  IconTipSticker,
} from "@/components/eggscuseme/illustrations";
import { MobileHeader } from "@/components/eggscuseme/navigation/mobile-header";
import {
  NeoCard,
  NeoCardContent,
  NeoCardHeader,
  NeoCardTitle,
} from "@/components/neo/neo-card";
import { EggTimer } from "@/features/timer";
import { Eggy } from "@/features/mascot";
import {
  getCookingTips,
  getCookingTipsFr,
} from "@/features/timer/cooking-times";
import { useLocale, useTranslations } from "next-intl";

export default function TimerPage() {
  const locale = useLocale();
  const t = useTranslations("timer");
  const tips = locale === "fr" ? getCookingTipsFr() : getCookingTips();

  const guideItems = [
    {
      key: "runny" as const,
      time: t("minutes", { count: "3" }),
      description: t("yolkDescriptions.runny"),
    },
    {
      key: "soft" as const,
      time: t("minutes", { count: "5-6" }),
      description: t("yolkDescriptions.soft"),
    },
    {
      key: "medium" as const,
      time: t("minutes", { count: "7-8" }),
      description: t("yolkDescriptions.medium"),
    },
    {
      key: "hard" as const,
      time: t("minutes", { count: "10+" }),
      description: t("yolkDescriptions.hard"),
    },
  ];

  const pageContainer =
    "mx-auto w-full max-w-5xl md:max-w-6xl lg:max-w-6xl xl:max-w-7xl";

  return (
    <div className="flex min-h-screen flex-col">
      {/* Mobile Header */}
      <MobileHeader
        title={t("title")}
        subtitle={t("subtitle")}
        mascot
        mascotMood="chef"
      />

      {/* Desktop Header */}
      <div className="hidden md:block">
        <div className={`${pageContainer} flex items-center gap-4`}>
          <Eggy mood="timer" size="lg" />
          <div>
            <h1 className="font-heading text-2xl font-bold">
              {t("cookingTitle")}
            </h1>
            <p className="text-neo-text-muted">{t("subtitle")}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 px-[var(--space-page-x)] py-[var(--space-page-y)] md:px-0">
        <div
          className={`${pageContainer} flex flex-col gap-6 lg:flex-row lg:gap-8`}
        >
          {/* Timer - Centered on mobile, left on desktop */}
          <div className="flex justify-center lg:justify-start">
            <EggTimer />
          </div>

          {/* Info Cards */}
          <div className="flex-1 space-y-4 md:space-y-6">
            {/* Tips Card */}
            <NeoCard variant="elevated" padding="lg">
              <NeoCardHeader className="pb-3 md:pb-4">
                <NeoCardTitle className="font-heading flex items-center gap-2 text-base md:text-lg">
                  <IconTipSticker className="size-7 md:size-8" />
                  {t("tipsTitle")}
                </NeoCardTitle>
              </NeoCardHeader>
              <NeoCardContent className="pt-0">
                <ul className="space-y-2 md:space-y-3">
                  {tips.map((tip, index) => (
                    <li
                      key={index}
                      className="text-neo-text-muted flex gap-2 text-sm md:gap-3"
                    >
                      <span className="bg-neo-accent/10 text-neo-accent flex size-5 shrink-0 items-center justify-center rounded-full text-xs font-medium md:size-6">
                        {index + 1}
                      </span>
                      <span className="pt-0.5">{tip}</span>
                    </li>
                  ))}
                </ul>
              </NeoCardContent>
            </NeoCard>

            {/* Cooking Guide - Condensed on mobile */}
            <NeoCard variant="elevated" padding="lg">
              <NeoCardHeader className="pb-3 md:pb-4">
                <NeoCardTitle className="font-heading flex items-center gap-2 text-base md:text-lg">
                  <IconChefHatSticker className="size-7 md:size-8" />
                  {t("guideTitle")}
                </NeoCardTitle>
              </NeoCardHeader>
              <NeoCardContent className="space-y-3 pt-0 md:space-y-4">
                <div className="grid grid-cols-2 gap-2 md:gap-4">
                  {guideItems.map((item, index) => {
                    const guideStyles = [
                      { bg: "bg-fresh-extra/10", text: "text-fresh-extra" },
                      { bg: "bg-fresh/10", text: "text-fresh" },
                      { bg: "bg-fresh-cook/10", text: "text-fresh-cook" },
                      { bg: "bg-neo-card", text: "text-neo-text" },
                    ];

                    const style =
                      guideStyles[index] ?? guideStyles[guideStyles.length - 1];

                    return (
                      <div
                        key={item.key}
                        className={`${style.bg} rounded-xl p-3 md:p-4`}
                      >
                        <h4
                          className={`font-heading ${style.text} text-sm font-semibold md:text-base`}
                        >
                          {t(`yolkPreferences.${item.key}`)} ({item.time})
                        </h4>
                        <p className="text-neo-text-muted mt-0.5 text-xs md:mt-1 md:text-sm">
                          {item.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </NeoCardContent>
            </NeoCard>
          </div>
        </div>
      </main>
    </div>
  );
}
