import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    if (!stripe) {
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 });
    }

    const body = await req.text();
    const sig = req.headers.get('stripe-signature');

    if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
      return NextResponse.json({ error: 'Missing signature or secret' }, { status: 400 });
    }

    let event: any;
    try {
      event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    const eventData = event.data?.object as any;

    switch (event.type) {
      case 'checkout.session.completed': {
        const userId = eventData.metadata?.userId;
        const plan = eventData.metadata?.plan;

        if (userId && plan && eventData.subscription) {
          const sub = await stripe.subscriptions.retrieve(eventData.subscription as string) as any;
          
          await prisma.user.update({
            where: { id: userId },
            data: {
              subscriptionStatus: 'active',
              subscriptionPlan: plan,
            },
          });

          await prisma.subscription.upsert({
            where: { id: `${userId}-${plan}` },
            update: {
              status: 'active',
              stripeSubId: sub.id,
              currentPeriodStart: new Date(sub.current_period_start * 1000),
              currentPeriodEnd: new Date(sub.current_period_end * 1000),
            },
            create: {
              id: `${userId}-${plan}`,
              userId,
              plan,
              status: 'active',
              provider: 'STRIPE',
              stripeSubId: sub.id,
              currentPeriodStart: new Date(sub.current_period_start * 1000),
              currentPeriodEnd: new Date(sub.current_period_end * 1000),
            },
          });

          // Update ModelProfile visibility for featured/vip
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

          // Record payment
          await prisma.payment.create({
            data: {
              userId,
              amount: (eventData.amount_total || 0) / 100,
              currency: (eventData.currency || 'usd').toUpperCase(),
              provider: 'STRIPE',
              status: 'completed',
              stripePayId: eventData.payment_intent as string,
              description: `Subscription: ${plan}`,
            },
          });
        }
        break;
      }

      case 'customer.subscription.updated': {
        const userId = eventData.metadata?.userId;
        if (userId) {
          await prisma.user.update({
            where: { id: userId },
            data: { subscriptionStatus: eventData.status },
          });
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const userId = eventData.metadata?.userId;
        if (userId) {
          await prisma.user.update({
            where: { id: userId },
            data: { subscriptionStatus: 'inactive', subscriptionPlan: null },
          });
          const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { modelProfile: true },
          });
          if (user?.modelProfile) {
            await prisma.modelProfile.update({
              where: { id: user.modelProfile.id },
              data: { isFeatured: false },
            });
          }
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
