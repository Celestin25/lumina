import { PrismaClient } from "@prisma/client";
import { createClient } from "@libsql/client/web";
import { PrismaLibSQL } from "@prisma/adapter-libsql";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  // Use the TURSO_DATABASE_URL from environment variables for Netlify/Production
  // Fallback to the known Turso DB url if not explicitly provided but token exists
  const remoteUrl = process.env.TURSO_DATABASE_URL || "https://lumina-db-celestin25.turso.io";
  const authToken = process.env.TURSO_AUTH_TOKEN;

  // Use the libsql adapter when TURSO_AUTH_TOKEN is present
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
