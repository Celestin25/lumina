import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const photos = await prisma.photo.findMany();
  let maxPhoto = 0;
  let maxPhotoId = '';
  
  for (const p of photos) {
    if (p.url && p.url.length > maxPhoto) {
      maxPhoto = p.url.length;
      maxPhotoId = p.id;
    }
  }
  
  console.log(`Photos count: ${photos.length}`);
  console.log(`Max Photo URL Length: ${maxPhoto} on ID: ${maxPhotoId}`);
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
