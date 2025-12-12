import { z } from "zod";

export const UpdateNotificationPreferencesSchema = z.object({
  notifyEnabled: z.boolean(),
  notifyDaysBefore: z.number().min(1).max(7),
  emailEnabled: z.boolean().optional(),
  pushEnabled: z.boolean().optional(),
});

export type UpdateNotificationPreferencesInput = z.infer<
  typeof UpdateNotificationPreferencesSchema
>;

export const NotificationPreferencesSchema = z.object({
  notifyEnabled: z.boolean(),
  notifyDaysBefore: z.number(),
  emailEnabled: z.boolean(),
  pushEnabled: z.boolean(),
});

export type NotificationPreferences = z.infer<
  typeof NotificationPreferencesSchema
>;
