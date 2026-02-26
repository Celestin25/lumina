'use client';

import { useState } from 'react';
import styles from './pricing.module.css';

const plans = [
  {
    key: 'basic',
    name: 'Basic',
    price: 49,
    color: '#6366f1',
    description: 'Perfect for getting started',
    features: [
      'Listed in escort directory',
      'Up to 5 profile photos',
      'Standard search placement',
      'Contact via platform',
      'Basic profile analytics',
    ],
  },
  {
    key: 'featured',
    name: 'Featured',
    price: 99,
    color: '#f59e0b',
    popular: true,
    description: 'Most popular for serious escorts',
    features: [
      'Featured placement in search',
      'Up to 20 profile photos',
      'Verified ✓ badge',
      'Priority in search results',
      'Contact via platform',
      'Full profile analytics',
      'Review system access',
    ],
  },
  {
    key: 'vip',
    name: 'VIP Elite',
    price: 199,
    color: '#d4af37',
    description: 'Maximum visibility & premium support',
    features: [
      'Top of search results',
      'Unlimited photos',
      'Homepage feature placement',
      'VIP ✦ badge',
      'Verified ✓ badge',
      'Priority client matching',
      'Advanced analytics',
      '24/7 dedicated support',
    ],
  },
];

// Monthly = per-month price  |  Annual = total yearly price (20% off, paid upfront — naturally higher number)
const getPrice = (base: number, billing: 'monthly' | 'annual') =>
  billing === 'annual' ? Math.round(base * 12 * 0.8) : base;

const getPeriodLabel = (billing: 'monthly' | 'annual') =>
  billing === 'annual' ? '/year' : '/mo';


export default function PricingPage() {
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly');
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (plan: string, provider: 'stripe' | 'btc') => {
    setLoading(`${plan}-${provider}`);
    try {
      if (provider === 'stripe') {
        const res = await fetch('/api/stripe/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ plan }),
        });
        const { url, error } = await res.json();
        if (error) {
          if (error.includes('not configured')) {
            alert('Payment processing is being configured. Please check back soon or contact us directly.');
            return;
          }
          throw new Error(error);
        }
        window.location.href = url;
      } else {
        const amounts: Record<string, number> = { basic: 49, featured: 99, vip: 199 };
        const res = await fetch('/api/btc/create-charge', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ plan, amount: amounts[plan] }),
        });
        const { hostedUrl, error } = await res.json();
        if (error) {
          if (error.includes('not configured')) {
            alert('Bitcoin payments are being configured. Please use card payment or try again later.');
            return;
          }
          throw new Error(error);
        }
        window.location.href = hostedUrl;
      }
    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      setLoading(null);
    }
  };

  return (
    <main className={styles.main}>
      <div className={`container ${styles.container}`}>
        <div className={styles.hero}>
          <span className={styles.badge}>Escort Listings</span>
          <h1>Choose Your Plan</h1>
          <p className={styles.subtitle}>
            Join the most exclusive escort directory. Start getting clients today.
          </p>

          <div className={styles.toggle}>
            <button
              onClick={() => setBilling('monthly')}
              className={billing === 'monthly' ? styles.toggleActive : ''}
            >Monthly</button>
            <button
              onClick={() => setBilling('annual')}
              className={billing === 'annual' ? styles.toggleActive : ''}
            >
              Annual <span className={styles.toggleSave}>Save 20%</span>
            </button>
          </div>
        </div>

        <div className={styles.plansGrid}>
          {plans.map(plan => (
            <div
              key={plan.key}
              className={`${styles.planCard} ${plan.popular ? styles.planCardPopular : ''}`}
            >
              {plan.popular && <div className={styles.popularBadge}>⭐ Most Popular</div>}

              <div className={styles.planHeader}>
                <div className={styles.planName} style={{ color: plan.color }}>{plan.name}</div>
                <p className={styles.planDesc}>{plan.description}</p>
                <div className={styles.planPrice}>
                  <span className={styles.currency}>$</span>
                  <span className={styles.amount}>{getPrice(plan.price, billing)}</span>
                  <span className={styles.period}>{getPeriodLabel(billing)}</span>
                </div>
                {billing === 'annual' && (
                  <p style={{fontSize:'0.78rem', color:'#10b981', marginTop:'0.4rem'}}>
                    vs ${plan.price}/mo monthly — save ${plan.price * 12 - getPrice(plan.price, billing)}/yr
                  </p>
                )}
              </div>

              <ul className={styles.features}>
                {plan.features.map(f => (
                  <li key={f}><span className={styles.check} style={{ color: plan.color }}>✓</span> {f}</li>
                ))}
              </ul>

              <div className={styles.actions}>
                <button
                  className="btn-primary"
                  style={{ width: '100%', background: plan.color, marginBottom: '0.5rem' }}
                  onClick={() => handleSubscribe(plan.key, 'stripe')}
                  disabled={!!loading}
                >
                  {loading === `${plan.key}-stripe` ? 'Redirecting...' : '💳 Subscribe with Card'}
                </button>
                <button
                  className="btn-outline"
                  style={{ width: '100%', fontSize: '0.88rem' }}
                  onClick={() => handleSubscribe(plan.key, 'btc')}
                  disabled={!!loading}
                >
                  {loading === `${plan.key}-btc` ? 'Redirecting...' : '₿ Pay with Bitcoin'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className={styles.faq}>
          <h2>Frequently Asked Questions</h2>
          <div className={styles.faqGrid}>
            {[
              { q: 'Can I cancel anytime?', a: 'Yes, you can cancel your subscription at any time through your dashboard. You will retain access until the end of your billing period.' },
              { q: 'How do card payments work?', a: 'We use Stripe, a secure payment processor. Your card details are never stored on our servers.' },
              { q: 'How do Bitcoin payments work?', a: 'We use Coinbase Commerce. Once your payment confirms on the blockchain, your listing is activated automatically.' },
              { q: 'When will my profile go live?', a: 'Featured and VIP plans are activated immediately after payment. Basic plans may take up to 24 hours for review.' },
            ].map(item => (
              <div key={item.q} className={styles.faqItem}>
                <h3>{item.q}</h3>
                <p>{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
