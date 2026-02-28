export const dynamic = 'force-dynamic';

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

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const escortId = searchParams.get('escortId');
  if (!escortId) return NextResponse.json({ error: 'Missing escortId' }, { status: 400 });

  try {
    const escort = await prisma.modelProfile.findUnique({ where: { id: escortId } });
    if (!escort) return NextResponse.json({ error: 'Model not found' }, { status: 404 });

    // Assuming cascading deletes are configured on the User model
    // However, it's safer to delete the User explicitly to clean up everything
    await prisma.user.delete({
      where: { id: escort.userId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete model error:', error);
    return NextResponse.json({ error: 'Failed to delete model' }, { status: 500 });
  }
}
