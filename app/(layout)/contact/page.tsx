import GridBackground from "@/components/nowts/grid-background";
import { Typography } from "@/components/nowts/typography";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { contactSupportAction } from "@/features/contact/support/contact-support.action";
import { ContactSupportSchema } from "@/features/contact/support/contact-support.schema";
import { serverToast } from "@/lib/server-toast";
import { SiteConfig } from "@/site-config";
import { Building2, Clock, Mail, MessageSquare } from "lucide-react";
import type { Metadata } from "next";
import { getLocale } from "next-intl/server";

type ContactCopy = {
  metaTitle: string;
  metaDescription: string;
  metaOgDescription: string;
  metaKeywords: string[];
  heroTitle: string;
  heroDescription: string;
  srAddress: string;
  srEmail: string;
  srHours: string;
  srResponse: string;
  hours: string;
  timezone: string;
  responseDelay: string;
  faqTitle: string;
  faqs: { question: string; answer: string }[];
  form: {
    firstName: string;
    lastName: string;
    email: string;
    subject: string;
    message: string;
    subjectPlaceholder: string;
    messagePlaceholder: string;
    submit: string;
    validationError: string;
    success: string;
  };
};

const COPY: Record<"fr" | "en", ContactCopy> = {
  fr: {
    metaTitle: `Contact - ${SiteConfig.title}`,
    metaDescription:
      "Contactez l'équipe EggscuseMe. Nous sommes là pour répondre à vos questions sur le suivi de vos oeufs et la gestion de votre frigo.",
    metaOgDescription:
      "Contactez l'équipe EggscuseMe pour toute question sur notre application de suivi d'oeufs.",
    metaKeywords: ["contact", "support", "aide", "oeufs", "questions"],
    heroTitle: "Nous contacter",
    heroDescription:
      "Une question sur EggscuseMe ? Besoin d'aide pour gérer votre frigo ou simplement envie de partager vos idées ? Nous sommes à votre écoute.",
    srAddress: "Adresse",
    srEmail: "Email",
    srHours: "Horaires",
    srResponse: "Délai de réponse",
    hours: "Lundi - Vendredi, 9h - 18h",
    timezone: "Fuseau horaire : Paris (CET)",
    responseDelay: "Réponse sous 24-48h ouvrées",
    faqTitle: "Questions fréquentes",
    faqs: [
      {
        question: "L'application est-elle gratuite ?",
        answer:
          "Oui ! Le plan gratuit permet de gérer jusqu'à 2 boîtes d'oeufs. Pour des fonctionnalités illimitées, passez au plan Premium à 2.99€/mois.",
      },
      {
        question: "Comment fonctionne le partage de frigo ?",
        answer:
          "Créez un lien d'invitation et partagez-le avec vos proches. Ils pourront voir et gérer les oeufs du frigo partagé.",
      },
      {
        question: "Comment calculez-vous la fraîcheur ?",
        answer:
          "Nous utilisons la date de ponte que vous indiquez. Les oeufs sont extra-frais jusqu'à 9 jours, frais jusqu'à 21 jours, puis à cuire jusqu'à 28 jours.",
      },
    ],
    form: {
      firstName: "Prénom",
      lastName: "Nom",
      email: "Email",
      subject: "Sujet",
      message: "Message",
      subjectPlaceholder: "Question sur le suivi des oeufs...",
      messagePlaceholder: "Décrivez votre question ou suggestion...",
      submit: "Envoyer le message",
      validationError: "Veuillez remplir tous les champs",
      success: "Votre message a bien été envoyé",
    },
  },
  en: {
    metaTitle: `Contact - ${SiteConfig.title}`,
    metaDescription:
      "Contact the EggscuseMe team. We're here to answer questions about egg tracking and fridge management.",
    metaOgDescription:
      "Get in touch with the EggscuseMe team for any question about our egg tracking app.",
    metaKeywords: [
      "contact",
      "support",
      "help",
      "eggs",
      "questions",
      "freshness",
    ],
    heroTitle: "Contact us",
    heroDescription:
      "Have a question about EggscuseMe? Need help managing your fridge or want to share ideas? We're listening.",
    srAddress: "Address",
    srEmail: "Email",
    srHours: "Hours",
    srResponse: "Response time",
    hours: "Monday - Friday, 9am - 6pm",
    timezone: "Time zone: Paris (CET)",
    responseDelay: "Reply within 24-48h on business days",
    faqTitle: "Frequently asked questions",
    faqs: [
      {
        question: "Is the app free?",
        answer:
          "Yes! The free plan lets you manage up to 2 egg boxes. For unlimited features, switch to Premium at €2.99/month.",
      },
      {
        question: "How does fridge sharing work?",
        answer:
          "Create an invite link and share it with your family. They can view and manage eggs in the shared fridge.",
      },
      {
        question: "How do you calculate freshness?",
        answer:
          "We use the laying date you provide. Eggs are extra-fresh up to 9 days, fresh up to 21 days, then cook thoroughly up to 28 days.",
      },
    ],
    form: {
      firstName: "First name",
      lastName: "Last name",
      email: "Email",
      subject: "Subject",
      message: "Message",
      subjectPlaceholder: "Question about egg tracking...",
      messagePlaceholder: "Describe your question or suggestion...",
      submit: "Send message",
      validationError: "Please fill out all fields",
      success: "Your message has been sent",
    },
  },
};

async function getCopy(): Promise<ContactCopy> {
  const locale = await getLocale();
  return locale in COPY ? COPY[locale as "fr" | "en"] : COPY.en;
}

