import { z } from "zod";

export const CreateInviteSchema = z.object({
  maxUses: z.number().min(1).max(100).default(5),
  expiresInDays: z.number().min(1).max(30).default(7),
});

export const AcceptInviteSchema = z.object({
  code: z.string().min(6).max(12),
});

export const DeactivateInviteSchema = z.object({
  id: z.string(),
});

export type CreateInviteInput = z.infer<typeof CreateInviteSchema>;
export type AcceptInviteInput = z.infer<typeof AcceptInviteSchema>;
