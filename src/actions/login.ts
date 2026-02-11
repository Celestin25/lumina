'use server';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';

export async function authenticate(formData: FormData) {
  try {
    const email = formData.get('email') as string;
    let redirectTo = '/';

    if (email) {
      const user = await prisma.user.findUnique({
        where: { email },
        select: { role: true }
      });

      if (user?.role === 'ADMIN') {
        redirectTo = '/admin';
      }
    }
    
    await signIn('credentials', {
      ...Object.fromEntries(formData),
      redirectTo,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}