export async function generateMetadata(): Promise<Metadata> {
  const copy = await getCopy();

  return {
    title: copy.metaTitle,
    description: copy.metaDescription,
    keywords: copy.metaKeywords,
    openGraph: {
      title: copy.metaTitle,
      description: copy.metaOgDescription,
      url: `${SiteConfig.prodUrl}/contact`,
      type: "website",
    },
  };
}

export default async function ContactPage() {
  const copy = await getCopy();

  return (
    <div className="bg-background relative isolate min-h-screen">
      <GridBackground
        size={20}
        color="color-mix(in srgb, var(--border) 30%, transparent)"
      />
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
        {/* Left Column - Info */}
        <div className="bg-muted/10 relative flex items-center justify-end px-6 py-24 backdrop-blur-sm sm:py-32 lg:px-12">
          <div className="relative z-10 mx-auto w-full max-w-xl lg:mx-0 lg:max-w-lg">
            <Typography
              variant="h1"
              className="text-foreground text-4xl font-semibold tracking-tight text-pretty sm:text-5xl"
            >
              {copy.heroTitle}
            </Typography>
            <Typography
              variant="p"
              className="text-muted-foreground mt-6 text-lg/8"
            >
              {copy.heroDescription}
            </Typography>

            <dl className="text-muted-foreground mt-10 flex flex-col gap-4 text-base/7">
              <div className="flex gap-x-4">
                <dt className="flex-none">
                  <span className="sr-only">{copy.srAddress}</span>
                  <Building2
                    aria-hidden="true"
                    className="text-muted-foreground size-6"
                  />
                </dt>
                <dd>{SiteConfig.company.address}</dd>
              </div>
              <div className="flex gap-x-4">
                <dt className="flex-none">
                  <span className="sr-only">{copy.srEmail}</span>
                  <Mail
                    aria-hidden="true"
                    className="text-muted-foreground size-6"
                  />
                </dt>
                <dd>
                  <a
                    href={`mailto:${SiteConfig.support.email}`}
                    className="hover:text-foreground transition-colors"
                  >
                    {SiteConfig.support.email}
                  </a>
                </dd>
              </div>
              <div className="flex gap-x-4">
                <dt className="flex-none">
                  <span className="sr-only">{copy.srHours}</span>
                  <Clock
                    aria-hidden="true"
                    className="text-muted-foreground size-6"
                  />
                </dt>
                <dd>
                  {copy.hours}
                  <br />
                  <span className="text-muted-foreground/70">
                    {copy.timezone}
                  </span>
                </dd>
              </div>
              <div className="flex gap-x-4">
                <dt className="flex-none">
                  <span className="sr-only">{copy.srResponse}</span>
                  <MessageSquare
                    aria-hidden="true"
                    className="text-muted-foreground size-6"
                  />
                </dt>
                <dd>{copy.responseDelay}</dd>
              </div>
            </dl>

            {/* FAQ Section */}
            <div className="mt-12">
              <Typography
                variant="h2"
                className="text-foreground mb-4 text-xl font-semibold"
              >
                {copy.faqTitle}
              </Typography>
              <div className="space-y-4">
                {copy.faqs.map((faq) => (
                  <div key={faq.question}>
                    <Typography
                      variant="p"
                      className="text-foreground font-medium"
                    >
                      {faq.question}
                    </Typography>
                    <Typography
                      variant="p"
                      className="text-muted-foreground mt-1 text-sm"
                    >
                      {faq.answer}
                    </Typography>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Form */}
        <form
          action={async (formData) => {
            "use server";

            const copy = await getCopy();

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
              await serverToast(copy.form.validationError, "error");
              return;
            }

            await contactSupportAction(result.data);

            await serverToast(copy.form.success, "success");
          }}
          className="flex w-full items-center justify-start px-6 pt-24 pb-24 sm:pt-32 lg:px-12 lg:pt-24"
        >
          <div className="max-w-xl lg:mr-0 lg:max-w-lg">
            <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
              <div>
                <Label
                  htmlFor="first-name"
                  className="text-foreground block text-sm font-semibold"
                >
                  {copy.form.firstName}
                </Label>
                <div className="mt-2.5">
                  <Input
                    id="first-name"
                    name="first-name"
                    type="text"
                    autoComplete="given-name"
                    className="block w-full"
                    required
                  />
                </div>
              </div>
              <div>
                <Label
                  htmlFor="last-name"
                  className="text-foreground block text-sm font-semibold"
                >
                  {copy.form.lastName}
                </Label>
                <div className="mt-2.5">
                  <Input
                    id="last-name"
                    name="last-name"
                    type="text"
                    autoComplete="family-name"
                    className="block w-full"
                    required
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <Label
                  htmlFor="email"
                  className="text-foreground block text-sm font-semibold"
                >
                  {copy.form.email}
                </Label>
                <div className="mt-2.5">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    className="block w-full"
                    required
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <Label
                  htmlFor="subject"
                  className="text-foreground block text-sm font-semibold"
                >
                  {copy.form.subject}
                </Label>
                <div className="mt-2.5">
                  <Input
                    id="subject"
                    name="subject"
                    type="text"
                    className="block w-full"
                    placeholder={copy.form.subjectPlaceholder}
                    required
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <Label
                  htmlFor="message"
                  className="text-foreground block text-sm font-semibold"
                >
                  {copy.form.message}
                </Label>
                <div className="mt-2.5">
                  <Textarea
                    id="message"
                    name="message"
                    rows={4}
                    className="block w-full"
                    placeholder={copy.form.messagePlaceholder}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="mt-8 flex justify-end">
              <Button
                type="submit"
                className="rounded-md px-3.5 py-2.5 text-center text-sm font-semibold"
              >
                {copy.form.submit}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
