import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user || user.role !== 'MODEL') {
      return NextResponse.json({ error: 'Only escort accounts can set up profiles' }, { status: 403 });
    }

    const {
      displayName, bio, country, city, age, height, weight,
      hourlyRate, btcAddress, services, photoUrls,
    } = await req.json();

    if (!displayName || !country || !city || !hourlyRate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Parse services
    const serviceList = services
      ? services.split(',').map((s: string) => s.trim()).filter(Boolean)
      : [];

    // Parse photo URLs
    const photoList = photoUrls
      ? photoUrls.split('\n').map((u: string) => u.trim()).filter(Boolean)
      : [];

    // Upsert ModelProfile
    const existing = await prisma.modelProfile.findUnique({ where: { userId } });

    if (existing) {
      // Delete existing photos and services first
      await prisma.photo.deleteMany({ where: { modelId: existing.id } });
      await prisma.service.deleteMany({ where: { modelId: existing.id } });

      await prisma.modelProfile.update({
        where: { userId },
        data: {
          displayName,
          bio: bio || null,
          country,
          city,
          age: parseInt(age) || 21,
          height: height ? parseInt(height) : null,
          weight: weight ? parseInt(weight) : null,
          hourlyRate: parseFloat(hourlyRate),
          btcAddress: btcAddress || null,
          photos: { create: photoList.map((url: string) => ({ url })) },
          services: { create: serviceList.map((name: string) => ({ name })) },
        },
      });
    } else {
      await prisma.modelProfile.create({
        data: {
          userId,
          displayName,
          bio: bio || null,
          country,
          city,
          age: parseInt(age) || 21,
          height: height ? parseInt(height) : null,
          weight: weight ? parseInt(weight) : null,
          hourlyRate: parseFloat(hourlyRate),
          btcAddress: btcAddress || null,
          photos: { create: photoList.map((url: string) => ({ url })) },
          services: { create: serviceList.map((name: string) => ({ name })) },
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Profile save error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
