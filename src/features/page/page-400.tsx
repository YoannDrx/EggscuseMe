import { ErrorIllustration } from "@/components/eggscuseme/illustrations";
import { ContactSupportDialog } from "@/features/contact/support/contact-support-dialog";
import Link from "next/link";
import type { PropsWithChildren } from "react";
import { Typography } from "../../components/nowts/typography";
import { buttonVariants } from "../../components/ui/button";

type Page400Props = PropsWithChildren<{
  title?: string;
}>;

export function Page400(props: Page400Props) {
  return (
    <main className="flex flex-col items-center gap-8">
      <ErrorIllustration type="500" size="lg" />
      <div className="max-w-lg space-y-3 text-center">
        <Typography variant="h1">{props.title ?? "Erreur"}</Typography>
        {props.children ?? (
          <Typography>
            It seems we're experiencing some technical difficulties. Not to
            worry, our team is working on it. In the meantime, try refreshing
            the page or visiting us a bit later.
          </Typography>
        )}
      </div>
      <div className="flex items-center gap-4">
        <Link href="/" className={buttonVariants({ variant: "invert" })}>
          Go back home
        </Link>
        <ContactSupportDialog />
      </div>
    </main>
  );
}
