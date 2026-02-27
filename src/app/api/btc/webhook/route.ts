export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createHmac } from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get('x-cc-webhook-signature');

    if (!process.env.COINBASE_COMMERCE_WEBHOOK_SECRET) {
      return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 503 });
    }

    // Verify signature
    const expectedSig = createHmac('sha256', process.env.COINBASE_COMMERCE_WEBHOOK_SECRET)
      .update(body)
      .digest('hex');

    if (signature !== expectedSig) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const { event } = JSON.parse(body);
    const { type, data } = event;

    if (type === 'charge:confirmed' || type === 'charge:resolved') {
      const { metadata, id: chargeId } = data;
      const userId = metadata?.userId;
      const plan = metadata?.plan;

      if (!userId || !plan) {
        return NextResponse.json({ received: true });
      }

      // Update payment record
      await prisma.payment.updateMany({
        where: { btcChargeId: chargeId },
        data: { status: 'completed' },
      });

      // Update user subscription
      await prisma.user.update({
        where: { id: userId },
        data: { subscriptionStatus: 'active', subscriptionPlan: plan },
      });

      const periodEnd = new Date();
      periodEnd.setMonth(periodEnd.getMonth() + 1);

      await prisma.subscription.upsert({
        where: { id: `${userId}-${plan}-btc` },
        update: { status: 'active', currentPeriodEnd: periodEnd },
        create: {
          id: `${userId}-${plan}-btc`,
          userId,
          plan,
          status: 'active',
          provider: 'BTC',
          currentPeriodStart: new Date(),
          currentPeriodEnd: periodEnd,
        },
      });

      // Update profile featured status
      if (plan === 'featured' || plan === 'vip') {
        const user = await prisma.user.findUnique({
          where: { id: userId },
          include: { modelProfile: true },
        });
        if (user?.modelProfile) {
          await prisma.modelProfile.update({
            where: { id: user.modelProfile.id },
            data: { isFeatured: true, isVerified: true },
          });
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('BTC webhook error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
