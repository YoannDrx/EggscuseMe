"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eggy } from "@/features/mascot";
import { Form, useForm } from "@/features/form/tanstack-form";
import { authClient, useSession } from "@/lib/auth-client";
import { unwrapSafePromise } from "@/lib/promises";
import { useMutation } from "@tanstack/react-query";
import { ChevronLeft, KeyRound, Mail } from "lucide-react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";

export default function SecurityPage() {
  const locale = useLocale();
  const copy =
    locale === "fr"
      ? {
          title: "Sécurité",
          subtitle: "Gérez vos identifiants de connexion",
          back: "Retour aux paramètres",
          changePassword: "Changer le mot de passe",
          changePasswordDesc: "Mettez à jour votre mot de passe pour sécuriser votre compte",
          currentPassword: "Mot de passe actuel",
          newPassword: "Nouveau mot de passe",
          confirmPassword: "Confirmer le mot de passe",
          mismatch: "Les mots de passe ne correspondent pas",
          passwordRequired: "Mot de passe actuel requis",
          passwordMin: "Le mot de passe doit contenir au moins 8 caractères",
          revokeOther: "Déconnecter les autres appareils",
          revokeDesc: "Vous serez déconnecté de tous les autres appareils",
          submitPassword: "Changer le mot de passe",
          toastPassword: "Mot de passe modifié avec succès",
          changeEmail: "Changer l'adresse email",
          changeEmailDesc: "Un email de vérification sera envoyé à la nouvelle adresse",
          emailLabel: "Nouvelle adresse email",
          emailPlaceholder: "nouveau@email.com",
          toastEmail: "Email de vérification envoyé. Vérifiez votre boîte de réception.",
          verifyEmail: "Vérifier l'email",
          backToSettings: "Retour aux paramètres",
        }
      : {
          title: "Security",
          subtitle: "Manage your login details",
          back: "Back to settings",
          changePassword: "Change password",
          changePasswordDesc: "Update your password to secure your account",
          currentPassword: "Current password",
          newPassword: "New password",
          confirmPassword: "Confirm password",
          mismatch: "Passwords do not match",
          passwordRequired: "Current password is required",
          passwordMin: "Password must be at least 8 characters",
          revokeOther: "Sign out other devices",
          revokeDesc: "You'll be signed out on all other devices",
          submitPassword: "Change password",
          toastPassword: "Password updated",
          changeEmail: "Change email address",
          changeEmailDesc: "A verification email will be sent to the new address",
          emailLabel: "New email address",
          emailPlaceholder: "new@email.com",
          toastEmail: "Verification email sent. Check your inbox.",
          verifyEmail: "Verify email",
          backToSettings: "Back to settings",
        };

  const ChangePasswordFormSchema = z
    .object({
      currentPassword: z.string().min(1, copy.passwordRequired),
      newPassword: z.string().min(8, copy.passwordMin),
      confirmPassword: z.string().min(8, copy.passwordMin),
      revokeOtherSessions: z.boolean().default(true),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: copy.mismatch,
      path: ["confirmPassword"],
    });

  const ChangeEmailFormSchema = z.object({
    newEmail: z
      .string()
      .email(
        locale === "fr"
          ? "Veuillez entrer une adresse email valide"
          : "Please enter a valid email address",
      ),
  });

  type ChangePasswordFormType = z.infer<typeof ChangePasswordFormSchema>;
  type ChangeEmailFormType = z.infer<typeof ChangeEmailFormSchema>;
  const router = useRouter();
  const session = useSession();

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
      toast.success(copy.toastPassword);
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
      toast.success(copy.toastEmail);
      router.refresh();
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

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Link
        href="/fridge/settings"
        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-sm transition-colors"
      >
        <ChevronLeft className="size-4" />
        {copy.backToSettings}
      </Link>

      {/* Header */}
      <div className="flex items-center gap-4">
        <Eggy mood="happy" size="lg" />
        <div>
          <h1 className="font-heading text-2xl font-bold">{copy.title}</h1>
          <p className="text-muted-foreground">{copy.subtitle}</p>
        </div>
      </div>

      {/* Change Password */}
      <Card variant="sunny">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <KeyRound className="size-5" />
            {copy.changePassword}
          </CardTitle>
          <CardDescription>{copy.changePasswordDesc}</CardDescription>
        </CardHeader>
        <Form form={passwordForm}>
          <CardContent className="space-y-4">
            <passwordForm.AppField name="currentPassword">
              {(field) => (
                <field.Field>
                  <field.Label>{copy.currentPassword}</field.Label>
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
                  <field.Label>{copy.newPassword}</field.Label>
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
                  <field.Label>{copy.confirmPassword}</field.Label>
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
                    <field.Label>{copy.revokeOther}</field.Label>
                    <field.Description>{copy.revokeDesc}</field.Description>
                  </div>
                  <field.Switch />
                </div>
              )}
            </passwordForm.AppField>
            <passwordForm.SubmitButton className="w-full">
              {copy.submitPassword}
            </passwordForm.SubmitButton>
          </CardContent>
        </Form>
      </Card>

      {/* Change Email */}
      <Card variant="sunny">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="size-5" />
            {copy.changeEmail}
          </CardTitle>
          <CardDescription>{copy.changeEmailDesc}</CardDescription>
        </CardHeader>
        <Form form={emailForm}>
          <CardContent className="space-y-4">
            <emailForm.AppField name="newEmail">
              {(field) => (
                <field.Field>
                  <field.Label>{copy.emailLabel}</field.Label>
                  <field.Content>
                    <field.Input type="email" placeholder={copy.emailPlaceholder} />
                    <field.Message />
                  </field.Content>
                </field.Field>
              )}
            </emailForm.AppField>
            <emailForm.SubmitButton className="w-full">
              {copy.changeEmail}
            </emailForm.SubmitButton>
          </CardContent>
        </Form>
      </Card>
    </div>
  );
}
