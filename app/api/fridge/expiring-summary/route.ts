import { prisma } from "@/lib/prisma";
import { getFridgeAccess } from "@/lib/fridge/get-fridge-access";
import { authRoute } from "@/lib/zod-route";
import { addDays, differenceInCalendarDays, startOfDay } from "date-fns";

export const GET = authRoute.handler(async (_req, { ctx }) => {
  const access = await getFridgeAccess(ctx.user);
  if (!access) {
    return {
      expiringCount: 0,
      totalEggsExpiring: 0,
      boxes: [],
    };
  }

  const today = startOfDay(new Date());
  const warningDcrDate = addDays(today, 6);

  const expiringBoxes = await prisma.eggBox.findMany({
    where: {
      fridgeId: access.fridge.id,
      remaining: { gt: 0 },
      dcrDate: {
        gte: today,
        lte: warningDcrDate,
      },
    },
    select: {
      id: true,
      name: true,
      remaining: true,
      dcrDate: true,
    },
    orderBy: { dcrDate: "asc" },
  });

  const totalEggsExpiring = expiringBoxes.reduce(
    (sum, box) => sum + box.remaining,
    0,
  );

  return {
    expiringCount: expiringBoxes.length,
    totalEggsExpiring,
    boxes: expiringBoxes.map((box) => ({
      id: box.id,
      name: box.name,
      remaining: box.remaining,
      dcrDate: box.dcrDate.toISOString(),
      daysRemaining: differenceInCalendarDays(startOfDay(box.dcrDate), today),
    })),
  };
});
