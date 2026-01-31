import { z } from "zod";

export const NewsletterSubscribeSchema = z.object({
  email: z.string().email(),
  locale: z.string().optional().default("fr"),
  source: z.string().optional().default("landing"),
});

export type NewsletterSubscribeInput = z.infer<
  typeof NewsletterSubscribeSchema
>;
