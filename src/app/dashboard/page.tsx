import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { cleanModelData } from '@/lib/data-utils';

export const dynamic = 'force-dynamic';

import ClientDashboardClient from './ClientDashboardClient';

export default async function ClientDashboard() {
  const session = await auth();
  if (!session?.user) redirect('/login');

  const userId = (session.user as any).id;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      bookings: {
        include: { model: true },
        orderBy: { createdAt: 'desc' },
        take: 5,
      },
      payments: {
        orderBy: { createdAt: 'desc' },
        take: 5,
      },
    },
  });

  if (!user) redirect('/login');
  if (user.role === 'MODEL') redirect('/dashboard/escort');
  if (user.role === 'ADMIN') redirect('/admin');

  const totalSpent = user.payments
    .filter(p => p.status === 'completed')
    .reduce((acc, p) => acc + p.amount, 0);

  const completedBookings = user.bookings.filter(b => b.status === 'COMPLETED').length;

  const cleanedUser = cleanModelData(user);

  return (
    <ClientDashboardClient 
      user={cleanedUser} 
      totalSpent={totalSpent} 
      completedBookings={completedBookings} 
    />
  );
}

