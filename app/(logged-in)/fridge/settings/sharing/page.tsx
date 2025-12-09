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
import { QRCodeDisplay } from "@/features/sharing/qr-code-display";
import { SiteConfig } from "@/site-config";
import {
  ArrowLeft,
  Copy,
  Link2,
  Mail,
  MoreVertical,
  QrCode,
  Share,
  Share2,
  Trash2,
  UserMinus,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { useCurrentFridge } from "../../use-current-fridge";
import { useLocale } from "next-intl";

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
  const locale = useLocale();
  const copy =
    locale === "fr"
      ? {
          headerTitle: "Partage",
          headerSubtitleOwner: "Invitez des personnes à consulter votre frigo",
          headerSubtitleGuest: "Personnes ayant accès à ce frigo",
          shareLinksTitle: "Liens de partage",
          shareLinksDesc: "Créez des liens pour inviter des personnes",
          createLink: "Créer un lien",
          creatingLink: "Création...",
          noActiveLinks:
            "Aucun lien actif. Créez-en un pour inviter des personnes !",
          toastCreate: "Lien créé et copié dans le presse-papier !",
          toastCreateError: "Échec de la création du lien",
          toastCopy: "Lien copié !",
          toastShareError: "Le partage n'est pas disponible sur cet appareil",
          shareTitle: "Rejoignez mon frigo sur EggscuseMe",
          shareText: "Je vous invite à partager mon suivi d'œufs !",
          shareCta: "Partager",
          deactivateTitle: "Désactiver ce lien ?",
          deactivateDesc:
            "Ce lien ne pourra plus être utilisé pour rejoindre le frigo.",
          deactivateAction: "Désactiver",
          toastDeactivate: "Lien désactivé",
          toastDeactivateError: "Échec de la désactivation",
          removeTitle: "Retirer ce membre ?",
          removeDesc: (name: string) =>
            `${name} n'aura plus accès à votre frigo.`,
          removeAction: "Retirer",
          toastRemove: "Membre retiré",
          toastRemoveError: "Échec du retrait",
          emailTitle: "Inviter par email",
          emailDesc: "Envoyez une invitation directement par email",
          membersTitle: (count: number) => `Membres (${count})`,
          membersDesc: "Personnes ayant accès à ce frigo",
          ownerBadge: "Propriétaire",
          guestBadge: "Invité",
          noGuests: "Aucun invité pour le moment",
          usesLabel: "utilisations",
          expiresLabel: "Expire le",
        }
      : {
          headerTitle: "Sharing",
          headerSubtitleOwner: "Invite people to view your fridge",
          headerSubtitleGuest: "People with access to this fridge",
          shareLinksTitle: "Share links",
          shareLinksDesc: "Create links to invite people",
          createLink: "Create link",
          creatingLink: "Creating...",
          noActiveLinks: "No active links. Create one to invite people!",
          toastCreate: "Link created and copied!",
          toastCreateError: "Failed to create link",
          toastCopy: "Link copied!",
          toastShareError: "Sharing is not available on this device",
          shareTitle: "Join my fridge on EggscuseMe",
          shareText: "I invite you to share my egg tracking!",
          shareCta: "Share",
          deactivateTitle: "Disable this link?",
          deactivateDesc:
            "This link will no longer allow access to the fridge.",
          deactivateAction: "Disable",
          toastDeactivate: "Link disabled",
          toastDeactivateError: "Failed to disable link",
          removeTitle: "Remove this member?",
          removeDesc: (name: string) =>
            `${name} will lose access to your fridge.`,
          removeAction: "Remove",
          toastRemove: "Member removed",
          toastRemoveError: "Failed to remove member",
          emailTitle: "Invite by email",
          emailDesc: "Send an invitation directly by email",
          membersTitle: (count: number) => `Members (${count})`,
          membersDesc: "People with access to this fridge",
          ownerBadge: "Owner",
          guestBadge: "Guest",
          noGuests: "No guests yet",
          usesLabel: "uses",
          expiresLabel: "Expires on",
        };

  const fridgeState = useCurrentFridge();
  const [isPending, startTransition] = useTransition();
  const [shareLinks, setShareLinks] = useState<ShareLink[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showQrFor, setShowQrFor] = useState<string | null>(null);

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
        toast.success(copy.toastCreate);
      } else {
        toast.error(copy.toastCreateError);
      }
    });
  };

  const getShareUrl = (code: string) =>
    `${window.location.origin}/join/${code}`;

  const handleCopyLink = async (code: string) => {
    await navigator.clipboard.writeText(getShareUrl(code));
    toast.success(copy.toastCopy);
  };

  const handleNativeShare = async (code: string) => {
    const shareUrl = getShareUrl(code);
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share({
          title: copy.shareTitle,
          text: copy.shareText,
          url: shareUrl,
        });
      } catch (err) {
        // User cancelled or error - fallback to copy
        if ((err as Error).name !== "AbortError") {
          await handleCopyLink(code);
        }
      }
    } else {
      // Fallback for devices without native share
      await handleCopyLink(code);
    }
  };

  const canNativeShare =
    typeof navigator !== "undefined" && "share" in navigator;

  const handleDeactivateLink = (linkId: string) => {
    dialogManager.confirm({
      title: copy.deactivateTitle,
      description: copy.deactivateDesc,
      action: {
        label: copy.deactivateAction,
        onClick: async () => {
          const result = await deactivateShareLinkAction({ linkId });
          if (result.data?.success) {
            setShareLinks((prev) =>
              prev.map((link) =>
                link.id === linkId ? { ...link, isActive: false } : link,
              ),
            );
            toast.success(copy.toastDeactivate);
          } else {
            toast.error(copy.toastDeactivateError);
          }
        },
      },
    });
  };

  const handleRemoveMember = (memberId: string, memberName: string) => {
    dialogManager.confirm({
      title: copy.removeTitle,
      description: copy.removeDesc(memberName),
      action: {
        label: copy.removeAction,
        variant: "destructive",
        onClick: async () => {
          const result = await removeMemberAction({ memberId });
          if (result.data?.success) {
            setMembers((prev) => prev.filter((m) => m.id !== memberId));
            toast.success(copy.toastRemove);
          } else {
            toast.error(copy.toastRemoveError);
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
          <h1 className="font-heading text-2xl font-bold">
            {copy.headerTitle}
          </h1>
          <p className="text-muted-foreground">
            {isOwner ? copy.headerSubtitleOwner : copy.headerSubtitleGuest}
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
                {copy.shareLinksTitle}
              </CardTitle>
              <CardDescription>{copy.shareLinksDesc}</CardDescription>
            </div>
            <Button
              variant="neubrutalism"
              onClick={handleCreateLink}
              disabled={isPending}
            >
              <Share2 className="mr-2 size-4" />
              {isPending ? copy.creatingLink : copy.createLink}
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
                {copy.noActiveLinks}
              </p>
            ) : (
              <div className="space-y-3">
                {activeLinks.map((link) => (
                  <div
                    key={link.id}
                    className="bg-muted/50 space-y-3 rounded-lg p-3"
                  >
                    {/* QR Code display (toggle) */}
                    {showQrFor === link.id ? (
                      <div className="flex flex-col items-center gap-3 py-2">
                        <QRCodeDisplay
                          value={getShareUrl(link.code)}
                          size={160}
                        />
                        <p className="text-muted-foreground text-xs">
                          {locale === "fr"
                            ? "Scannez pour rejoindre"
                            : "Scan to join"}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowQrFor(null)}
                        >
                          {locale === "fr" ? "Masquer le QR" : "Hide QR"}
                        </Button>
                      </div>
                    ) : (
                      <>
                        {/* URL display */}
                        <div className="flex items-center gap-2">
                          <Link2 className="text-muted-foreground size-4 shrink-0" />
                          <code className="bg-background flex-1 truncate rounded border px-2 py-1 font-mono text-sm">
                            {SiteConfig.domain}/join/{link.code}
                          </code>
                        </div>

                        {/* Meta info */}
                        <div className="text-muted-foreground flex flex-wrap gap-x-3 gap-y-1 text-xs">
                          <span>
                            {link.usedCount}/{link.maxUses} {copy.usesLabel}
                          </span>
                          <span>•</span>
                          <span>
                            {copy.expiresLabel}{" "}
                            {new Date(link.expiresAt).toLocaleDateString(
                              locale === "fr" ? "fr-FR" : "en-US",
                            )}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowQrFor(link.id)}
                          >
                            <QrCode className="mr-2 size-4" />
                            QR Code
                          </Button>
                          {canNativeShare && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={async () => handleNativeShare(link.code)}
                            >
                              <Share className="mr-2 size-4" />
                              {copy.shareCta}
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={async () => handleCopyLink(link.code)}
                          >
                            <Copy className="mr-2 size-4" />
                            {copy.toastCopy.replace("!", "")}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeactivateLink(link.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="mr-2 size-4" />
                            {copy.deactivateAction}
                          </Button>
                        </div>
                      </>
                    )}
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
              {copy.emailTitle}
            </CardTitle>
            <CardDescription>{copy.emailDesc}</CardDescription>
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
            {copy.membersTitle(members.length)}
          </CardTitle>
          <CardDescription>{copy.membersDesc}</CardDescription>
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
                  <Badge variant="secondary">{copy.ownerBadge}</Badge>
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
                  <Badge variant="outline">{copy.guestBadge}</Badge>
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
                          {copy.removeAction}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              ))}

              {guests.length === 0 && (
                <p className="text-muted-foreground py-4 text-center text-sm">
                  {copy.noGuests}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
