import { prisma } from "@/lib/prisma";

async function globalSetup() {
  const result = await prisma.user.deleteMany({
    where: {
      email: {
        contains: "playwright-test-",
      },
    },
  });

  // eslint-disable-next-line no-console
  console.info(`[Setup] Cleaned ${result.count} residual test users`);
}

export default globalSetup;
