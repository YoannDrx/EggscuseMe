"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { dialogManager } from "@/features/dialog-manager/dialog-manager";
import {
  createShareLinkAction,
  deactivateShareLinkAction,
  getFridgeMembersAction,
  getShareLinksAction,
  removeMemberAction,
} from "@/features/fridge/sharing.action";
import { Eggy } from "@/features/mascot";
import { EmailInvitationsList } from "@/features/fridge/components/email-invitations-list";
import { EmailInviteForm } from "@/features/fridge/components/email-invite-form";
import {
  ArrowLeft,
  Copy,
  Link2,
  Mail,
  MoreVertical,
  Share2,
  Trash2,
  UserMinus,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { useCurrentFridge } from "../../use-current-fridge";

type ShareLink = {
  id: string;
  code: string;
  expiresAt: Date;
  maxUses: number;
  usedCount: number;
  isActive: boolean;
};

type Member = {
  id: string;
  role: "OWNER" | "GUEST";
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  };
};

export default function SharingPage() {
  const fridgeState = useCurrentFridge();
  const [isPending, startTransition] = useTransition();
  const [shareLinks, setShareLinks] = useState<ShareLink[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const isOwner = fridgeState?.role === "OWNER";

  // Load data
  useEffect(() => {
    async function loadData() {
      const [linksResult, membersResult] = await Promise.all([
        getShareLinksAction(),
        getFridgeMembersAction(),
      ]);

      if (linksResult.data?.shareLinks) {
        setShareLinks(linksResult.data.shareLinks);
      }
      if (membersResult.data?.members) {
        setMembers(membersResult.data.members);
      }
      setIsLoading(false);
    }
    void loadData();
  }, []);

  const handleCreateLink = () => {
    startTransition(async () => {
      const result = await createShareLinkAction({
        maxUses: 5,
        expiresInDays: 7,
      });

      if (result.data?.shareLink) {
        const newLink = result.data.shareLink;
        setShareLinks((prev) => [newLink, ...prev]);

        const shareUrl = `${window.location.origin}/join/${newLink.code}`;
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Lien créé et copié dans le presse-papier !");
      } else {
        toast.error("Échec de la création du lien");
      }
    });
  };

  const handleCopyLink = async (code: string) => {
    const shareUrl = `${window.location.origin}/join/${code}`;
    await navigator.clipboard.writeText(shareUrl);
    toast.success("Lien copié !");
  };

  const handleDeactivateLink = (linkId: string) => {
    dialogManager.confirm({
      title: "Désactiver ce lien ?",
      description:
        "Ce lien ne pourra plus être utilisé pour rejoindre le frigo.",
      action: {
        label: "Désactiver",
        onClick: async () => {
          const result = await deactivateShareLinkAction({ linkId });
          if (result.data?.success) {
            setShareLinks((prev) =>
              prev.map((link) =>
                link.id === linkId ? { ...link, isActive: false } : link,
              ),
            );
            toast.success("Lien désactivé");
          } else {
            toast.error("Échec de la désactivation");
          }
        },
      },
    });
  };

  const handleRemoveMember = (memberId: string, memberName: string) => {
    dialogManager.confirm({
      title: "Retirer ce membre ?",
      description: `${memberName} n'aura plus accès à votre frigo.`,
      action: {
        label: "Retirer",
        variant: "destructive",
        onClick: async () => {
          const result = await removeMemberAction({ memberId });
          if (result.data?.success) {
            setMembers((prev) => prev.filter((m) => m.id !== memberId));
            toast.success("Membre retiré");
          } else {
            toast.error("Échec du retrait");
          }
        },
      },
    });
  };

  if (!fridgeState) {
    return null;
  }

  const guests = members.filter((m) => m.role === "GUEST");
  const owner = members.find((m) => m.role === "OWNER");
  const activeLinks = shareLinks.filter((l) => l.isActive);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/fridge/settings">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="size-5" />
          </Button>
        </Link>
        <Eggy mood="happy" size="lg" />
        <div>
          <h1 className="font-heading text-2xl font-bold">Partage</h1>
          <p className="text-muted-foreground">
            {isOwner
              ? "Invitez des personnes à consulter votre frigo"
              : "Personnes ayant accès à ce frigo"}
          </p>
        </div>
      </div>

      {/* Share Links (Owner only) */}
      {isOwner && (
        <Card variant="sunny">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="font-heading flex items-center gap-2">
                <Link2 className="size-5" />
                Liens de partage
              </CardTitle>
              <CardDescription>
                Créez des liens pour inviter des personnes
              </CardDescription>
            </div>
            <Button
              variant="neubrutalism"
              onClick={handleCreateLink}
              disabled={isPending}
            >
              <Share2 className="mr-2 size-4" />
              {isPending ? "Création..." : "Créer un lien"}
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="bg-muted h-16 animate-pulse rounded-lg"
                  />
                ))}
              </div>
            ) : activeLinks.length === 0 ? (
              <p className="text-muted-foreground py-4 text-center text-sm">
                Aucun lien actif. Créez-en un pour inviter des personnes !
              </p>
            ) : (
              <div className="space-y-3">
                {activeLinks.map((link) => (
                  <div
                    key={link.id}
                    className="bg-muted/50 flex items-center justify-between rounded-lg p-3"
                  >
                    <div>
                      <code className="font-mono text-sm">
                        /join/{link.code}
                      </code>
                      <div className="text-muted-foreground mt-1 flex gap-2 text-xs">
                        <span>
                          {link.usedCount}/{link.maxUses} utilisations
                        </span>
                        <span>•</span>
                        <span>
                          Expire le{" "}
                          {new Date(link.expiresAt).toLocaleDateString("fr-FR")}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={async () => handleCopyLink(link.code)}
                      >
                        <Copy className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeactivateLink(link.id)}
                      >
                        <Trash2 className="text-destructive size-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Email Invitations (Owner only) */}
      {isOwner && (
        <Card variant="sunny">
          <CardHeader>
            <CardTitle className="font-heading flex items-center gap-2">
              <Mail className="size-5" />
              Inviter par email
            </CardTitle>
            <CardDescription>
              Envoyez une invitation directement par email
            </CardDescription>
          </CardHeader>
          <CardContent>
            <EmailInviteForm />
            <EmailInvitationsList />
          </CardContent>
        </Card>
      )}

      {/* Members */}
      <Card variant="sunny">
        <CardHeader>
          <CardTitle className="font-heading flex items-center gap-2">
            <Users className="size-5" />
            Membres ({members.length})
          </CardTitle>
          <CardDescription>Personnes ayant accès à ce frigo</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-muted h-14 animate-pulse rounded-lg"
                />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {/* Owner */}
              {owner && (
                <div className="flex items-center gap-3 rounded-lg p-2">
                  <Avatar>
                    <AvatarFallback>
                      {owner.user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                    {owner.user.image && <AvatarImage src={owner.user.image} />}
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">{owner.user.name}</p>
                    <p className="text-muted-foreground text-sm">
                      {owner.user.email}
                    </p>
                  </div>
                  <Badge variant="secondary">Propriétaire</Badge>
                </div>
              )}

              {/* Guests */}
              {guests.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-3 rounded-lg p-2"
                >
                  <Avatar>
                    <AvatarFallback>
                      {member.user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                    {member.user.image && (
                      <AvatarImage src={member.user.image} />
                    )}
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">{member.user.name}</p>
                    <p className="text-muted-foreground text-sm">
                      {member.user.email}
                    </p>
                  </div>
                  <Badge variant="outline">Invité</Badge>
                  {isOwner && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() =>
                            handleRemoveMember(member.id, member.user.name)
                          }
                        >
                          <UserMinus className="mr-2 size-4" />
                          Retirer du frigo
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              ))}

              {guests.length === 0 && (
                <p className="text-muted-foreground py-4 text-center text-sm">
                  Aucun invité pour le moment
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
