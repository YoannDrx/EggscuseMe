import { prisma } from "@/lib/prisma";
import { getFridgeAccess } from "@/lib/fridge/get-fridge-access";
import { authRoute } from "@/lib/zod-route";
import { addDays, startOfDay } from "date-fns";

export const GET = authRoute.handler(async (_req, { ctx }) => {
  const access = await getFridgeAccess(ctx.user);
  if (!access) {
    return { count: 0 };
  }

  const today = startOfDay(new Date());
  const warningDcrDate = addDays(today, 6);

  const count = await prisma.eggBox.count({
    where: {
      fridgeId: access.fridge.id,
      remaining: { gt: 0 },
      dcrDate: {
        gte: today,
        lte: warningDcrDate,
      },
    },
  });

  return { count };
});
