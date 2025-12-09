"use client";

import { Form, useForm } from "@/features/form/tanstack-form";
import { createCheckoutAction } from "@/features/fridge/billing.action";
import { authClient } from "@/lib/auth-client";
import { getCallbackUrl } from "@/lib/auth/auth-utils";
import { unwrapSafePromise } from "@/lib/promises";
import { useMutation } from "@tanstack/react-query";
import { useAction } from "next-safe-action/hooks";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import type { LoginCredentialsFormType } from "./signup.schema";
import { LoginCredentialsFormScheme } from "./signup.schema";

export const SignUpCredentialsForm = () => {
  const searchParams = useSearchParams();
  const planParam = searchParams.get("plan");

  // Déterminer si on doit rediriger vers checkout après signup
  const shouldCheckout =
    planParam === "premium" || planParam === "premium-yearly";
  const isYearly = planParam === "premium-yearly";

  const { execute: createCheckout } = useAction(createCheckoutAction, {
    onSuccess: (result) => {
      if (result.data.url) {
        window.location.href = result.data.url;
      }
    },
    onError: (error) => {
      toast.error(error.error.serverError ?? "Failed to start checkout");
      // En cas d'erreur, rediriger vers le fridge quand même
      window.location.href = "/fridge";
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (values: LoginCredentialsFormType) => {
      return unwrapSafePromise(
        authClient.signUp.email({
          email: values.email,
          password: values.password,
          name: values.name,
          image: values.image,
        }),
      );
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      if (shouldCheckout) {
        // Rediriger vers Stripe checkout
        createCheckout({
          plan: "premium",
          annual: isYearly,
          successUrl: "/fridge/settings/billing?success=true",
          cancelUrl: "/fridge",
        });
      } else {
        // Redirection classique
        const newUrl = window.location.origin + getCallbackUrl("/fridge");
        window.location.href = newUrl;
      }
    },
  });

  const form = useForm({
    schema: LoginCredentialsFormScheme,
    defaultValues: {
      name: "",
      email: "",
      password: "",
      verifyPassword: "",
      image: "",
    },
    onSubmit: async (values) => {
      if (values.password !== values.verifyPassword) {
        toast.error("Password does not match");
        return;
      }

      await submitMutation.mutateAsync(values);
    },
  });

  return (
    <Form form={form} className="max-w-lg space-y-4">
      <form.AppField name="name">
        {(field) => (
          <field.Field>
            <field.Label>Name</field.Label>
            <field.Content>
              <field.Input placeholder="John Doe" />
              <field.Message />
            </field.Content>
          </field.Field>
        )}
      </form.AppField>

      <form.AppField name="email">
        {(field) => (
          <field.Field>
            <field.Label>Email</field.Label>
            <field.Content>
              <field.Input type="email" placeholder="john@doe.com" />
              <field.Message />
            </field.Content>
          </field.Field>
        )}
      </form.AppField>

      <form.AppField name="password">
        {(field) => (
          <field.Field>
            <field.Label>Password</field.Label>
            <field.Content>
              <field.Input type="password" />
              <field.Message />
            </field.Content>
          </field.Field>
        )}
      </form.AppField>

      <form.AppField name="verifyPassword">
        {(field) => (
          <field.Field>
            <field.Label>Verify Password</field.Label>
            <field.Content>
              <field.Input type="password" />
              <field.Message />
            </field.Content>
          </field.Field>
        )}
      </form.AppField>

      <form.SubmitButton className="w-full">Sign up</form.SubmitButton>
    </Form>
  );
};
