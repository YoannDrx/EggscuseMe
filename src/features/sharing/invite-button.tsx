"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Eggy } from "@/features/mascot";
import {
  Check,
  Copy,
  Link as LinkIcon,
  Loader2,
  QrCode,
  Share2,
  Users,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { createInviteAction } from "./invite.action";
import { QRCodeDisplay } from "./qr-code-display";

type InviteButtonProps = {
  className?: string;
};

export function InviteButton({ className }: InviteButtonProps) {
  const t = useTranslations("sharing");
  const [isPending, startTransition] = useTransition();
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const handleCreateInvite = () => {
    startTransition(async () => {
      const result = await createInviteAction({
        maxUses: 5,
        expiresInDays: 7,
      });

      if (result.data?.invite) {
        const code = result.data.invite.code;
        // Use /join/ route (unified sharing route)
        const link = `${window.location.origin}/join/${code}`;
        setInviteLink(link);
      } else {
        toast.error(t("createError"));
      }
    });
  };

  const handleCopy = async () => {
    if (!inviteLink) return;

    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      toast.success(t("linkCopied"));
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error(t("copyError"));
    }
  };

  const handleShare = async () => {
    if (!inviteLink) return;

    if (typeof navigator.share === "function") {
      try {
        await navigator.share({
          title: t("shareTitle"),
          text: t("shareText"),
          url: inviteLink,
        });
      } catch {
        // User cancelled or share failed
      }
    } else {
      await handleCopy();
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="neubrutalism-outline" className={className}>
          <Users className="mr-2 size-4" />
          {t("invite")}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Eggy mood="happy" size="sm" />
            <div>
              <h4 className="font-heading font-semibold">{t("inviteTitle")}</h4>
              <p className="text-muted-foreground text-xs">
                {t("inviteDescription")}
              </p>
            </div>
          </div>

          {!inviteLink ? (
            <Button
              variant="neubrutalism"
              className="w-full"
              onClick={handleCreateInvite}
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  {t("creating")}
                </>
              ) : (
                <>
                  <LinkIcon className="mr-2 size-4" />
                  {t("createLink")}
                </>
              )}
            </Button>
          ) : (
            <div className="space-y-3">
              {showQR ? (
                <div className="flex flex-col items-center gap-2">
                  <QRCodeDisplay value={inviteLink} size={180} />
                  <p className="text-muted-foreground text-center text-xs">
                    {t("scanQr")}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowQR(false)}
                  >
                    {t("showLink")}
                  </Button>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label className="text-xs">{t("inviteLink")}</Label>
                    <div className="flex gap-2">
                      <Input
                        value={inviteLink}
                        readOnly
                        className="h-9 text-xs"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="shrink-0"
                        onClick={handleCopy}
                      >
                        {copied ? (
                          <Check className="size-4" />
                        ) : (
                          <Copy className="size-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => setShowQR(true)}
                    >
                      <QrCode className="mr-2 size-4" />
                      QR Code
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={handleShare}
                    >
                      <Share2 className="mr-2 size-4" />
                      {t("share")}
                    </Button>
                  </div>
                </>
              )}

              <p className="text-muted-foreground text-center text-xs">
                {t("validity")}
              </p>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
