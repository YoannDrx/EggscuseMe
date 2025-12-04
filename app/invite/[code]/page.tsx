import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getInviteByCode } from "@/features/sharing";
import { Eggy } from "@/features/mascot";
import { AlertCircle, CheckCircle2, Users } from "lucide-react";
import Link from "next/link";
import { AcceptInviteButton } from "./accept-invite-button";

type InvitePageProps = {
  params: Promise<{ code: string }>;
};

export default async function InvitePage({ params }: InvitePageProps) {
  const { code } = await params;
  const invite = await getInviteByCode(code);

  // Error state
  if (!invite) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center p-4">
        <Card variant="sunny" className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto mb-2">
              <Eggy mood="sad" size="lg" />
            </div>
            <CardTitle className="font-heading text-xl">
              Invitation invalide
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-destructive flex items-center justify-center gap-2">
              <AlertCircle className="size-5" />
              <p>Cette invitation n'existe pas ou a expiré.</p>
            </div>
            <Link
              href="/"
              className={buttonVariants({ variant: "neubrutalism" })}
            >
              Retour à l'accueil
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-4">
      <Card variant="sunny" className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-2">
            <Eggy mood="happy" size="lg" />
          </div>
          <CardTitle className="font-heading text-xl">
            Vous êtes invité !
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Fridge info */}
          <div className="bg-muted/50 flex flex-col items-center gap-3 rounded-xl p-4">
            <div className="bg-primary/10 flex size-16 items-center justify-center rounded-full">
              <Users className="text-primary size-8" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-semibold">
                {invite.fridge.name}
              </h3>
              <p className="text-muted-foreground text-sm">
                {invite.fridge.owner.name
                  ? `Frigo de ${invite.fridge.owner.name}`
                  : "Rejoignez ce frigo pour partager le suivi des œufs"}
              </p>
            </div>
          </div>

          {/* Features preview */}
          <ul className="space-y-2 text-left text-sm">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="text-fresh-extra size-4" />
              Voir toutes les boîtes d'œufs du frigo
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="text-fresh-extra size-4" />
              Ajouter et consommer des œufs
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="text-fresh-extra size-4" />
              Recevoir les alertes d'expiration
            </li>
          </ul>

          {/* Action buttons */}
          <AcceptInviteButton code={code} />

          <p className="text-muted-foreground text-xs">
            En rejoignant, vous acceptez de partager l'accès au suivi des œufs
            avec les autres membres.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
