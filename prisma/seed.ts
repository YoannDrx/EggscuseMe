import { logger } from "@/lib/logger";
import { faker } from "@faker-js/faker";
import { nanoid } from "nanoid";
import { prisma } from "../src/lib/prisma";

// Set seed for reproducibility
faker.seed(123);

async function main() {
  logger.info("Seeding database...");

  // Create 10 users with fridges
  const userCreatePromises = Array.from({ length: 10 }, async () => {
    const email = faker.internet.email();
    const userId = nanoid(11);
    const fridgeId = nanoid(11);

    // Create user
    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        id: userId,
        name: faker.person.fullName(),
        email,
        emailVerified: faker.datatype.boolean(0.8), // 80% chance of being verified
        image: faker.image.avatar(),
        createdAt: faker.date.past(),
        updatedAt: faker.date.recent(),
      },
    });

    // Create fridge for user if doesn't exist
    const existingFridge = await prisma.fridge.findFirst({
      where: { ownerId: user.id },
    });

    if (!existingFridge) {
      await prisma.fridge.create({
        data: {
          id: fridgeId,
          name: `Frigo de ${user.name}`,
          ownerId: user.id,
          isDefault: true,
          fridgeType: "MAIN",
        },
      });
    }

    return user;
  });

  const users = await Promise.all(userCreatePromises);
  users.forEach((user) => logger.info(`Created user: ${user.name}`));

  // Get all fridges
  const fridges = await prisma.fridge.findMany({
    include: { owner: true },
  });

  fridges.forEach((fridge) =>
    logger.info(`Created fridge: ${fridge.name} (owner: ${fridge.owner.name})`),
  );

  // Add some egg boxes to each fridge
  const eggBoxPromises: Promise<unknown>[] = [];

  for (const fridge of fridges) {
    const boxCount = faker.number.int({ min: 1, max: 4 });

    for (let i = 0; i < boxCount; i++) {
      const quantity = faker.helpers.arrayElement([6, 10, 12, 30]);
      const remaining = faker.number.int({ min: 0, max: quantity });
      const daysAgo = faker.number.int({ min: 0, max: 25 });

      eggBoxPromises.push(
        prisma.eggBox.create({
          data: {
            id: nanoid(11),
            name: faker.helpers.arrayElement([
              "Bio",
              "Plein air",
              "Fermier",
              "Label Rouge",
              null,
            ]),
            layingDate: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000),
            quantity,
            remaining,
            size: faker.helpers.arrayElement(["S", "M", "L", "XL"]),
            source: faker.helpers.arrayElement([
              "Carrefour",
              "Fermier local",
              "Marché",
              "Bio c'est bon",
              null,
            ]),
            userId: fridge.ownerId,
            fridgeId: fridge.id,
          },
        }),
      );
    }
  }

  await Promise.all(eggBoxPromises);
  logger.info(`Created ${eggBoxPromises.length} egg boxes`);

  // Add some fridge members (guests)
  const memberPromises: Promise<unknown>[] = [];

  // First fridge gets 2 guest members
  if (fridges.length > 0 && users.length > 2) {
    const firstFridge = fridges[0];

    for (let i = 1; i <= 2; i++) {
      const guestUser = users[i];
      if (guestUser.id !== firstFridge.ownerId) {
        memberPromises.push(
          prisma.fridgeMember
            .create({
              data: {
                id: nanoid(11),
                fridgeId: firstFridge.id,
                userId: guestUser.id,
                role: "GUEST",
              },
            })
            .then(() =>
              logger.info(
                `Added ${guestUser.name} as guest to ${firstFridge.name}`,
              ),
            )
            .catch(() => {
              // Member might already exist, ignore
            }),
        );
      }
    }
  }

  await Promise.all(memberPromises);

  logger.info("Seeding completed!");
}

main()
  .catch((e) => {
    logger.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
