import { ErrorIllustration } from "@/components/eggscuseme/illustrations";
import { ContactSupportDialog } from "@/features/contact/support/contact-support-dialog";
import Link from "next/link";
import { Typography } from "../../components/nowts/typography";
import { buttonVariants } from "../../components/ui/button";

export function Page404() {
  return (
    <main className="flex h-full flex-col items-center justify-center gap-8">
      <ErrorIllustration type="404" size="lg" />
      <div className="space-y-3 text-center">
        <Typography variant="h1">Page introuvable</Typography>
        <Typography>
          Désolé, nous n'avons pas trouvé la page que vous cherchez.
        </Typography>
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
