import { createClient } from "@libsql/client/web";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { PrismaClient } from "@prisma/client";

async function main() {
  const remoteUrl = "https://lumina-db-celestin25.turso.io";
  const authToken = process.env.TURSO_AUTH_TOKEN;

  console.log("Connecting using:", remoteUrl);
  
  const libsql = createClient({ url: remoteUrl, authToken });
  const adapter = new PrismaLibSQL(libsql);
  const prisma = new PrismaClient({ adapter });

  try {
    const models = await prisma.modelProfile.findMany({ take: 1 });
    console.log("Connected successfully. Found models:", models.length);
  } catch (error) {
    console.error("Connection failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
