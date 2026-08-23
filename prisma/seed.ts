import { PrismaClient, Prisma } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import "dotenv/config";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

export async function main() {
  console.log("Seeding started...");

  const password = await bcrypt.hash("123", 12);

  const userData: Prisma.UserCreateInput[] = [
    {
      email: "user@example.com",
      password,
      name: "Normal User",
      role: "USER",
    },
    {
      email: "admin@example.com",
      password,
      name: "Admin User",
      role: "ADMIN",
    },
  ];

  for (const u of userData) {
    await prisma.user.upsert({
      where: { email: u.email! },
      update: { password },
      create: u,
    });
  }

  console.log("Seeding finished.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });