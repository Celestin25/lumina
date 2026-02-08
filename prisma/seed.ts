import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding ...')
  
  // Create a sample Client
  const client = await prisma.user.upsert({
    where: { email: 'client@example.com' },
    update: {},
    create: {
      email: 'client@example.com',
      password: 'password123',
      role: 'CLIENT',
      name: 'John Doe',
    },
  })

  // Create a sample Model
  const modelUser = await prisma.user.upsert({
    where: { email: 'elena@lumina.com' },
    update: {},
    create: {
      email: 'elena@lumina.com',
      password: 'password123',
      role: 'MODEL',
      name: 'Elena',
    },
  })

  // Create Model Profile
  const modelProfile = await prisma.modelProfile.create({
    data: {
      userId: modelUser.id,
      displayName: 'Elena V.',
      bio: 'Sophisticated companion for elite events and travel. Fluent in English, French, and Italian.',
      country: 'France',
      city: 'Paris',
      age: 24,
      height: 175,
      weight: 58,
      hourlyRate: 500,
      services: {
        create: [
          { name: 'Dinner Date' },
          { name: 'Travel Companion' },
          { name: 'Overnight' }
        ]
      },
      isFeatured: true,
      isVerified: true,
      rating: 5.0,
      reviewCount: 12,
      photos: {
        create: [
          { url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2864&auto=format&fit=crop' }
        ]
      }
    }
  })

  console.log(`Created user with id: ${modelUser.id}`)
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
