import { prisma } from './src/lib/prisma';

async function main() {
  console.log("Retroactively verifying all existing users...");
  try {
    const result = await prisma.user.updateMany({
      where: { emailVerified: null },
      data: { emailVerified: new Date() }
    });
    console.log(`Successfully verified ${result.count} existing users.`);
  } catch (e) {
    console.error("Database error:", e);
  } finally {
    console.log("Done.");
  }
}

main();
