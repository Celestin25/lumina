import { PrismaClient } from "@prisma/client";
import { createClient } from "@libsql/client/web";
import { PrismaLibSQL } from "@prisma/adapter-libsql";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  let remoteUrl = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  // Use the libsql adapter when BOTH TURSO_DATABASE_URL and TURSO_AUTH_TOKEN are present
  if (remoteUrl && authToken) {
    // Netlify Serverless/Edge requires the web client, which only accepts HTTP/HTTPS
    if (remoteUrl.startsWith("libsql://")) {
      remoteUrl = remoteUrl.replace("libsql://", "https://");
    }
    
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
