import { z } from "zod";

export const EggSizeSchema = z.enum(["S", "M", "L", "XL"]);

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

export const CreateEggBoxSchema = z.object({
  name: z.string().max(100).optional(),
  layingDate: z.coerce.date(),
  quantity: z.number().int().min(1).max(100).default(6),
  size: EggSizeSchema.default("M"),
  source: z.string().max(100).optional(),
  barcode: z.string().max(50).optional(),
  organizationId: z.string().optional(),
});

export const UpdateEggBoxSchema = z.object({
  id: z.string(),
  name: z.string().max(100).optional(),
  quantity: z.number().int().min(1).max(100).optional(),
  remaining: z.number().int().min(0).max(100).optional(),
  size: EggSizeSchema.optional(),
  source: z.string().max(100).optional(),
});

export const DeleteEggBoxSchema = z.object({
  id: z.string(),
});

export const ConsumeEggsSchema = z.object({
  eggBoxId: z.string(),
  quantity: z.number().int().min(1).max(100).default(1),
  cookingType: CookingTypeSchema,
  rating: z.number().int().min(1).max(5).optional(),
  notes: z.string().max(500).optional(),
});

export const GetEggBoxesSchema = z.object({
  organizationId: z.string().optional(),
  includeExpired: z.boolean().default(false),
});

export type CreateEggBoxInput = z.infer<typeof CreateEggBoxSchema>;
export type UpdateEggBoxInput = z.infer<typeof UpdateEggBoxSchema>;
export type ConsumeEggsInput = z.infer<typeof ConsumeEggsSchema>;
