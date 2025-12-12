import { prisma } from "@/lib/prisma";
import { authRoute } from "@/lib/zod-route";
import { z } from "zod";

const subscriptionSchema = z.object({
  endpoint: z.string().url(),
  keys: z.object({
    p256dh: z.string(),
    auth: z.string(),
  }),
});

export const POST = authRoute
  .body(subscriptionSchema)
  .handler(async (_req, { body, ctx }) => {
    await prisma.pushSubscription.upsert({
      where: { endpoint: body.endpoint },
      create: {
        userId: ctx.user.id,
        endpoint: body.endpoint,
        p256dh: body.keys.p256dh,
        auth: body.keys.auth,
      },
      update: {
        userId: ctx.user.id,
        p256dh: body.keys.p256dh,
        auth: body.keys.auth,
      },
    });

    return { success: true };
  });

export const DELETE = authRoute
  .body(z.object({ endpoint: z.string().url() }))
  .handler(async (_req, { body, ctx }) => {
    await prisma.pushSubscription.deleteMany({
      where: {
        endpoint: body.endpoint,
        userId: ctx.user.id,
      },
    });

    return { success: true };
  });
