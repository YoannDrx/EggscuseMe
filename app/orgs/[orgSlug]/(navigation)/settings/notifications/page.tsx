import { getNotificationPreferencesAction } from "@/features/notifications";
import { Suspense } from "react";
import { NotificationPreferencesForm } from "./notification-preferences-form";

export default function NotificationsSettingsPage() {
  return (
    <Suspense fallback={<NotificationsLoading />}>
      <NotificationsContent />
    </Suspense>
  );
}

async function NotificationsContent() {
  const result = await getNotificationPreferencesAction();

  const defaultPreferences = {
    notifyEnabled: true,
    notifyDaysBefore: 2,
  };

  const preferences = result.data?.preferences ?? defaultPreferences;

  return <NotificationPreferencesForm defaultValues={preferences} />;
}

function NotificationsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="bg-muted size-16 animate-pulse rounded-full" />
        <div className="space-y-2">
          <div className="bg-muted h-6 w-32 animate-pulse rounded" />
          <div className="bg-muted h-4 w-48 animate-pulse rounded" />
        </div>
      </div>
      <div className="bg-muted h-64 animate-pulse rounded-xl" />
    </div>
  );
}
