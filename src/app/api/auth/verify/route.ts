import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token }
    });

    if (!verificationToken) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 400 });
    }

    if (new Date() > verificationToken.expires) {
      return NextResponse.json({ error: 'Token has expired' }, { status: 400 });
    }

    // Mark user email as verified
    await prisma.user.update({
      where: { email: verificationToken.email },
      data: { emailVerified: new Date() }
    });

    // Delete the token so it cannot be reused
    await prisma.verificationToken.delete({
      where: { id: verificationToken.id }
    });

    return NextResponse.json({ success: true, message: 'Email has been verified successfully.' });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json({ error: 'Verification failed due to an internal error.' }, { status: 500 });
  }
}
