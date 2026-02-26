import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('STRIPE_SECRET_KEY is not set. Stripe features will be disabled.');
}

export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-06-20' as any,
      typescript: true,
    })
  : null;

export const STRIPE_PLANS = {
  basic: {
    name: 'Basic Listing',
    priceId: process.env.STRIPE_ESCORT_BASIC_PRICE_ID || '',
    price: 49,
    features: ['Listed in directory', 'Up to 5 photos', 'Basic profile', 'Standard support'],
  },
  featured: {
    name: 'Featured Listing',
    priceId: process.env.STRIPE_ESCORT_FEATURED_PRICE_ID || '',
    price: 99,
    features: ['Featured placement', 'Up to 20 photos', 'Priority listing', 'Badge verification', 'Priority support'],
  },
  vip: {
    name: 'VIP Elite',
    priceId: process.env.STRIPE_ESCORT_VIP_PRICE_ID || '',
    price: 199,
    features: ['Top placement', 'Unlimited photos', 'Homepage featured', 'VIP badge', '24/7 support', 'Analytics dashboard'],
  },
} as const;

export type PlanKey = keyof typeof STRIPE_PLANS;
