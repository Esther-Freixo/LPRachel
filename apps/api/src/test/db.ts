import { PrismaClient } from "@prisma/client";

const url = process.env.DATABASE_URL_TEST;
if (!url) throw new Error("[test] DATABASE_URL_TEST não definido");

export const testPrisma = new PrismaClient({ datasources: { db: { url } } });

export async function resetTimeline(): Promise<void> {
  await testPrisma.timeline.deleteMany();
}
