'use server';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { prisma } from '@/lib/prisma';

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
): Promise<string | undefined> {
  try {
    const email = formData.get('email') as string;
    let redirectTo = '/dashboard';

    if (email) {
      const user = await prisma.user.findUnique({
        where: { email },
        select: { role: true },
      });

      if (user?.role === 'ADMIN') redirectTo = '/admin';
      else if (user?.role === 'MODEL') redirectTo = '/dashboard/escort';
    }
    
    await signIn('credentials', {
      ...Object.fromEntries(formData),
      redirectTo,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      console.error("AuthError caught in login:", error.type, error);
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
