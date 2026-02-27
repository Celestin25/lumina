export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { worldLocations, servicesList, modelNames, bios, photoUrls } from '@/locations/data';
import bcrypt from 'bcryptjs';

const random = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];
const randomSubset = (arr: any[], count: number) => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

export async function GET() {
  try {
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    // 1. Remove previously seeded models to prevent duplicates
    await prisma.user.deleteMany({
      where: {
        role: 'MODEL',
        email: { endsWith: '@lumina.com' }
      }
    });

    // 2. Shuffle photos strictly so we only use each photo exactly once
    const uniquePhotos = [...photoUrls].sort(() => 0.5 - Math.random());
    
    // 3. Flat list of all available cities for random assignment
    const allCities = [...worldLocations].flatMap(loc => 
      loc.cities.map(city => ({ city, country: loc.country }))
    );

    let seededCount = 0;
    
    // 4. Create up to the length of our unique photo pool (20)
    for (let i = 0; i < uniquePhotos.length; i++) {
        const photoUrl = uniquePhotos[i];
        const location = random(allCities);
        const name = random(modelNames);
        const email = `${name.toLowerCase()}.${location.city.replace(' ', '').toLowerCase()}${randomInt(1, 999)}@lumina.com`;
        
        try {
            const user = await prisma.user.upsert({
                where: { email },
                update: {},
                create: {
                    email,
                    password: hashedPassword,
                    role: 'MODEL',
                    name: name,
                },
            });

            const hourlyRate = randomInt(200, 1000);
            const services = randomSubset(servicesList, 4).map((s: string) => ({ name: s }));

             await prisma.modelProfile.create({
                data: {
                    userId: user.id,
                    displayName: `${name} ${String.fromCharCode(65 + randomInt(0, 25))}.`,
                    bio: random(bios),
                    country: location.country,
                    city: location.city,
                    phone: '',
                    age: randomInt(20, 30),
                    height: randomInt(165, 180),
                    weight: randomInt(50, 65),
                    hourlyRate,
                    isFeatured: Math.random() > 0.4,
                    isVerified: Math.random() > 0.2,
                    rating: 4.5 + (Math.random() * 0.5),
                    reviewCount: randomInt(5, 100),
                    services: { create: services },
                    photos: { create: [{ url: photoUrl }] }
                }
            });
            seededCount++;
        } catch (e) {
            console.warn(`Skipping duplicate for ${email}`);
        }
    }

    return NextResponse.json({ success: true, message: `Successfully cleared duplicates and seeded ${seededCount} unique, diverse models into the live database.` });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
