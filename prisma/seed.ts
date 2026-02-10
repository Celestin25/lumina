import { PrismaClient } from '@prisma/client'
import { africanLocations, worldLocations, servicesList, modelNames, bios, photoUrls } from '../src/locations/data'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// Helper to get random item from array
const random = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];
// Helper to get random subset
const randomSubset = (arr: any[], count: number) => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

async function main() {
  console.log('Start seeding ...')
  
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  // Cleanup existing data (optional, but good for clean state)
  // await prisma.review.deleteMany({});
  // await prisma.booking.deleteMany({});
  // await prisma.photo.deleteMany({});
  // await prisma.service.deleteMany({});
  // await prisma.modelProfile.deleteMany({});
  // await prisma.user.deleteMany({}); 
  // COMMENTED OUT to avoid accidental data loss during dev if not intended, but usually good for seed.
  // For this run, let's assume we append or upsert.

  // Create/Ensure Client
  const client = await prisma.user.upsert({
    where: { email: 'client@example.com' },
    update: {
      password: hashedPassword
    },
    create: {
      email: 'client@example.com',
      password: hashedPassword,
      role: 'CLIENT',
      name: 'John Doe',
    },
  });

  // Create Admin User
  const admin = await prisma.user.upsert({
    where: { email: 'admin@lumina.com' },
    update: {
      password: hashedPassword
    },
    create: {
      email: 'admin@lumina.com',
      password: hashedPassword,
      role: 'ADMIN',
      name: 'Admin User',
    },
  });
  console.log('Created Admin User: admin@lumina.com / password123');

  // Seed African Models
  for (const loc of africanLocations) {
    for (const city of loc.cities) {
        // Create 1-2 models per city
        const numModels = randomInt(1, 2);
        for (let i = 0; i < numModels; i++) {
            const name = random(modelNames);
            const email = `${name.toLowerCase()}.${city.replace(' ', '').toLowerCase()}${randomInt(1, 999)}@lumina.com`;
            
            try {
                const user = await prisma.user.upsert({
                    where: { email },
                    update: {
                        password: hashedPassword
                    },
                    create: {
                        email,
                        password: hashedPassword,
                        role: 'MODEL',
                        name: name,
                    },
                });

                const hourlyRate = randomInt(100, 500);
                const services = randomSubset(servicesList, 3).map((s: string) => ({ name: s }));
                const photoUrl = random(photoUrls);

                await prisma.modelProfile.upsert({
                    where: { userId: user.id },
                    update: {},
                    create: {
                        userId: user.id,
                        displayName: `${name} ${String.fromCharCode(65 + randomInt(0, 25))}.`,
                        bio: random(bios),
                        country: loc.country,
                        city: city,
                        age: randomInt(19, 35),
                        height: randomInt(160, 185),
                        weight: randomInt(45, 75),
                        hourlyRate,
                        isFeatured: Math.random() > 0.8,
                        isVerified: Math.random() > 0.3,
                        rating: 4 + Math.random(),
                        reviewCount: randomInt(0, 50),
                        services: { create: services },
                        photos: { create: [{ url: photoUrl }] }
                    }
                });
                console.log(`Seeded model in ${city}, ${loc.country}`);
            } catch (e) {
                console.warn(`Skipping duplicate or error for ${email}`);
            }
        }
    }
  }

  // Seed World Models
  for (const loc of worldLocations) {
    for (const city of loc.cities) {
        // Create 1 model per city
        const name = random(modelNames);
        const email = `${name.toLowerCase()}.${city.replace(' ', '').toLowerCase()}${randomInt(1, 999)}@lumina.com`;
        
        try {
            const user = await prisma.user.upsert({
                where: { email },
                update: {},
                create: {
                    email,
                    password: 'password123',
                    role: 'MODEL',
                    name: name,
                },
            });

            const hourlyRate = randomInt(200, 1000);
            const services = randomSubset(servicesList, 4).map((s: string) => ({ name: s }));
            const photoUrl = random(photoUrls);

             await prisma.modelProfile.upsert({
                where: { userId: user.id },
                update: {},
                create: {
                    userId: user.id,
                    displayName: `${name} ${String.fromCharCode(65 + randomInt(0, 25))}.`,
                    bio: random(bios),
                    country: loc.country,
                    city: city,
                    age: randomInt(20, 30),
                    height: randomInt(165, 180),
                    weight: randomInt(50, 65),
                    hourlyRate,
                    isFeatured: Math.random() > 0.7,
                    isVerified: Math.random() > 0.5,
                    rating: 4.5 + (Math.random() * 0.5),
                    reviewCount: randomInt(5, 100),
                    services: { create: services },
                    photos: { create: [{ url: photoUrl }] }
                }
            });
            console.log(`Seeded model in ${city}, ${loc.country}`);
        } catch (e) {
            console.warn(`Skipping duplicate for ${email}`);
        }
    }
  }

  console.log('Seeding finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
