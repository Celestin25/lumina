export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const profile = await prisma.modelProfile.findUnique({
      where: { userId },
      include: {
        photos: true,
        services: true,
      },
    });

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Convert photos and services back to string format for the form
    const formData = {
      displayName: profile.displayName,
      bio: profile.bio || '',
      country: profile.country,
      city: profile.city,
      phone: profile.phone,
      age: profile.age.toString(),
      height: profile.height?.toString() || '',
      weight: profile.weight?.toString() || '',
      hourlyRate: profile.hourlyRate.toString(),
      ethnicity: profile.ethnicity || '',
      btcAddress: profile.btcAddress || '',
      services: profile.services.map(s => s.name).join(', '),
      photoUrls: profile.photos.map(p => p.url).join('\n'),
    };

    return NextResponse.json(formData);
  } catch (error: any) {
    console.error('Profile fetch error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

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
      displayName, bio, country, city, phone, age, height, weight,
      hourlyRate, btcAddress, services, photoUrls, ethnicity
    } = await req.json();

    if (!displayName || !country || !city || !phone || !hourlyRate) {
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

    const profileData = {
      displayName,
      bio: bio || null,
      country,
      city,
      phone,
      age: parseInt(age) || 21,
      height: height ? parseInt(height) : null,
      weight: weight ? parseInt(weight) : null,
      hourlyRate: parseFloat(hourlyRate),
      ethnicity: ethnicity || null,
      btcAddress: btcAddress || null,
      photos: { create: photoList.map((url: string) => ({ url })) },
      services: { create: serviceList.map((name: string) => ({ name })) },
    };

    if (existing) {
      // Delete existing photos and services first
      await prisma.photo.deleteMany({ where: { modelId: existing.id } });
      await prisma.service.deleteMany({ where: { modelId: existing.id } });

      await prisma.modelProfile.update({
        where: { userId },
        data: profileData,
      });
    } else {
      await prisma.modelProfile.create({
        data: {
          userId,
          ...profileData,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Profile save error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
