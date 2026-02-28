import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  try {
    const user = await prisma.user.findUnique({
      where: { id: resolvedParams.id },
      select: { image: true },
    });

    if (!user || !user.image) {
      return new NextResponse('Not Found', { status: 404 });
    }

    if (user.image.startsWith('http')) {
      return NextResponse.redirect(user.image);
    }

    if (user.image.startsWith('data:image')) {
      const matches = user.image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        return new NextResponse('Invalid Format', { status: 400 });
      }
      const buffer = Buffer.from(matches[2], 'base64');
      return new NextResponse(buffer, {
        headers: {
          'Content-Type': matches[1],
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }

    return new NextResponse('Unsupported format', { status: 400 });
  } catch (error) {
    console.error('Avatar API Error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
