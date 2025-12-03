import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  acceptShareLinkAction,
  getShareLinkByCodeAction,
} from "@/features/fridge/sharing.action";
import { Eggy } from "@/features/mascot";
import { AlertTriangle, Check, RefrigeratorIcon, Users } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

type JoinPageProps = {
  params: Promise<{ code: string }>;
};

export default async function JoinPage({ params }: JoinPageProps) {
  const { code } = await params;

  // Get share link info
  const result = await getShareLinkByCodeAction({ code });

  // Handle errors or invalid link
  if (result.data?.error || !result.data?.shareLink) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-4">
        <Card variant="sunny" className="max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <Eggy mood="sad" size="lg" />
            </div>
            <CardTitle className="font-heading text-xl">
              Lien invalide ou expiré
            </CardTitle>
            <CardDescription>
              {result.data?.error ??
                "Ce lien d'invitation n'existe pas ou a expiré. Demandez au propriétaire du frigo de vous envoyer un nouveau lien."}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Link href="/fridge">
              <Button variant="neubrutalism">Retour à mon frigo</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const shareLink = result.data.shareLink;

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
            {shareLink.ownerName} vous invite à rejoindre son frigo
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
                {shareLink.fridgeName}
              </p>
              <p className="text-muted-foreground text-sm">
                par {shareLink.ownerName}
              </p>
            </div>
          </div>

          {/* What you'll get */}
          <div className="space-y-3">
            <p className="text-sm font-medium">
              En tant qu'invité, vous pourrez :
            </p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm">
                <Check className="text-fresh-extra size-4" />
                Voir les boîtes d'œufs et leur fraîcheur
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="text-fresh-extra size-4" />
                Consommer des œufs et enregistrer vos repas
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="text-fresh-extra size-4" />
                Accéder aux recettes et suggestions
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="text-fresh-extra size-4" />
                Utiliser le minuteur intelligent
              </li>
            </ul>
          </div>

          {/* Link info */}
          <div className="bg-muted/30 flex items-center justify-center gap-2 rounded-lg p-3">
            <AlertTriangle className="text-muted-foreground size-4" />
            <p className="text-muted-foreground text-xs">
              {shareLink.remainingUses} utilisation
              {shareLink.remainingUses > 1 ? "s" : ""} restante
              {shareLink.remainingUses > 1 ? "s" : ""} • Expire le{" "}
              {new Date(shareLink.expiresAt).toLocaleDateString("fr-FR")}
            </p>
          </div>

          {/* Join Form */}
          <form
            action={async () => {
              "use server";
              const joinResult = await acceptShareLinkAction({ code });
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
            Vous pourrez quitter ce frigo à tout moment depuis les paramètres.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
