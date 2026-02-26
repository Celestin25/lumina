import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

import AdminUsersClient from './AdminUsersClient';

export default async function AdminUsersPage() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== 'ADMIN') redirect('/');

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      subscriptionStatus: true,
      subscriptionPlan: true,
      createdAt: true,
      _count: { select: { bookings: true, payments: true } },
    },
  });

  return <AdminUsersClient users={users} />;
}
