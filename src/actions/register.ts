'use server';

import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

const RegisterSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['CLIENT', 'MODEL']),
});

export async function registerUser(formData: FormData) {
  const data = Object.fromEntries(formData);
  
  const validatedFields = RegisterSchema.safeParse(data);

  if (!validatedFields.success) {
    redirect('/register?error=InvalidFields');
  }

  const { name, email, password, role } = validatedFields.data;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) redirect('/register?error=EmailExists');

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, role },
    });

    // Auto-create a ModelProfile stub for escort accounts
    if (role === 'MODEL') {
      await prisma.modelProfile.create({
        data: {
          userId: user.id,
          displayName: name,
          country: '',
          city: '',
          age: 21,
          hourlyRate: 0,
        },
      });
    }

  } catch (error: any) {
    // Re-throw Next.js redirect errors so they work correctly
    if (error?.digest?.startsWith('NEXT_REDIRECT')) throw error;
    console.error('Registration error:', error);
    redirect('/register?error=ServerError');
  }
  
  redirect('/login?registered=true');
}
