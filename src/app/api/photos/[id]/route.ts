import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  
  try {
    const photo = await prisma.photo.findUnique({
      where: { id: resolvedParams.id },
    });

    if (!photo || !photo.url) {
      return new NextResponse('Not Found', { status: 404 });
    }

    // If it's a standard URL, just redirect
    if (photo.url.startsWith('http')) {
      return NextResponse.redirect(photo.url);
    }

    // If it's a Base64 string, decode and return image bytes
    if (photo.url.startsWith('data:image')) {
      const matches = photo.url.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        return new NextResponse('Invalid image format', { status: 400 });
      }

      const mime = matches[1];
      const data = matches[2];
      const buffer = Buffer.from(data, 'base64');

      return new NextResponse(buffer, {
        headers: {
          'Content-Type': mime,
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }

    return new NextResponse('Unsupported format', { status: 400 });
  } catch (error) {
    console.error('Photo API Error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
