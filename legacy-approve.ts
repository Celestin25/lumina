import { prisma } from './src/lib/prisma';

async function main() {
  console.log("Retroactively approving all existing users...");
  try {
    const result = await prisma.user.updateMany({
      where: { isApproved: false },
      data: { isApproved: true }
    });
    console.log(`Successfully approved ${result.count} existing users.`);
  } catch (e) {
    console.error("Database error:", e);
  } finally {
    console.log("Done.");
  }
}

main();
