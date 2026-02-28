import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

const RegisterSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['CLIENT', 'MODEL']),
});

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const validatedFields = RegisterSchema.safeParse(data);

    if (!validatedFields.success) {
      return NextResponse.json({ error: 'Invalid fields provided' }, { status: 400 });
    }

    const { name, email, password, role } = validatedFields.data;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, role },
    });

    if (role === 'MODEL') {
      await prisma.modelProfile.create({
        data: {
          userId: user.id,
          displayName: name,
          country: '',
          city: '',
          phone: '',
          age: 21,
          hourlyRate: 0,
        },
      });
    }

    return NextResponse.json({ 
      success: true, 
      message: "Account created! We will verify you soon." 
    });
  } catch (error: any) {
    console.error('Registration API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
