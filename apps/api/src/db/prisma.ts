import { PrismaClient } from "@prisma/client";

// Singleton — toda query passa por aqui. Evita múltiplas conexões em dev/HMR.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma: PrismaClient = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
