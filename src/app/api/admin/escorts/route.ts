import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { escortId, isVerified, isFeatured, isActive } = await req.json();
  if (!escortId) return NextResponse.json({ error: 'Missing escortId' }, { status: 400 });

  const data: any = {};
  if (typeof isVerified === 'boolean') data.isVerified = isVerified;
  if (typeof isFeatured === 'boolean') data.isFeatured = isFeatured;
  if (typeof isActive === 'boolean') data.isActive = isActive;

  const updated = await prisma.modelProfile.update({
    where: { id: escortId },
    data,
  });

  return NextResponse.json({ success: true, escort: updated });
}
