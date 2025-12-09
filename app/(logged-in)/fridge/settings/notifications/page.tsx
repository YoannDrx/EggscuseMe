"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Eggy } from "@/features/mascot";
import {
  getNotificationPreferencesAction,
  updateNotificationPreferencesAction,
} from "@/features/notifications/notification.action";
import { Bell, BellOff, Loader2, Save } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export default function NotificationsSettingsPage() {
  const t = useTranslations("fridge.settings.notificationsPage");
  const [notifyEnabled, setNotifyEnabled] = useState(true);
  const [notifyDaysBefore, setNotifyDaysBefore] = useState(2);
  const [hasChanges, setHasChanges] = useState(false);

  const { execute: loadPrefs, isPending: isLoading } = useAction(
    getNotificationPreferencesAction,
    {
      onSuccess: (data) => {
        const prefs = data.data.preferences;
        setNotifyEnabled(prefs.notifyEnabled);
        setNotifyDaysBefore(prefs.notifyDaysBefore);
      },
    },
  );

  const { execute: savePrefs, isPending: isSaving } = useAction(
    updateNotificationPreferencesAction,
    {
      onSuccess: () => {
        toast.success(t("toastSuccess"));
        setHasChanges(false);
      },
      onError: () => {
        toast.error(t("toastError"));
      },
    },
  );

  useEffect(() => {
    loadPrefs();
  }, [loadPrefs]);

  const handleSave = () => {
    savePrefs({
      notifyEnabled,
      notifyDaysBefore,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="text-primary size-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Eggy mood={notifyEnabled ? "happy" : "sleeping"} size="lg" />
        <div>
          <h1 className="font-heading text-2xl font-bold">{t("title")}</h1>
          <p className="text-muted-foreground">{t("subtitle")}</p>
        </div>
      </div>

      {/* Main settings card */}
      <Card variant="sunny">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="size-5" />
            {t("title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Enable/Disable toggle */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="notify-enabled" className="text-base font-medium">
                {t("enable")}
              </Label>
              <p className="text-muted-foreground text-sm">
                {t("enableDescription")}
              </p>
            </div>
            <Switch
              id="notify-enabled"
              checked={notifyEnabled}
              onCheckedChange={(checked) => {
                setNotifyEnabled(checked);
                setHasChanges(true);
              }}
            />
          </div>

          {/* Days before select */}
          <div
            className={`space-y-4 ${!notifyEnabled ? "pointer-events-none opacity-50" : ""}`}
          >
            <div className="space-y-0.5">
              <Label className="text-base font-medium">{t("daysLabel")}</Label>
              <p className="text-muted-foreground text-sm">{t("daysDescription")}</p>
            </div>
            <Select
              value={notifyDaysBefore.toString()}
              onValueChange={(value: string) => {
                setNotifyDaysBefore(parseInt(value));
                setHasChanges(true);
              }}
              disabled={!notifyEnabled}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6, 7].map((days) => (
                  <SelectItem key={days} value={days.toString()}>
                    {t("daysOption", { count: days })}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Preview */}
          <div
            className={`rounded-lg border p-4 ${notifyEnabled ? "border-primary/20 bg-primary/5" : "border-muted bg-muted/20"}`}
          >
            <div className="flex items-start gap-3">
              {notifyEnabled ? (
                <Bell className="text-primary mt-0.5 size-5" />
              ) : (
                <BellOff className="text-muted-foreground mt-0.5 size-5" />
              )}
              <div>
                  <p className="font-medium">
                    {notifyEnabled ? t("previewOn") : t("previewOff")}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {notifyEnabled
                      ? t("previewOnDetail", { days: notifyDaysBefore })
                      : t("previewOffDetail")}
                  </p>
                </div>
              </div>
          </div>
        </CardContent>
      </Card>

      {/* Save button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={!hasChanges || isSaving}>
          {isSaving ? (
            <Loader2 className="mr-2 size-4 animate-spin" />
          ) : (
            <Save className="mr-2 size-4" />
          )}
          {isSaving ? t("saving") : t("save")}
        </Button>
      </div>
    </div>
  );
}
