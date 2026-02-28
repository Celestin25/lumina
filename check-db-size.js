const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const models = await prisma.modelProfile.findMany();
  let maxBio = 0;
  let maxName = 0;
  let bioId = '';
  
  for (const m of models) {
    if (m.bio && m.bio.length > maxBio) {
      maxBio = m.bio.length;
      bioId = m.id;
    }
    if (m.displayName && m.displayName.length > maxName) {
      maxName = m.displayName.length;
    }
  }
  
  console.log(`Max Bio Length: ${maxBio} on ID: ${bioId}`);
  console.log(`Max DisplayName Length: ${maxName}`);
  
  const users = await prisma.user.findMany();
  let maxUserImage = 0;
  let maxUserImageId = '';
  for (const u of users) {
    if (u.image && u.image.length > maxUserImage) {
      maxUserImage = u.image.length;
      maxUserImageId = u.id;
    }
  }
  console.log(`Max User Image Length: ${maxUserImage} on User ID: ${maxUserImageId}`);
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
