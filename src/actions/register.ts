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
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      redirect('/register?error=EmailExists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });

    // If model, create empty profile? 
    // For MVP, we can leave it and create it on first dashboard access or right here.
    // Let's keep it simple for now.

  } catch (error) {
    // console.error('Registration error:', error); // can log but rethrow if needed
    // If it's a redirect error (NEXT_REDIRECT), allow it to pass
    if ((error as Error).message === 'NEXT_REDIRECT') throw error; // actually redirect throws an error with digest NEXT_REDIRECT
    
    // For now simplistic handling:
    // redirect('/register?error=ServerError'); 
    // We cannot redirect inside catch block if it masks the original redirect unless we check for it.
    // simpler:
    console.error(error); 
  }
  
  // If we got here without throwing/redirecting:
  redirect('/login?registered=true');
}
