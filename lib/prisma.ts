import "dotenv/config"
import { PrismaClient } from "../app/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
  adapter: PrismaPg | undefined
}

const adapter =
  globalForPrisma.adapter ??
  new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
    connectionTimeoutMillis: 15000,
  })

const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  })

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
  globalForPrisma.adapter = adapter
}

export default prisma