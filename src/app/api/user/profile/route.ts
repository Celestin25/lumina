export const dynamic = 'force-dynamic';
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
    const { name, image } = await req.json();

    await prisma.user.update({
      where: { id: userId },
      data: {
        name: name || undefined,
        image: image || undefined,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('User profile update error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
