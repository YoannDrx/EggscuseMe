"use client";

import { AvatarUploader } from "@/components/avatar-upload";
import { Typography } from "@/components/nowts/typography";
import { NeoButton } from "@/components/neo";
import {
  NeoCard,
  NeoCardContent,
  NeoCardFooter,
  NeoCardHeader,
  NeoCardTitle,
} from "@/components/neo";
import { NeoLabel } from "@/components/neo";
import { InlineTooltip } from "@/components/ui/tooltip";
import { LoadingButton } from "@/features/form/submit-button";
import { Form, useForm } from "@/features/form/tanstack-form";
import { uploadImageAction } from "@/features/images/upload-image.action";
import { resolveActionResult } from "@/lib/actions/actions-utils";
import { authClient } from "@/lib/auth-client";
import { displayName } from "@/lib/format/display-name";
import { unwrapSafePromise } from "@/lib/promises";
import { useMutation } from "@tanstack/react-query";
import type { User } from "better-auth";
import { BadgeCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import type { ProfileFormType } from "./edit-profile.schema";
import { ProfileFormSchema } from "./edit-profile.schema";

type EditProfileFormProps = {
  defaultValues: User;
};

export const EditProfileCardForm = ({
  defaultValues,
}: EditProfileFormProps) => {
  const t = useTranslations("fridge.settings.profileForm");
  const router = useRouter();

  const updateProfileMutation = useMutation({
    mutationFn: async (values: ProfileFormType) => {
      return unwrapSafePromise(
        authClient.updateUser({
          name: values.name ?? "",
          image: values.image,
        }),
      );
    },
    onSuccess: () => {
      toast.success(t("updated"));
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const uploadImageMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.set("files", file);

      return resolveActionResult(uploadImageAction({ formData }));
    },
    onSuccess: (data) => {
      form.setFieldValue("image", data);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const form = useForm({
    schema: ProfileFormSchema,
    defaultValues: {
      name: defaultValues.name,
      image: defaultValues.image ?? null,
    },
    onSubmit: async (values) => {
      await updateProfileMutation.mutateAsync(values);
    },
  });

  const verifyEmailMutation = useMutation({
    mutationFn: async () => {
      return unwrapSafePromise(
        authClient.sendVerificationEmail({
          email: defaultValues.email,
        }),
      );
    },
    onSuccess: () => {
      toast.success(t("verifySent"));
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <Form form={form}>
      <NeoCard variant="elevated">
        <NeoCardHeader>
          <div className="flex items-center gap-4">
            <form.AppField name="image">
              {(field) => (
                <AvatarUploader
                  onImageChange={(file) => uploadImageMutation.mutate(file)}
                  currentAvatar={field.state.value}
                />
              )}
            </form.AppField>

            <form.Subscribe selector={(state) => state.values.name}>
              {(name) => (
                <div>
                  <NeoCardTitle className="font-heading text-xl">
                    {displayName({
                      email: defaultValues.email,
                      name: name,
                    })}
                  </NeoCardTitle>
                  <Typography variant="muted" className="text-sm">
                    {defaultValues.email}
                  </Typography>
                </div>
              )}
            </form.Subscribe>
          </div>
        </NeoCardHeader>
        <NeoCardContent className="flex flex-col gap-4">
          <form.AppField name="name">
            {(field) => (
              <field.Field>
                <field.Label>{t("name")}</field.Label>
                <field.Content>
                  <field.Input
                    placeholder={t("namePlaceholder") || undefined}
                  />
                  <field.Message />
                </field.Content>
              </field.Field>
            )}
          </form.AppField>
          <div className="flex flex-col gap-2">
            <NeoLabel className="flex items-center gap-4">
              <span>{t("email")}</span>
              {defaultValues.emailVerified ? (
                <InlineTooltip title={t("verifySent")}>
                  <BadgeCheck size={16} className="text-fresh-extra" />
                </InlineTooltip>
              ) : (
                <LoadingButton
                  type="button"
                  size="sm"
                  variant="ghost"
                  data-testid="verify-email-button"
                  onClick={() => verifyEmailMutation.mutate()}
                  loading={verifyEmailMutation.isPending}
                >
                  {t("verify")}
                </LoadingButton>
              )}
            </NeoLabel>
            <Typography>{defaultValues.email}</Typography>
          </div>
        </NeoCardContent>
        <NeoCardFooter className="flex flex-wrap gap-2">
          <NeoButton asChild size="sm" variant="ghost">
            <Link href="/fridge/settings/security">{t("changeEmail")}</Link>
          </NeoButton>
          <NeoButton asChild size="sm" variant="ghost">
            <Link href="/fridge/settings/security">{t("changePassword")}</Link>
          </NeoButton>
          <div className="flex-1" />
          <form.SubmitButton>{t("save")}</form.SubmitButton>
        </NeoCardFooter>
      </NeoCard>
    </Form>
  );
};
