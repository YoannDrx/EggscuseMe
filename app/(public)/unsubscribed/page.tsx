import { NeoCard, NeoCardContent } from "@/components/neo";
import { Eggy } from "@/features/mascot";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

export default function UnsubscribedPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center p-4">
      <NeoCard className="max-w-md">
        <NeoCardContent className="flex flex-col items-center gap-6 p-8 text-center">
          <Eggy mood="sleeping" size="lg" />

          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="size-6" />
            <span className="font-medium">Unsubscribed / Desabonne</span>
          </div>

          <div className="space-y-4">
            <p className="text-muted-foreground">
              Vous ne recevrez plus d&apos;emails de notification
              d&apos;EggscuseMe. Vous pouvez reactiver les notifications dans
              les parametres de votre compte.
            </p>
            <p className="text-muted-foreground text-sm">
              You will no longer receive notification emails from EggscuseMe.
              You can re-enable notifications in your account settings.
            </p>
          </div>

          <Link
            href="/fridge/settings/notifications"
            className="text-primary hover:underline"
          >
            Modifier mes preferences / Change my preferences
          </Link>
        </NeoCardContent>
      </NeoCard>
    </div>
  );
}
