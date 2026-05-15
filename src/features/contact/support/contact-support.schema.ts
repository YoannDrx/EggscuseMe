import { z } from "zod";

export const ContactSupportSchema = z.object({
  firstname: z.string().max(100).optional(),
  lastname: z.string().max(100).optional(),
  email: z.string().email().max(254),
  subject: z.string().min(3).max(160),
  message: z.string().min(10).max(5000),
});

export type ContactSupportSchemaType = z.infer<typeof ContactSupportSchema>;
