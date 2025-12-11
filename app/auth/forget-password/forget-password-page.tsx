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
import { Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";

const EmailFormSchema = z.object({
  email: z.string().email(),
});

type EmailFormType = z.infer<typeof EmailFormSchema>;

export function ForgetPasswordPage() {
  const router = useRouter();

  const forgetPasswordMutation = useMutation({
    mutationFn: async (values: EmailFormType) => {
      return unwrapSafePromise(
        authClient.forgetPassword({
          email: values.email,
          redirectTo: "/auth/reset-password",
        }),
      );
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      router.push("/auth/verify");
    },
  });

  const form = useForm({
    schema: EmailFormSchema,
    defaultValues: {
      email: "",
    },
    onSubmit: async (values) => {
      await forgetPasswordMutation.mutateAsync(values);
    },
  });

  return (
    <NeoCard
      variant="elevated"
      className="mx-auto w-full max-w-md lg:max-w-lg"
      padding="lg"
    >
      <NeoCardHeader>
        <div className="flex justify-center">
          <NeoAvatar
            fallback="LK"
            size="lg"
            shape="square"
            className="flex items-center justify-center"
          >
            <Lock className="text-neo-accent size-6" />
          </NeoAvatar>
        </div>
        <NeoCardHeader className="text-center">Forget Password</NeoCardHeader>

        <NeoCardDescription className="text-center">
          Enter your email to reset your password
        </NeoCardDescription>
      </NeoCardHeader>

      <NeoCardFooter className="border-t-neo-border border-t-[length:var(--border-neo)] pt-6">
        <Form form={form} className="w-full space-y-4">
          <form.AppField name="email">
            {(field) => (
              <field.Field>
                <field.Label>Email</field.Label>
                <field.Content>
                  <field.Input type="email" placeholder="your@email.com" />
                  <field.Message />
                </field.Content>
              </field.Field>
            )}
          </form.AppField>

          <form.SubmitButton className="w-full">
            Send Reset Link
          </form.SubmitButton>
        </Form>
      </NeoCardFooter>
    </NeoCard>
  );
}
