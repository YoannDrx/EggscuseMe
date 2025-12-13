import { z } from "zod";

/**
 * Schema for egg size
 */
export const EggSizeSchema = z.enum(["S", "M", "L", "XL"]);

/**
 * Schema for cooking types
 */
export const CookingTypeSchema = z.enum([
  "SOFT_BOILED",
  "POACHED",
  "RAW",
  "FRIED",
  "SCRAMBLED",
  "OMELETTE",
  "HARD_BOILED",
  "BAKING",
  "OTHER",
]);

/**
 * Schema for creating an egg box (simplified - no organizationId needed)
 */
export const CreateEggBoxSchema = z.object({
  name: z.string().max(100).optional(),
  layingDate: z.coerce.date(),
  quantity: z.number().int().min(1).max(100).default(6),
  size: z.enum(["S", "M", "L", "XL"]).default("M"),
  source: z.string().max(100).optional(),
  barcode: z.string().max(50).optional(),
  // Pro mode fields (Chef plan only)
  lotNumber: z.string().max(50).optional(),
  producerCode: z.string().max(50).optional(),
});

/**
 * Schema for updating an egg box
 */
export const UpdateEggBoxSchema = z.object({
  id: z.string(),
  name: z.string().max(100).optional(),
  quantity: z.number().int().min(1).max(100).optional(),
  remaining: z.number().int().min(0).max(100).optional(),
  size: z.enum(["S", "M", "L", "XL"]).optional(),
  source: z.string().max(100).optional(),
  // Pro mode fields (Chef plan only)
  lotNumber: z.string().max(50).optional(),
  producerCode: z.string().max(50).optional(),
});

/**
 * Schema for deleting an egg box
 */
export const DeleteEggBoxSchema = z.object({
  id: z.string(),
});

/**
 * Schema for consuming eggs
 */
export const ConsumeEggsSchema = z.object({
  eggBoxId: z.string(),
  quantity: z.number().int().min(1).max(100).default(1),
  cookingType: z.enum([
    "SOFT_BOILED",
    "POACHED",
    "RAW",
    "FRIED",
    "SCRAMBLED",
    "OMELETTE",
    "HARD_BOILED",
    "BAKING",
    "OTHER",
  ]),
  rating: z.number().int().min(1).max(5).optional(),
  notes: z.string().max(500).optional(),
});

/**
 * Schema for creating a share link
 */
export const CreateShareLinkSchema = z.object({
  expiresInDays: z.number().int().min(1).max(30).default(7),
  maxUses: z.number().int().min(1).max(100).default(5),
});

/**
 * Schema for accepting a share link
 */
export const AcceptShareLinkSchema = z.object({
  code: z.string().length(8),
});

/**
 * Schema for removing a fridge member
 */
export const RemoveMemberSchema = z.object({
  memberId: z.string(),
});

/**
 * Schema for deactivating a share link
 */
export const DeactivateShareLinkSchema = z.object({
  linkId: z.string(),
});

export type CreateEggBoxInput = z.infer<typeof CreateEggBoxSchema>;
export type UpdateEggBoxInput = z.infer<typeof UpdateEggBoxSchema>;
export type ConsumeEggsInput = z.infer<typeof ConsumeEggsSchema>;
export type CreateShareLinkInput = z.infer<typeof CreateShareLinkSchema>;
export type AcceptShareLinkInput = z.infer<typeof AcceptShareLinkSchema>;

// ==================== Email Invitation Schemas ====================

/**
 * Schema for creating an email invitation
 */
export const CreateEmailInvitationSchema = z.object({
  email: z.string().email("Email invalide"),
});

/**
 * Schema for accepting an email invitation
 */
export const AcceptEmailInvitationSchema = z.object({
  token: z.string().min(1, "Token requis"),
});

/**
 * Schema for cancelling an email invitation
 */
export const CancelEmailInvitationSchema = z.object({
  invitationId: z.string(),
});

/**
 * Schema for resending an email invitation
 */
export const ResendEmailInvitationSchema = z.object({
  invitationId: z.string(),
});

export type CreateEmailInvitationInput = z.infer<
  typeof CreateEmailInvitationSchema
>;
export type AcceptEmailInvitationInput = z.infer<
  typeof AcceptEmailInvitationSchema
>;
export type CancelEmailInvitationInput = z.infer<
  typeof CancelEmailInvitationSchema
>;
export type ResendEmailInvitationInput = z.infer<
  typeof ResendEmailInvitationSchema
>;
