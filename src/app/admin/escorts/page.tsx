import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

import AdminEscortsClient from './AdminEscortsClient';

export default async function AdminEscortsPage() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== 'ADMIN') redirect('/');

  const escorts = await prisma.modelProfile.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: { email: true, subscriptionStatus: true, subscriptionPlan: true },
      },
      _count: { select: { reviews: true, bookings: true } },
    },
  });

  return <AdminEscortsClient escorts={escorts} />;
}
