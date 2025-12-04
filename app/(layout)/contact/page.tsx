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

export const metadata: Metadata = {
  title: `Contact - ${SiteConfig.title}`,
  description:
    "Contactez l'équipe EggscuseMe. Nous sommes là pour répondre à vos questions sur le suivi de vos oeufs et la gestion de votre frigo.",
  keywords: ["contact", "support", "aide", "oeufs", "questions"],
  openGraph: {
    title: `Contact - ${SiteConfig.title}`,
    description:
      "Contactez l'équipe EggscuseMe pour toute question sur notre application de suivi d'oeufs.",
    url: `${SiteConfig.prodUrl}/contact`,
    type: "website",
  },
};

const faqs = [
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
];

export default function ContactPage() {
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
              Nous contacter
            </Typography>
            <Typography
              variant="p"
              className="text-muted-foreground mt-6 text-lg/8"
            >
              Une question sur EggscuseMe ? Besoin d'aide pour gérer votre frigo
              ou simplement envie de partager vos idées ? Nous sommes à votre
              écoute.
            </Typography>

            <dl className="text-muted-foreground mt-10 flex flex-col gap-4 text-base/7">
              <div className="flex gap-x-4">
                <dt className="flex-none">
                  <span className="sr-only">Adresse</span>
                  <Building2
                    aria-hidden="true"
                    className="text-muted-foreground size-6"
                  />
                </dt>
                <dd>{SiteConfig.company.address}</dd>
              </div>
              <div className="flex gap-x-4">
                <dt className="flex-none">
                  <span className="sr-only">Email</span>
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
                  <span className="sr-only">Horaires</span>
                  <Clock
                    aria-hidden="true"
                    className="text-muted-foreground size-6"
                  />
                </dt>
                <dd>
                  Lundi - Vendredi, 9h - 18h
                  <br />
                  <span className="text-muted-foreground/70">
                    Fuseau horaire : Paris (CET)
                  </span>
                </dd>
              </div>
              <div className="flex gap-x-4">
                <dt className="flex-none">
                  <span className="sr-only">Délai de réponse</span>
                  <MessageSquare
                    aria-hidden="true"
                    className="text-muted-foreground size-6"
                  />
                </dt>
                <dd>Réponse sous 24-48h ouvrées</dd>
              </div>
            </dl>

            {/* FAQ Section */}
            <div className="mt-12">
              <Typography
                variant="h2"
                className="text-foreground mb-4 text-xl font-semibold"
              >
                Questions fréquentes
              </Typography>
              <div className="space-y-4">
                {faqs.map((faq) => (
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
              await serverToast("Veuillez remplir tous les champs", "error");
              return;
            }

            await contactSupportAction(result.data);

            await serverToast("Votre message a bien été envoyé", "success");
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
                  Prénom
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
                  Nom
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
                  Email
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
                  Sujet
                </Label>
                <div className="mt-2.5">
                  <Input
                    id="subject"
                    name="subject"
                    type="text"
                    className="block w-full"
                    placeholder="Question sur le suivi des oeufs..."
                    required
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <Label
                  htmlFor="message"
                  className="text-foreground block text-sm font-semibold"
                >
                  Message
                </Label>
                <div className="mt-2.5">
                  <Textarea
                    id="message"
                    name="message"
                    rows={4}
                    className="block w-full"
                    placeholder="Décrivez votre question ou suggestion..."
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
                Envoyer le message
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
