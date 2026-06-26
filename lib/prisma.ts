import { PrismaClient } from '../generated/prisma/client'
// Para evitar crear múltiples instancias de PrismaClient 
// en desarrollo, lo guardamos en una variable global
import { PrismaPg } from '@prisma/adapter-pg'
// Singleton pattern to avoid multiple instances in development (hot-reload)
const globalForPrisma = globalThis as unknown as {
  prisma: InstanceType<typeof PrismaClient> | undefined;
};

function createPrismaClient() {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
  });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}