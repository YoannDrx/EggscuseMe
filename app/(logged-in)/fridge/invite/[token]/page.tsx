import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  acceptEmailInvitationAction,
  getEmailInvitationByTokenAction,
} from "@/features/fridge/email-invitation.action";
import { Eggy } from "@/features/mascot";
import { AlertTriangle, Check, RefrigeratorIcon, Users } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

type InvitePageProps = {
  params: Promise<{ token: string }>;
};

export default async function InvitePage({ params }: InvitePageProps) {
  const { token } = await params;

  // Get invitation info
  const result = await getEmailInvitationByTokenAction({ token });

  // Handle errors or invalid invitation
  if (result.data?.error || !result.data?.invitation) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-4">
        <Card variant="sunny" className="max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <Eggy mood="sad" size="lg" />
            </div>
            <CardTitle className="font-heading text-xl">
              Invitation invalide
            </CardTitle>
            <CardDescription>
              {result.data?.error ??
                "Cette invitation n'existe pas ou a expire. Demandez au proprietaire du frigo de vous envoyer une nouvelle invitation."}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Link href="/fridge">
              <Button variant="neubrutalism">Retour a mon frigo</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const invitation = result.data.invitation;

  // Show join confirmation
  return (
    <div className="flex min-h-[60vh] items-center justify-center p-4">
      <Card variant="sunny" className="max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <Eggy mood="happy" size="lg" />
          </div>
          <CardTitle className="font-heading text-xl">
            Rejoindre un frigo
          </CardTitle>
          <CardDescription>
            {invitation.inviterName} vous invite a rejoindre son frigo
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Fridge Info */}
          <div className="bg-muted/50 flex items-center gap-4 rounded-xl p-4">
            <div className="bg-primary/10 flex size-12 items-center justify-center rounded-full">
              <RefrigeratorIcon className="text-primary size-6" />
            </div>
            <div>
              <p className="font-heading font-semibold">
                {invitation.fridgeName}
              </p>
              <p className="text-muted-foreground text-sm">
                par {invitation.inviterName}
              </p>
            </div>
          </div>

          {/* What you'll get */}
          <div className="space-y-3">
            <p className="text-sm font-medium">
              En tant qu&apos;invite, vous pourrez :
            </p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm">
                <Check className="text-fresh-extra size-4" />
                Voir les boites d&apos;oeufs et leur fraicheur
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="text-fresh-extra size-4" />
                Consommer des oeufs et enregistrer vos repas
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="text-fresh-extra size-4" />
                Acceder aux recettes et suggestions
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="text-fresh-extra size-4" />
                Utiliser le minuteur intelligent
              </li>
            </ul>
          </div>

          {/* Expiration info */}
          <div className="bg-muted/30 flex items-center justify-center gap-2 rounded-lg p-3">
            <AlertTriangle className="text-muted-foreground size-4" />
            <p className="text-muted-foreground text-xs">
              Expire le{" "}
              {new Date(invitation.expiresAt).toLocaleDateString("fr-FR")}
            </p>
          </div>

          {/* Join Form */}
          <form
            action={async () => {
              "use server";
              const joinResult = await acceptEmailInvitationAction({ token });
              if (joinResult.data?.success) {
                redirect("/fridge");
              }
            }}
          >
            <Button type="submit" variant="neubrutalism" className="w-full">
              <Users className="mr-2 size-4" />
              Rejoindre le frigo
            </Button>
          </form>

          <p className="text-muted-foreground text-center text-xs">
            Vous pourrez quitter ce frigo a tout moment depuis les parametres.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
