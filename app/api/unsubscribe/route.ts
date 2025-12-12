import { prisma } from "@/lib/prisma";
import { route } from "@/lib/zod-route";
import { NextResponse } from "next/server";
import { z } from "zod";

/**
 * Unsubscribe endpoint for email notifications (RGPD compliance)
 *
 * GET /api/unsubscribe?token=xxx
 */
export const GET = route
  .query(z.object({ token: z.string().min(1) }))
  .handler(async (_req, { query }) => {
    const { token } = query;

    // Find user by unsubscribe token
    const user = await prisma.user.findUnique({
      where: { unsubscribeToken: token },
      select: { id: true, email: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired unsubscribe link" },
        { status: 400 },
      );
    }

    // Disable email notifications for this user
    await prisma.userPreferences.upsert({
      where: { userId: user.id },
      update: { emailEnabled: false },
      create: {
        userId: user.id,
        emailEnabled: false,
      },
    });

    // Redirect to a confirmation page
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ?? "https://eggscuseme.app";
    return NextResponse.redirect(`${baseUrl}/unsubscribed`);
  });
