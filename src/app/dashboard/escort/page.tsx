import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

import EscortDashboardClient from './EscortDashboardClient';

export default async function EscortDashboard() {
  const session = await auth();
  if (!session?.user) redirect('/login');

  const userId = (session.user as any).id;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      modelProfile: {
        include: { photos: true, services: true },
      },
      payments: {
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
      subscriptions: {
        where: { status: 'active' },
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
  });

  if (!user) redirect('/login');
  if (user.role === 'CLIENT') redirect('/dashboard');
  if (user.role === 'ADMIN') redirect('/admin');

  const earnings = user.payments
    .filter(p => p.status === 'completed')
    .reduce((acc, p) => acc + p.amount, 0);

  const activeSubscription = user.subscriptions[0] || null;

  // WARNING: We must NOT pass massive Base64 strings to the Client Component natively, Netlify will crash!
  if (user.modelProfile && user.modelProfile.photos) {
    user.modelProfile.photos = user.modelProfile.photos.map((p: any) => ({
      ...p,
      url: p.url.startsWith('data:') ? `/api/photos/${p.id}` : p.url,
    }));
  }

  return (
    <EscortDashboardClient
      user={user}
      profile={user.modelProfile}
      subscription={activeSubscription}
      earnings={earnings}
      recentPayments={user.payments}
    />
  );
}
