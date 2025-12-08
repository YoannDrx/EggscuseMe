"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { dialogManager } from "@/features/dialog-manager/dialog-manager";
import {
  cancelEmailInvitationAction,
  getEmailInvitationsAction,
  resendEmailInvitationAction,
} from "@/features/fridge/email-invitation.action";
import type { InvitationStatus } from "@/generated/prisma";
import {
  Check,
  Clock,
  Mail,
  MoreVertical,
  RefreshCw,
  Trash2,
  XCircle,
} from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

type EmailInvitation = {
  id: string;
  email: string;
  status: InvitationStatus;
  expiresAt: Date;
  lastSentAt: Date;
  createdAt: Date;
  acceptedBy?: {
    name: string;
    email: string;
    image: string | null;
  } | null;
};

const statusConfig = {
  PENDING: {
    label: "En attente",
    variant: "secondary" as const,
    icon: Clock,
  },
  ACCEPTED: {
    label: "Acceptee",
    variant: "default" as const,
    icon: Check,
  },
  EXPIRED: {
    label: "Expiree",
    variant: "outline" as const,
    icon: Clock,
  },
  CANCELLED: {
    label: "Annulee",
    variant: "destructive" as const,
    icon: XCircle,
  },
};

export function EmailInvitationsList() {
  const [invitations, setInvitations] = useState<EmailInvitation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    async function loadInvitations() {
      const result = await getEmailInvitationsAction();
      if (result.data?.invitations) {
        setInvitations(result.data.invitations);
      }
      setIsLoading(false);
    }
    void loadInvitations();
  }, []);

  const handleResend = (id: string) => {
    startTransition(async () => {
      const result = await resendEmailInvitationAction({ invitationId: id });
      if (result.data?.success) {
        toast.success("Email renvoye !");
        // Reload the list
        const listResult = await getEmailInvitationsAction();
        if (listResult.data?.invitations) {
          setInvitations(listResult.data.invitations);
        }
      } else if (result.serverError) {
        toast.error(result.serverError);
      }
    });
  };

  const handleCancel = (id: string, email: string) => {
    dialogManager.confirm({
      title: "Annuler cette invitation ?",
      description: `L'invitation pour ${email} sera annulee et ne pourra plus etre utilisee.`,
      action: {
        label: "Annuler l'invitation",
        variant: "destructive",
        onClick: async () => {
          const result = await cancelEmailInvitationAction({
            invitationId: id,
          });
          if (result.data?.success) {
            setInvitations((prev) =>
              prev.map((inv) =>
                inv.id === id ? { ...inv, status: "CANCELLED" } : inv,
              ),
            );
            toast.success("Invitation annulee");
          } else {
            toast.error("Echec de l'annulation");
          }
        },
      },
    });
  };

  if (isLoading) {
    return (
      <div className="mt-4 space-y-3">
        {[1, 2].map((i) => (
          <div key={i} className="bg-muted h-16 animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  const pendingInvitations = invitations.filter((i) => i.status === "PENDING");
  const otherInvitations = invitations.filter((i) => i.status !== "PENDING");

  if (invitations.length === 0) {
    return (
      <p className="text-muted-foreground mt-4 py-4 text-center text-sm">
        Aucune invitation envoyee. Invitez quelqu&apos;un par email !
      </p>
    );
  }

  return (
    <div className="mt-4 space-y-4">
      {/* Pending invitations */}
      {pendingInvitations.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">
            En attente ({pendingInvitations.length})
          </h4>
          {pendingInvitations.map((invitation) => (
            <InvitationRow
              key={invitation.id}
              invitation={invitation}
              onResend={() => handleResend(invitation.id)}
              onCancel={() => handleCancel(invitation.id, invitation.email)}
              isPending={isPending}
            />
          ))}
        </div>
      )}

      {/* Other invitations */}
      {otherInvitations.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-muted-foreground text-sm">
            Historique ({otherInvitations.length})
          </h4>
          {otherInvitations.map((invitation) => (
            <InvitationRow key={invitation.id} invitation={invitation} />
          ))}
        </div>
      )}
    </div>
  );
}

function InvitationRow({
  invitation,
  onResend,
  onCancel,
  isPending,
}: {
  invitation: EmailInvitation;
  onResend?: () => void;
  onCancel?: () => void;
  isPending?: boolean;
}) {
  const config = statusConfig[invitation.status];
  const StatusIcon = config.icon;

  return (
    <div className="bg-muted/50 flex items-center justify-between rounded-lg p-3">
      <div className="flex items-center gap-3">
        <div className="bg-muted flex size-10 items-center justify-center rounded-full">
          <Mail className="text-muted-foreground size-5" />
        </div>
        <div>
          <p className="font-medium">{invitation.email}</p>
          <div className="text-muted-foreground flex items-center gap-2 text-xs">
            <Badge variant={config.variant} className="text-xs">
              <StatusIcon className="mr-1 size-3" />
              {config.label}
            </Badge>
            {invitation.status === "PENDING" && (
              <span>
                Expire le{" "}
                {new Date(invitation.expiresAt).toLocaleDateString("fr-FR")}
              </span>
            )}
            {invitation.status === "ACCEPTED" && invitation.acceptedBy && (
              <span>par {invitation.acceptedBy.name}</span>
            )}
          </div>
        </div>
      </div>

      {invitation.status === "PENDING" && onResend && onCancel && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" disabled={isPending}>
              <MoreVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={onResend}>
              <RefreshCw className="mr-2 size-4" />
              Renvoyer l&apos;email
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive" onClick={onCancel}>
              <Trash2 className="mr-2 size-4" />
              Annuler l&apos;invitation
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
