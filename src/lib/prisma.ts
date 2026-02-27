import { PrismaClient } from "@prisma/client";
import { createClient } from "@libsql/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  // Hardcode the Turso Remote URL here so the app always uses production data
  // but Prisma's strict string validation locally (which checks process.env.DATABASE_URL) is tricked
  const remoteUrl = "libsql://lumina-db-celestin25.aws-us-east-1.turso.io";
  const authToken = process.env.TURSO_AUTH_TOKEN;

  // Use the libsql adapter when DATABASE_URL is a remote Turso URL
  // v5.x: PrismaLibSQL takes a Client instance (from createClient)
  if (authToken) {
    const libsql = createClient({ url: remoteUrl, authToken });
    const adapter = new PrismaLibSQL(libsql);
    return new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    } as any);
  }

  // Fallback to regular local SQLite for local development
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

let prismaClientInstance: PrismaClient | undefined;

export const prisma = new Proxy({} as PrismaClient, {
  get(target, prop) {
    if (!prismaClientInstance) {
      prismaClientInstance = globalForPrisma.prisma ?? createPrismaClient();
      if (process.env.NODE_ENV !== "production") {
        globalForPrisma.prisma = prismaClientInstance;
      }
    }
    return (prismaClientInstance as any)[prop];
  }
});
