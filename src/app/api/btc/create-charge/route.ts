export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

const COINBASE_API_URL = 'https://api.commerce.coinbase.com/charges';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!process.env.COINBASE_COMMERCE_API_KEY) {
      return NextResponse.json({ error: 'Bitcoin payments not configured' }, { status: 503 });
    }

    const { plan, amount } = await req.json();
    const userId = (session.user as any).id;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const planNames: Record<string, string> = {
      basic: 'Basic Listing - $49/mo',
      featured: 'Featured Listing - $99/mo',
      vip: 'VIP Elite - $199/mo',
    };

    const response = await fetch(COINBASE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CC-Api-Key': process.env.COINBASE_COMMERCE_API_KEY,
        'X-CC-Version': '2018-03-22',
      },
      body: JSON.stringify({
        name: planNames[plan] || `Lumina Plan: ${plan}`,
        description: `Lumina escort platform subscription - ${plan} plan`,
        pricing_type: 'fixed_price',
        local_price: { amount: String(amount || 49), currency: 'USD' },
        metadata: { userId, plan },
        redirect_url: `${appUrl}/dashboard/escort?btc_success=true&plan=${plan}`,
        cancel_url: `${appUrl}/pricing?canceled=true`,
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      return NextResponse.json({ error: err.error?.message || 'Failed to create charge' }, { status: 500 });
    }

    const { data } = await response.json();

    // Record pending payment
    await prisma.payment.create({
      data: {
        userId,
        amount: amount || 49,
        currency: 'USD',
        provider: 'BTC',
        status: 'pending',
        btcChargeId: data.id,
        description: `BTC Subscription: ${plan}`,
      },
    });

    return NextResponse.json({ hostedUrl: data.hosted_url, chargeId: data.id });
  } catch (error: any) {
    console.error('BTC charge error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
