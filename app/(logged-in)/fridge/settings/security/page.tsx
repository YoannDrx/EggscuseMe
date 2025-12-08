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
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";

const ChangePasswordFormSchema = z
  .object({
    currentPassword: z.string().min(1, "Mot de passe actuel requis"),
    newPassword: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
    confirmPassword: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
    revokeOtherSessions: z.boolean().default(true),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

const ChangeEmailFormSchema = z.object({
  newEmail: z.string().email("Veuillez entrer une adresse email valide"),
});

type ChangePasswordFormType = z.infer<typeof ChangePasswordFormSchema>;
type ChangeEmailFormType = z.infer<typeof ChangeEmailFormSchema>;

export default function SecurityPage() {
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
      toast.success("Mot de passe modifié avec succès");
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
      toast.success(
        "Email de vérification envoyé. Vérifiez votre boîte de réception.",
      );
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
        Retour aux paramètres
      </Link>

      {/* Header */}
      <div className="flex items-center gap-4">
        <Eggy mood="happy" size="lg" />
        <div>
          <h1 className="font-heading text-2xl font-bold">Sécurité</h1>
          <p className="text-muted-foreground">
            Gérez vos identifiants de connexion
          </p>
        </div>
      </div>

      {/* Change Password */}
      <Card variant="sunny">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <KeyRound className="size-5" />
            Changer le mot de passe
          </CardTitle>
          <CardDescription>
            Mettez à jour votre mot de passe pour sécuriser votre compte
          </CardDescription>
        </CardHeader>
        <Form form={passwordForm}>
          <CardContent className="space-y-4">
            <passwordForm.AppField name="currentPassword">
              {(field) => (
                <field.Field>
                  <field.Label>Mot de passe actuel</field.Label>
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
                  <field.Label>Nouveau mot de passe</field.Label>
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
                  <field.Label>Confirmer le mot de passe</field.Label>
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
                    <field.Label>Déconnecter les autres appareils</field.Label>
                    <field.Description>
                      Vous serez déconnecté de tous les autres appareils
                    </field.Description>
                  </div>
                  <field.Switch />
                </div>
              )}
            </passwordForm.AppField>
            <passwordForm.SubmitButton className="w-full">
              Changer le mot de passe
            </passwordForm.SubmitButton>
          </CardContent>
        </Form>
      </Card>

      {/* Change Email */}
      <Card variant="sunny">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="size-5" />
            Changer l&apos;adresse email
          </CardTitle>
          <CardDescription>
            Un email de vérification sera envoyé à la nouvelle adresse
          </CardDescription>
        </CardHeader>
        <Form form={emailForm}>
          <CardContent className="space-y-4">
            <emailForm.AppField name="newEmail">
              {(field) => (
                <field.Field>
                  <field.Label>Nouvelle adresse email</field.Label>
                  <field.Content>
                    <field.Input type="email" placeholder="nouveau@email.com" />
                    <field.Message />
                  </field.Content>
                </field.Field>
              )}
            </emailForm.AppField>
            <emailForm.SubmitButton className="w-full">
              Changer l&apos;email
            </emailForm.SubmitButton>
          </CardContent>
        </Form>
      </Card>
    </div>
  );
}
