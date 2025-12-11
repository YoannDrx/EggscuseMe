"use client";

import { NeoAvatar } from "@/components/neo/neo-avatar";
import {
  NeoCard,
  NeoCardDescription,
  NeoCardFooter,
  NeoCardHeader,
} from "@/components/neo/neo-card";
import { Form, useForm } from "@/features/form/tanstack-form";
import { authClient } from "@/lib/auth-client";
import { unwrapSafePromise } from "@/lib/promises";
import { useMutation } from "@tanstack/react-query";
import { RefreshCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";

const PasswordFormSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export function ResetPasswordPage({ token }: { token: string }) {
  const router = useRouter();

  const resetPasswordMutation = useMutation({
    mutationFn: async (values: { password: string }) => {
      return unwrapSafePromise(
        authClient.resetPassword({
          token: token,
          newPassword: values.password,
        }),
      );
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success("Password reset successfully");
      const newUrl = `${window.location.origin}/auth/signin`;
      window.location.href = newUrl;
    },
  });

  const form = useForm({
    schema: PasswordFormSchema,
    defaultValues: {
      password: "",
    },
    onSubmit: async (values) => {
      await resetPasswordMutation.mutateAsync(values);
    },
  });

  if (!token) {
    router.push("/auth/forget-password");
    return null;
  }

  return (
    <NeoCard
      variant="elevated"
      className="mx-auto w-full max-w-md lg:max-w-lg"
      padding="lg"
    >
      <NeoCardHeader>
        <div className="flex justify-center">
          <NeoAvatar
            fallback="RP"
            size="lg"
            shape="square"
            className="flex items-center justify-center"
          >
            <RefreshCcw className="text-neo-accent size-6" />
          </NeoAvatar>
        </div>
        <NeoCardHeader className="text-center">Reset Password</NeoCardHeader>

        <NeoCardDescription className="text-center">
          Enter your new password below
        </NeoCardDescription>
      </NeoCardHeader>
      <NeoCardFooter className="border-t-neo-border w-full border-t-[length:var(--border-neo)] pt-6">
        <Form form={form} className="w-full space-y-4">
          <form.AppField name="password">
            {(field) => (
              <field.Field>
                <field.Label>New Password</field.Label>
                <field.Content>
                  <field.Input type="password" placeholder="••••••••" />
                  <field.Message />
                </field.Content>
              </field.Field>
            )}
          </form.AppField>
          <form.SubmitButton className="w-full">
            Reset Password
          </form.SubmitButton>
        </Form>
      </NeoCardFooter>
    </NeoCard>
  );
}
