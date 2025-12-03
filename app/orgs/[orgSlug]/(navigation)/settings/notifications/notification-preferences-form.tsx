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
  updateNotificationPreferencesAction,
  type NotificationPreferences,
} from "@/features/notifications";
import { resolveActionResult } from "@/lib/actions/actions-utils";
import { Bell, BellOff, Loader2, Mail, Save } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

type NotificationPreferencesFormProps = {
  defaultValues: NotificationPreferences;
};

const daysOptions = [
  { value: "1", label: "1 jour avant" },
  { value: "2", label: "2 jours avant" },
  { value: "3", label: "3 jours avant" },
  { value: "5", label: "5 jours avant" },
  { value: "7", label: "7 jours avant" },
];

export function NotificationPreferencesForm({
  defaultValues,
}: NotificationPreferencesFormProps) {
  const [isPending, startTransition] = useTransition();
  const [notifyEnabled, setNotifyEnabled] = useState(
    defaultValues.notifyEnabled,
  );
  const [notifyDaysBefore, setNotifyDaysBefore] = useState(
    defaultValues.notifyDaysBefore.toString(),
  );

  const handleSubmit = () => {
    startTransition(async () => {
      try {
        await resolveActionResult(
          updateNotificationPreferencesAction({
            notifyEnabled,
            notifyDaysBefore: parseInt(notifyDaysBefore, 10),
          }),
        );
        toast.success("Préférences enregistrées !");
      } catch {
        toast.error("Erreur lors de l'enregistrement");
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Eggy mood={notifyEnabled ? "happy" : "sleeping"} size="md" />
        <div>
          <h2 className="font-heading text-2xl font-bold">Notifications</h2>
          <p className="text-muted-foreground text-sm">
            Recevez des alertes quand vos oeufs arrivent à expiration
          </p>
        </div>
      </div>

      {/* Notifications Email Card */}
      <Card variant="sunny">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="size-5" />
            Alertes par email
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Enable/Disable */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {notifyEnabled ? (
                <Bell className="text-primary size-5" />
              ) : (
                <BellOff className="text-muted-foreground size-5" />
              )}
              <div>
                <Label htmlFor="notify-enabled" className="text-base">
                  Activer les notifications
                </Label>
                <p className="text-muted-foreground text-sm">
                  Recevez un email quand des oeufs vont bientôt expirer
                </p>
              </div>
            </div>
            <Switch
              id="notify-enabled"
              checked={notifyEnabled}
              onCheckedChange={setNotifyEnabled}
            />
          </div>

          {/* Days before */}
          {notifyEnabled && (
            <div className="space-y-2">
              <Label htmlFor="notify-days">Délai d&apos;alerte</Label>
              <Select
                value={notifyDaysBefore}
                onValueChange={setNotifyDaysBefore}
              >
                <SelectTrigger id="notify-days" className="w-full">
                  <SelectValue placeholder="Choisir le délai" />
                </SelectTrigger>
                <SelectContent>
                  {daysOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-muted-foreground text-xs">
                Vous serez notifié {notifyDaysBefore} jour
                {parseInt(notifyDaysBefore, 10) > 1 ? "s" : ""} avant
                l&apos;expiration de vos oeufs
              </p>
            </div>
          )}

          {/* Save button */}
          <Button
            variant="neubrutalism"
            onClick={handleSubmit}
            disabled={isPending}
            className="w-full"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Enregistrement...
              </>
            ) : (
              <>
                <Save className="mr-2 size-4" />
                Enregistrer
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Info card */}
      <Card variant="sunny" className="bg-muted/50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Eggy mood="happy" size="sm" />
            <div className="text-sm">
              <p className="font-medium">Comment ça marche ?</p>
              <p className="text-muted-foreground">
                Chaque matin, nous vérifions vos boîtes d&apos;oeufs. Si
                certaines arrivent à expiration dans le délai que vous avez
                choisi, nous vous envoyons un email avec des suggestions de
                recettes pour éviter le gaspillage !
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
