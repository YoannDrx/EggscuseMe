"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useZodForm,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "@/lib/auth-client";
import { useMutation } from "@tanstack/react-query";
import { Loader2, Mail, Send } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import {
  sendTestExpirationWarningAction,
  sendTestFridgeInvitationAction,
  sendTestMarkdownAction,
} from "../../_actions/admin-emails.action";

const FridgeInvitationSchema = z.object({
  to: z.string().email(),
  inviterName: z.string().min(1),
  fridgeName: z.string().min(1),
});

const ExpirationWarningSchema = z.object({
  to: z.string().email(),
  userName: z.string().min(1),
  fridgeName: z.string().min(1),
});

const MarkdownEmailSchema = z.object({
  to: z.string().email(),
  subject: z.string().min(1),
  markdown: z.string().min(1),
  preview: z.string().optional(),
});

function FridgeInvitationForm({ defaultEmail }: { defaultEmail: string }) {
  const t = useTranslations("admin.emails");
  const form = useZodForm({
    schema: FridgeInvitationSchema,
    defaultValues: {
      to: defaultEmail,
      inviterName: "Jean Dupont",
      fridgeName: "Ma Cuisine",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof FridgeInvitationSchema>) => {
      const result = await sendTestFridgeInvitationAction(data);
      if (result.data && result.data.success === false) {
        throw new Error(result.data.error);
      }
      return result;
    },
    onSuccess: () => {
      toast.success(t("templates.fridgeInvitation.success"));
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  return (
    <Form form={form} onSubmit={(data) => mutation.mutate(data)}>
      <div className="flex flex-col gap-4">
        <FormField
          control={form.control}
          name="to"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("form.to")}</FormLabel>
              <FormControl>
                <Input {...field} type="email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="inviterName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t("templates.fridgeInvitation.inviterName")}
              </FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="fridgeName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t("templates.fridgeInvitation.fridgeName")}
              </FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? (
            <Loader2 className="mr-2 size-4 animate-spin" />
          ) : (
            <Send className="mr-2 size-4" />
          )}
          {t("form.send")}
        </Button>
      </div>
    </Form>
  );
}

function ExpirationWarningForm({ defaultEmail }: { defaultEmail: string }) {
  const t = useTranslations("admin.emails");
  const form = useZodForm({
    schema: ExpirationWarningSchema,
    defaultValues: {
      to: defaultEmail,
      userName: "Marie Martin",
      fridgeName: "Frigo Familial",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof ExpirationWarningSchema>) => {
      const result = await sendTestExpirationWarningAction(data);
      if (result.data && result.data.success === false) {
        throw new Error(result.data.error);
      }
      return result;
    },
    onSuccess: () => {
      toast.success(t("templates.expirationWarning.success"));
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  return (
    <Form form={form} onSubmit={(data) => mutation.mutate(data)}>
      <div className="flex flex-col gap-4">
        <FormField
          control={form.control}
          name="to"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("form.to")}</FormLabel>
              <FormControl>
                <Input {...field} type="email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="userName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("templates.expirationWarning.userName")}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="fridgeName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t("templates.expirationWarning.fridgeName")}
              </FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? (
            <Loader2 className="mr-2 size-4 animate-spin" />
          ) : (
            <Send className="mr-2 size-4" />
          )}
          {t("form.send")}
        </Button>
      </div>
    </Form>
  );
}

function MarkdownEmailForm({ defaultEmail }: { defaultEmail: string }) {
  const t = useTranslations("admin.emails");
  const form = useZodForm({
    schema: MarkdownEmailSchema,
    defaultValues: {
      to: defaultEmail,
      subject: "Test Email",
      markdown:
        "# Bonjour!\n\nCeci est un **email de test** avec du contenu Markdown.\n\n- Point 1\n- Point 2\n- Point 3",
      preview: "Email de test depuis EggscuseMe",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof MarkdownEmailSchema>) => {
      const result = await sendTestMarkdownAction(data);
      if (result.data && result.data.success === false) {
        throw new Error(result.data.error);
      }
      return result;
    },
    onSuccess: () => {
      toast.success(t("templates.markdown.success"));
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  return (
    <Form form={form} onSubmit={(data) => mutation.mutate(data)}>
      <div className="flex flex-col gap-4">
        <FormField
          control={form.control}
          name="to"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("form.to")}</FormLabel>
              <FormControl>
                <Input {...field} type="email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("templates.markdown.subject")}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="preview"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("templates.markdown.preview")}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="markdown"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("templates.markdown.content")}</FormLabel>
              <FormControl>
                <Textarea {...field} rows={6} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? (
            <Loader2 className="mr-2 size-4 animate-spin" />
          ) : (
            <Send className="mr-2 size-4" />
          )}
          {t("form.send")}
        </Button>
      </div>
    </Form>
  );
}

export function EmailTemplatesList() {
  const t = useTranslations("admin.emails");
  const { data: session } = useSession();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const defaultEmail = session?.user.email ?? "";

  const templates = [
    {
      id: "fridge-invitation",
      name: t("templates.fridgeInvitation.name"),
      description: t("templates.fridgeInvitation.description"),
      icon: Mail,
    },
    {
      id: "expiration-warning",
      name: t("templates.expirationWarning.name"),
      description: t("templates.expirationWarning.description"),
      icon: Mail,
    },
    {
      id: "markdown",
      name: t("templates.markdown.name"),
      description: t("templates.markdown.description"),
      icon: Mail,
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {templates.map((template) => {
        const Icon = template.icon;
        const isSelected = selectedTemplate === template.id;

        return (
          <Card
            key={template.id}
            className={isSelected ? "ring-primary ring-2" : ""}
          >
            <CardHeader>
              <div className="flex items-center gap-2">
                <Icon className="text-muted-foreground size-5" />
                <CardTitle className="text-lg">{template.name}</CardTitle>
              </div>
              <CardDescription>{template.description}</CardDescription>
            </CardHeader>
            <CardContent>
              {isSelected ? (
                <div className="flex flex-col gap-4">
                  {template.id === "fridge-invitation" && (
                    <FridgeInvitationForm defaultEmail={defaultEmail} />
                  )}
                  {template.id === "expiration-warning" && (
                    <ExpirationWarningForm defaultEmail={defaultEmail} />
                  )}
                  {template.id === "markdown" && (
                    <MarkdownEmailForm defaultEmail={defaultEmail} />
                  )}
                  <Button
                    variant="outline"
                    onClick={() => setSelectedTemplate(null)}
                  >
                    {t("form.cancel")}
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setSelectedTemplate(template.id)}
                >
                  {t("form.configure")}
                </Button>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
