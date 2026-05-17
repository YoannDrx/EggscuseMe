"use client";

import {
  NeoButton,
  NeoCard,
  NeoCardContent,
  NeoCardDescription,
  NeoCardHeader,
  NeoCardTitle,
} from "@/components/neo";
import { Eggy } from "@/features/mascot";
import { Form, useForm } from "@/features/form/tanstack-form";
import { authClient, useSession } from "@/lib/auth-client";
import { unwrapSafePromise } from "@/lib/promises";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  ChevronLeft,
  Clock,
  KeyRound,
  Laptop,
  Loader2,
  LogOut,
  Mail,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";

type ActiveSession = {
  id: string;
  token: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  expiresAt: Date | string;
  ipAddress?: string | null;
  userAgent?: string | null;
};

export default function SecurityPage() {
  const t = useTranslations("fridge.settings.securityPage");
  const locale = useLocale();
  const deviceLabels = {
    desktopDevice: t("desktopDevice"),
    mobileDevice: t("mobileDevice"),
    tabletDevice: t("tabletDevice"),
    unknownDevice: t("unknownDevice"),
  };

  const ChangePasswordFormSchema = z
    .object({
      currentPassword: z.string().min(1, t("passwordRequired")),
      newPassword: z.string().min(8, t("passwordMin")),
      confirmPassword: z.string().min(8, t("passwordMin")),
      revokeOtherSessions: z.boolean().default(true),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: t("mismatch"),
      path: ["confirmPassword"],
    });

  const ChangeEmailFormSchema = z.object({
    newEmail: z.string().email(t("invalidEmail")),
  });

  type ChangePasswordFormType = z.infer<typeof ChangePasswordFormSchema>;
  type ChangeEmailFormType = z.infer<typeof ChangeEmailFormSchema>;
  const router = useRouter();
  const session = useSession();
  const currentSessionToken = session.data?.session.token;
  const dateFormatter = new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const sessionsQuery = useQuery({
    queryKey: ["auth", "sessions"],
    queryFn: async () => unwrapSafePromise(authClient.listSessions()),
  });

  // Password mutation
  const changePasswordMutation = useMutation({
    mutationFn: async (values: ChangePasswordFormType) => {
      return unwrapSafePromise(
        authClient.changePassword({
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
          revokeOtherSessions: values.revokeOtherSessions,
        }),
      );
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success(t("toastPassword"));
      passwordForm.reset();
    },
  });

  // Email mutation
  const changeEmailMutation = useMutation({
    mutationFn: async (values: ChangeEmailFormType) => {
      return unwrapSafePromise(
        authClient.changeEmail({
          newEmail: values.newEmail,
        }),
      );
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success(t("toastEmail"));
      router.refresh();
    },
  });

  const revokeSessionMutation = useMutation({
    mutationFn: async (token: string) => {
      return unwrapSafePromise(authClient.revokeSession({ token }));
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: async () => {
      toast.success(t("sessionRevoked"));
      await sessionsQuery.refetch();
    },
  });

  const revokeOtherSessionsMutation = useMutation({
    mutationFn: async () => {
      return unwrapSafePromise(authClient.revokeOtherSessions());
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: async () => {
      toast.success(t("otherSessionsRevoked"));
      await sessionsQuery.refetch();
    },
  });

  const passwordForm = useForm({
    schema: ChangePasswordFormSchema,
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      revokeOtherSessions: true,
    },
    onSubmit: async (values) => {
      await changePasswordMutation.mutateAsync(values);
    },
  });

  const emailForm = useForm({
    schema: ChangeEmailFormSchema,
    defaultValues: {
      newEmail: session.data?.user.email ?? "",
    },
    onSubmit: async (values) => {
      await changeEmailMutation.mutateAsync(values);
    },
  });

  const activeSessions = (sessionsQuery.data ?? [])
    .map((activeSession) => activeSession as ActiveSession)
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
  const otherSessionsCount = activeSessions.filter(
    (activeSession) => activeSession.token !== currentSessionToken,
  ).length;

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Link
        href="/fridge/settings"
        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-sm transition-colors"
      >
        <ChevronLeft className="size-4" />
        {t("backToSettings")}
      </Link>

      {/* Header */}
      <div className="flex items-center gap-4">
        <Eggy mood="happy" size="lg" />
        <div>
          <h1 className="font-heading text-2xl font-bold">{t("title")}</h1>
          <p className="text-muted-foreground">{t("subtitle")}</p>
        </div>
      </div>

      {/* Change Password */}
      <NeoCard variant="elevated">
        <NeoCardHeader>
          <NeoCardTitle className="flex items-center gap-2">
            <KeyRound className="size-5" />
            {t("changePassword")}
          </NeoCardTitle>
          <NeoCardDescription>{t("changePasswordDesc")}</NeoCardDescription>
        </NeoCardHeader>
        <Form form={passwordForm}>
          <NeoCardContent className="space-y-4">
            <passwordForm.AppField name="currentPassword">
              {(field) => (
                <field.Field>
                  <field.Label>{t("currentPassword")}</field.Label>
                  <field.Content>
                    <field.Input type="password" />
                    <field.Message />
                  </field.Content>
                </field.Field>
              )}
            </passwordForm.AppField>
            <passwordForm.AppField name="newPassword">
              {(field) => (
                <field.Field>
                  <field.Label>{t("newPassword")}</field.Label>
                  <field.Content>
                    <field.Input type="password" />
                    <field.Message />
                  </field.Content>
                </field.Field>
              )}
            </passwordForm.AppField>
            <passwordForm.AppField name="confirmPassword">
              {(field) => (
                <field.Field>
                  <field.Label>{t("confirmPassword")}</field.Label>
                  <field.Content>
                    <field.Input type="password" />
                    <field.Message />
                  </field.Content>
                </field.Field>
              )}
            </passwordForm.AppField>
            <passwordForm.AppField name="revokeOtherSessions">
              {(field) => (
                <div className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <field.Label>{t("revokeOther")}</field.Label>
                    <field.Description>{t("revokeDesc")}</field.Description>
                  </div>
                  <field.Switch />
                </div>
              )}
            </passwordForm.AppField>
            <passwordForm.SubmitButton className="w-full">
              {t("submitPassword")}
            </passwordForm.SubmitButton>
          </NeoCardContent>
        </Form>
      </NeoCard>

      {/* Active Sessions */}
      <NeoCard variant="elevated">
        <NeoCardHeader className="gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <NeoCardTitle className="flex items-center gap-2">
              <ShieldCheck className="size-5" />
              {t("sessions")}
            </NeoCardTitle>
            <NeoCardDescription>{t("sessionsDesc")}</NeoCardDescription>
          </div>
          <NeoButton
            type="button"
            variant="outline"
            size="sm"
            loading={revokeOtherSessionsMutation.isPending}
            disabled={otherSessionsCount === 0}
            onClick={() => revokeOtherSessionsMutation.mutate()}
          >
            <LogOut className="size-4" />
            {t("revokeOtherSessions")}
          </NeoButton>
        </NeoCardHeader>
        <NeoCardContent className="space-y-3">
          {sessionsQuery.isPending && (
            <div className="text-neo-text-muted flex items-center gap-2 rounded-lg border p-4 text-sm">
              <Loader2 className="size-4 animate-spin" />
              {t("loadingSessions")}
            </div>
          )}

          {sessionsQuery.isError && (
            <div className="text-destructive rounded-lg border p-4 text-sm">
              {t("sessionsError")}
            </div>
          )}

          {!sessionsQuery.isPending &&
            !sessionsQuery.isError &&
            activeSessions.length === 0 && (
              <div className="text-neo-text-muted rounded-lg border p-4 text-sm">
                {t("noSessions")}
              </div>
            )}

          {activeSessions.map((activeSession) => {
            const device = getDeviceDetails(
              activeSession.userAgent,
              deviceLabels,
            );
            const isCurrentSession =
              activeSession.token === currentSessionToken;
            const isRevoking =
              revokeSessionMutation.isPending &&
              revokeSessionMutation.variables === activeSession.token;

            return (
              <div
                key={activeSession.id}
                className="flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0 space-y-2">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-full">
                      <device.Icon className="size-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium">{device.label}</p>
                        <span className="rounded-full border px-2 py-0.5 text-xs">
                          {isCurrentSession
                            ? t("currentSession")
                            : t("otherSession")}
                        </span>
                      </div>
                      {activeSession.userAgent && (
                        <p className="text-neo-text-muted max-w-xl truncate text-xs">
                          {activeSession.userAgent}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="text-neo-text-muted flex flex-wrap gap-x-4 gap-y-1 text-xs">
                    <span className="flex items-center gap-1">
                      <Clock className="size-3.5" />
                      {t("lastActive")}:{" "}
                      {formatSessionDate(
                        activeSession.updatedAt,
                        dateFormatter,
                      )}
                    </span>
                    <span>
                      {t("expiresAt")}:{" "}
                      {formatSessionDate(
                        activeSession.expiresAt,
                        dateFormatter,
                      )}
                    </span>
                    <span>
                      {t("ipAddress")}:{" "}
                      {activeSession.ipAddress ?? t("unknownIp")}
                    </span>
                  </div>
                </div>

                <NeoButton
                  type="button"
                  variant="ghost"
                  size="sm"
                  loading={isRevoking}
                  disabled={isCurrentSession}
                  onClick={() =>
                    revokeSessionMutation.mutate(activeSession.token)
                  }
                >
                  <LogOut className="size-4" />
                  {t("revokeSession")}
                </NeoButton>
              </div>
            );
          })}
        </NeoCardContent>
      </NeoCard>

      {/* Change Email */}
      <NeoCard variant="elevated">
        <NeoCardHeader>
          <NeoCardTitle className="flex items-center gap-2">
            <Mail className="size-5" />
            {t("changeEmail")}
          </NeoCardTitle>
          <NeoCardDescription>{t("changeEmailDesc")}</NeoCardDescription>
        </NeoCardHeader>
        <Form form={emailForm}>
          <NeoCardContent className="space-y-4">
            <emailForm.AppField name="newEmail">
              {(field) => (
                <field.Field>
                  <field.Label>{t("emailLabel")}</field.Label>
                  <field.Content>
                    <field.Input
                      type="email"
                      placeholder={t("emailPlaceholder")}
                    />
                    <field.Message />
                  </field.Content>
                </field.Field>
              )}
            </emailForm.AppField>
            <emailForm.SubmitButton className="w-full">
              {t("changeEmail")}
            </emailForm.SubmitButton>
          </NeoCardContent>
        </Form>
      </NeoCard>
    </div>
  );
}

function getDeviceDetails(
  userAgent: string | null | undefined,
  copy: {
    desktopDevice: string;
    mobileDevice: string;
    tabletDevice: string;
    unknownDevice: string;
  },
) {
  if (!userAgent) {
    return { label: copy.unknownDevice, Icon: Laptop };
  }

  if (/ipad|tablet/i.test(userAgent)) {
    return { label: copy.tabletDevice, Icon: Smartphone };
  }

  if (/android|iphone|mobile/i.test(userAgent)) {
    return { label: copy.mobileDevice, Icon: Smartphone };
  }

  return { label: copy.desktopDevice, Icon: Laptop };
}

function formatSessionDate(
  value: Date | string,
  formatter: Intl.DateTimeFormat,
) {
  return formatter.format(new Date(value));
}
