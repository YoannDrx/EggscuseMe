import { NeoButton, NeoInput, NeoLabel, NeoTextarea } from "@/components/neo";
import { contactSupportAction } from "@/features/contact/support/contact-support.action";
import { ContactSupportSchema } from "@/features/contact/support/contact-support.schema";
import { serverToast } from "@/lib/server-toast";
import { cn } from "@/lib/utils";
import { SiteConfig } from "@/site-config";
import {
  Building2,
  Clock,
  Mail,
  MessageSquare,
  HelpCircle,
  Send,
} from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("pages.contact.meta");
  return {
    title: t("title"),
    description: t("description"),
    keywords: ["contact", "support", "help", "eggs"],
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: `${SiteConfig.prodUrl}/contact`,
      type: "website",
    },
  };
}

export default async function ContactPage() {
  const t = await getTranslations("pages.contact");

  return (
    <div className="bg-neo-bg min-h-screen">
      {/* Hero Header */}
      <div
        className={cn(
          "border-neo-border bg-neo-card",
          "border-b-[length:var(--border-neo-lg)]",
          "shadow-[var(--shadow-neo-md)]",
        )}
      >
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-4 py-16 text-center">
          <div
            className={cn(
              "border-neo-border bg-neo-accent/10",
              "flex size-16 items-center justify-center",
              "rounded-[var(--radius-neo-xl)] border-[length:var(--border-neo)]",
              "shadow-[var(--shadow-neo-md)]",
            )}
          >
            <Mail className="text-neo-accent size-8" />
          </div>
          <h1 className="font-heading text-neo-text text-4xl font-bold tracking-tight md:text-5xl">
            {t("title")}
          </h1>
          <p className="text-neo-text-muted max-w-2xl text-lg">
            {t("subtitle")}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-5xl px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left Column - Info */}
          <div className="flex flex-col gap-6">
            {/* Contact Info Card */}
            <div
              className={cn(
                "border-neo-border bg-neo-card",
                "rounded-[var(--radius-neo-2xl)] border-[length:var(--border-neo)]",
                "p-6 shadow-[var(--shadow-neo-md)]",
              )}
            >
              <h2 className="text-neo-text mb-6 text-xl font-bold">
                {t("info.title")}
              </h2>
              <dl className="flex flex-col gap-4">
                <div className="flex gap-4">
                  <dt
                    className={cn(
                      "border-neo-border bg-neo-accent/10",
                      "flex size-10 flex-none items-center justify-center",
                      "rounded-[var(--radius-neo-lg)] border-[length:var(--border-neo)]",
                    )}
                  >
                    <Building2 className="text-neo-accent size-5" />
                  </dt>
                  <dd className="text-neo-text-muted">
                    <span className="text-neo-text block font-medium">
                      {t("info.address")}
                    </span>
                    {t("info.addressValue")}
                  </dd>
                </div>
                <div className="flex gap-4">
                  <dt
                    className={cn(
                      "border-neo-border bg-neo-accent/10",
                      "flex size-10 flex-none items-center justify-center",
                      "rounded-[var(--radius-neo-lg)] border-[length:var(--border-neo)]",
                    )}
                  >
                    <Mail className="text-neo-accent size-5" />
                  </dt>
                  <dd className="text-neo-text-muted">
                    <span className="text-neo-text block font-medium">
                      {t("info.email")}
                    </span>
                    <a
                      href={`mailto:${t("info.emailValue")}`}
                      className="hover:text-neo-accent transition-colors"
                    >
                      {t("info.emailValue")}
                    </a>
                  </dd>
                </div>
                <div className="flex gap-4">
                  <dt
                    className={cn(
                      "border-neo-border bg-neo-accent/10",
                      "flex size-10 flex-none items-center justify-center",
                      "rounded-[var(--radius-neo-lg)] border-[length:var(--border-neo)]",
                    )}
                  >
                    <Clock className="text-neo-accent size-5" />
                  </dt>
                  <dd className="text-neo-text-muted">
                    <span className="text-neo-text block font-medium">
                      {t("info.hours")}
                    </span>
                    {t("info.hoursValue")}
                    <br />
                    <span className="text-neo-text-muted/70 text-sm">
                      {t("info.timezone")}
                    </span>
                  </dd>
                </div>
                <div className="flex gap-4">
                  <dt
                    className={cn(
                      "border-neo-border bg-neo-accent/10",
                      "flex size-10 flex-none items-center justify-center",
                      "rounded-[var(--radius-neo-lg)] border-[length:var(--border-neo)]",
                    )}
                  >
                    <MessageSquare className="text-neo-accent size-5" />
                  </dt>
                  <dd className="text-neo-text-muted">
                    <span className="text-neo-text block font-medium">
                      {t("info.response")}
                    </span>
                    {t("info.responseValue")}
                  </dd>
                </div>
              </dl>
            </div>

            {/* FAQ Card */}
            <div
              className={cn(
                "border-neo-border bg-neo-card",
                "rounded-[var(--radius-neo-2xl)] border-[length:var(--border-neo)]",
                "p-6 shadow-[var(--shadow-neo-md)]",
              )}
            >
              <div className="mb-6 flex items-center gap-3">
                <div
                  className={cn(
                    "border-neo-border bg-neo-accent/10",
                    "flex size-10 items-center justify-center",
                    "rounded-[var(--radius-neo-lg)] border-[length:var(--border-neo)]",
                  )}
                >
                  <HelpCircle className="text-neo-accent size-5" />
                </div>
                <h2 className="text-neo-text text-xl font-bold">
                  {t("faq.title")}
                </h2>
              </div>
              <div className="flex flex-col gap-4">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className={cn(
                      "border-neo-border bg-neo-bg",
                      "rounded-[var(--radius-neo-lg)] border-[length:var(--border-neo)]",
                      "p-4",
                    )}
                  >
                    <p className="text-neo-text font-medium">
                      {t(`faq.items.${i}.question`)}
                    </p>
                    <p className="text-neo-text-muted mt-1 text-sm">
                      {t(`faq.items.${i}.answer`)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div
            className={cn(
              "border-neo-border bg-neo-card",
              "rounded-[var(--radius-neo-2xl)] border-[length:var(--border-neo)]",
              "p-6 shadow-[var(--shadow-neo-md)]",
              "h-fit",
            )}
          >
            <div className="mb-6 flex items-center gap-3">
              <div
                className={cn(
                  "border-neo-border bg-neo-accent/10",
                  "flex size-10 items-center justify-center",
                  "rounded-[var(--radius-neo-lg)] border-[length:var(--border-neo)]",
                )}
              >
                <Send className="text-neo-accent size-5" />
              </div>
              <h2 className="text-neo-text text-xl font-bold">
                {t("form.title")}
              </h2>
            </div>

            <form
              action={async (formData) => {
                "use server";

                const tServer = await getTranslations("pages.contact.form");

                const firstname = formData.get("first-name");
                const lastname = formData.get("last-name");
                const email = formData.get("email");
                const subject = formData.get("subject");
                const message = formData.get("message");

                const result = ContactSupportSchema.safeParse({
                  firstname,
                  lastname,
                  email,
                  subject,
                  message,
                });

                if (!result.success) {
                  await serverToast(tServer("error"), "error");
                  return;
                }

                await contactSupportAction(result.data);
                await serverToast(tServer("success"), "success");
              }}
              className="flex flex-col gap-6"
            >
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <NeoLabel htmlFor="first-name">
                    {t("form.firstName")}
                  </NeoLabel>
                  <NeoInput
                    id="first-name"
                    name="first-name"
                    type="text"
                    autoComplete="given-name"
                    className="mt-2"
                    required
                  />
                </div>
                <div>
                  <NeoLabel htmlFor="last-name">{t("form.lastName")}</NeoLabel>
                  <NeoInput
                    id="last-name"
                    name="last-name"
                    type="text"
                    autoComplete="family-name"
                    className="mt-2"
                    required
                  />
                </div>
              </div>

              <div>
                <NeoLabel htmlFor="email">{t("form.email")}</NeoLabel>
                <NeoInput
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className="mt-2"
                  required
                />
              </div>

              <div>
                <NeoLabel htmlFor="subject">{t("form.subject")}</NeoLabel>
                <NeoInput
                  id="subject"
                  name="subject"
                  type="text"
                  className="mt-2"
                  placeholder={t("form.subjectPlaceholder")}
                  required
                />
              </div>

              <div>
                <NeoLabel htmlFor="message">{t("form.message")}</NeoLabel>
                <NeoTextarea
                  id="message"
                  name="message"
                  rows={5}
                  className="mt-2"
                  placeholder={t("form.messagePlaceholder")}
                  required
                />
              </div>

              <NeoButton type="submit" className="w-full">
                {t("form.submit")}
              </NeoButton>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
