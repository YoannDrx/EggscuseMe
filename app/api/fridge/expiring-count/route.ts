import { prisma } from "@/lib/prisma";
import { authRoute } from "@/lib/zod-route";
import { startOfDay, subDays } from "date-fns";

export const GET = authRoute.handler(async (_req, { ctx }) => {
  const today = startOfDay(new Date());

  // Œufs pondus il y a 22-28 jours (zone orange/rouge - à consommer rapidement)
  const warningLayingDate = subDays(today, 22); // Pondus il y a 22 jours ou plus
  const expiredLayingDate = subDays(today, 29); // Pondus il y a 29 jours = périmés

  const count = await prisma.eggBox.count({
    where: {
      userId: ctx.user.id,
      remaining: { gt: 0 }, // Il reste des œufs
      layingDate: {
        lte: warningLayingDate, // Pondus il y a au moins 22 jours
        gt: expiredLayingDate, // Mais pas encore périmés (< 29 jours)
      },
    },
  });

  return { count };
});
