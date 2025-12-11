import { prisma } from "@/lib/prisma";
import { authRoute } from "@/lib/zod-route";
import { startOfDay, subDays } from "date-fns";

export const GET = authRoute.handler(async (_req, { ctx }) => {
  const today = startOfDay(new Date());

  // Œufs pondus il y a 22-28 jours (zone orange/rouge - à consommer rapidement)
  const warningLayingDate = subDays(today, 22);
  const expiredLayingDate = subDays(today, 29);

  const expiringBoxes = await prisma.eggBox.findMany({
    where: {
      userId: ctx.user.id,
      remaining: { gt: 0 },
      layingDate: {
        lte: warningLayingDate,
        gt: expiredLayingDate,
      },
    },
    select: {
      id: true,
      name: true,
      remaining: true,
      layingDate: true,
    },
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
      layingDate: box.layingDate.toISOString(),
    })),
  };
});
