"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { acceptInviteAction } from "@/features/sharing";
import { Loader2, LogIn } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

type AcceptInviteButtonProps = {
  code: string;
  organizationSlug: string;
};

export function AcceptInviteButton({
  code,
  organizationSlug,
}: AcceptInviteButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleAccept = () => {
    startTransition(async () => {
      const result = await acceptInviteAction({ code });

      if (result.data?.success) {
        if (result.data.alreadyMember) {
          toast.info("Vous êtes déjà membre de ce frigo !");
        } else {
          toast.success("Bienvenue dans le frigo !");
        }
        router.push(`/orgs/${organizationSlug}`);
      } else {
        toast.error("Impossible de rejoindre le frigo");
      }
    });
  };

  return (
    <div className="flex flex-col gap-3">
      <Button
        variant="neubrutalism"
        size="lg"
        className="w-full"
        onClick={handleAccept}
        disabled={isPending}
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 size-5 animate-spin" />
            Connexion...
          </>
        ) : (
          <>
            <LogIn className="mr-2 size-5" />
            Rejoindre le frigo
          </>
        )}
      </Button>
      <Link
        href="/"
        className={buttonVariants({ variant: "ghost", size: "sm" })}
      >
        Non merci
      </Link>
    </div>
  );
}
