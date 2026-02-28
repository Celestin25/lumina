import { prisma } from './src/lib/prisma';
import bcrypt from 'bcryptjs';
import fs from 'fs';

async function main() {
  try {
    let user = await prisma.user.findFirst({
      where: { role: 'CLIENT' }
    });
    
    if (user) {
      const hash = await bcrypt.hash('password123', 10);
      user = await prisma.user.update({
        where: { id: user.id },
        data: { password: hash }
      });
      fs.writeFileSync('client_credentials.txt', `Email: ${user.email}\nPassword: password123`);
    } else {
      const hash = await bcrypt.hash('password123', 10);
      user = await prisma.user.create({
        data: {
          email: 'testclient@example.com',
          name: 'Test Client',
          password: hash,
          role: 'CLIENT'
        }
      });
      fs.writeFileSync('client_credentials.txt', `Email: ${user.email}\nPassword: password123`);
    }
  } catch (e) {
    fs.writeFileSync('client_credentials.txt', `Error: ${e}`);
  }
}

main();
