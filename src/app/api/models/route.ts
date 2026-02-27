export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';


import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const country = searchParams.get('country');
  const city = searchParams.get('city');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const ethnicity = searchParams.get('ethnicity');

  try {
    const where: any = {
      isVerified: true,
    };

    if (country) {
      where.country = { contains: country };
    }
    
    if (city) {
      where.city = { contains: city };
    }

    if (ethnicity) {
      where.ethnicity = { contains: ethnicity };
    }

    if (minPrice || maxPrice) {
      where.hourlyRate = {};
      if (minPrice) where.hourlyRate.gte = parseFloat(minPrice);
      if (maxPrice) where.hourlyRate.lte = parseFloat(maxPrice);
    }

    const models = await prisma.modelProfile.findMany({
      where,
      include: {
        photos: true,
        services: true,
        user: { select: { name: true, email: true } }
      },
    });

    return NextResponse.json(models);
  } catch (error) {
    console.error('Error fetching models:', error);
    return NextResponse.json({ error: 'Failed to fetch models' }, { status: 500 });
  }
}
