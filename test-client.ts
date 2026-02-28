import { prisma } from './src/lib/prisma';
import bcrypt from 'bcryptjs';

async function main() {
  console.log("Checking for a CLIENT user...");
  try {
    let user = await prisma.user.findFirst({
      where: { role: 'CLIENT' }
    });
    
    if (user) {
      console.log("Found existing client users:");
      console.log(`Email: ${user.email}`);
      // Password is encrypted so we can't show it but we can update it to something known
      const hash = await bcrypt.hash('password123', 10);
      user = await prisma.user.update({
        where: { id: user.id },
        data: { password: hash }
      });
      console.log("Updated password to: password123");
    } else {
      console.log("No client user found. Creating one...");
      const hash = await bcrypt.hash('password123', 10);
      user = await prisma.user.create({
        data: {
          email: 'client@example.com',
          name: 'Test Client',
          password: hash,
          role: 'CLIENT'
        }
      });
      console.log("Created test client:");
      console.log(`Email: ${user.email}`);
      console.log(`Password: password123`);
    }
  } catch (e) {
    console.error("Database error:", e);
  } finally {
    console.log("Done.");
  }
}

main();
