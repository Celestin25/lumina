import { PrismaClient } from "@prisma/client";
import { createClient } from "@libsql/client/web";
import { PrismaLibSQL } from "@prisma/adapter-libsql";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  // DATABASE_URL holds the Turso libsql:// or https:// URL in production
  // TURSO_AUTH_TOKEN holds the authentication token
  let dbUrl = process.env.DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  // Use the libsql adapter when we have a remote Turso URL + auth token
  if (dbUrl && authToken && !dbUrl.startsWith("file:")) {
    // Serverless runtimes (Vercel/Netlify) require HTTPS, not libsql://
    if (dbUrl.startsWith("libsql://")) {
      dbUrl = dbUrl.replace("libsql://", "https://");
    }

    const libsql = createClient({ url: dbUrl, authToken });
    const adapter = new PrismaLibSQL(libsql);
    return new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    } as any);
  }

  // Local development fallback: plain SQLite file
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = createPrismaClient();
}

export const prisma = globalForPrisma.prisma;

