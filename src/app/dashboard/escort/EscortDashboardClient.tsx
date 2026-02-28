'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogOut, Edit3, Home } from 'lucide-react';
import { handleSignOut } from '@/actions/auth';
import styles from './escort.module.css';

interface EscortDashboardClientProps {
  user: any;
  profile: any;
  subscription: any;
  earnings: number;
  recentPayments: any[];
}

export default function EscortDashboardClient({
  user,
  profile,
  subscription,
  earnings,
  recentPayments,
}: EscortDashboardClientProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (plan: string, provider: 'stripe' | 'btc') => {
    setLoading(`${plan}-${provider}`);
    try {
      if (provider === 'stripe') {
        const amounts: Record<string, number> = { basic: 49, featured: 99, vip: 199 };
        const res = await fetch('/api/stripe/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ plan }),
        });
        const { url, error } = await res.json();
        if (error) throw new Error(error);
        window.location.href = url;
      } else {
        const amounts: Record<string, number> = { basic: 49, featured: 99, vip: 199 };
        const res = await fetch('/api/btc/create-charge', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ plan, amount: amounts[plan] }),
        });
        const { hostedUrl, error } = await res.json();
        if (error) throw new Error(error);
        window.location.href = hostedUrl;
      }
    } catch (err: any) {
      alert('Payment error: ' + err.message);
    } finally {
      setLoading(null);
    }
  };

  const handleManageSub = async () => {
    setLoading('portal');
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' });
      const { url, error } = await res.json();
      if (error) throw new Error(error);
      window.location.href = url;
    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      setLoading(null);
    }
  };

  const plans = [
    { key: 'basic', name: 'Basic', price: 49, color: '#6366f1', features: ['Directory listing', '5 photos', 'Standard placement'] },
    { key: 'featured', name: 'Featured', price: 99, color: '#f59e0b', features: ['Featured placement', '20 photos', 'Verified badge', 'Priority listing'] },
    { key: 'vip', name: 'VIP Elite', price: 199, color: '#d4af37', features: ['Top placement', 'Unlimited photos', 'Homepage feature', 'VIP badge', '24/7 support'] },
  ];

  const isActive = user.subscriptionStatus === 'active';
  const currentPlan = user.subscriptionPlan;
  
  // A profile is considered complete if they have set a bio and uploaded at least one photo
  const isProfileComplete = profile && profile.bio && profile.photos && profile.photos.length > 0;
  
  const displayName = profile?.displayName || user?.name || 'Model';
  const avatarUrl = profile?.photos?.[0]?.url?.startsWith('data:') ? `/api/photos/${profile.photos[0].id}` : (profile?.photos?.[0]?.url || user?.image || 'https://via.placeholder.com/150');

  return (
    <main className={styles.main}>
      <div className={`container ${styles.container}`}>
        
        {/* PREMIUM CREATOR HEADER */}
        <div className={styles.profileHeader}>
          <div className={styles.profileInfo}>
            <img src={avatarUrl} alt={displayName} className={styles.avatar} />
            <div className={styles.profileText}>
              <h1>{displayName}</h1>
              <p className={styles.profileSubtitle}>
                {isActive ? <span className={styles.activeBadge}>✓ {currentPlan?.toUpperCase()} ACTIVE</span> : 'Listing Inactive'}
              </p>
            </div>
          </div>
          
          <div className={styles.headerActions}>
            <Link href="/" className={styles.btnSecondary} style={{ padding: '0.6rem 1rem' }}>
              <Home size={18} /> Home
            </Link>
            <Link href="/dashboard/escort/profile" className={styles.btnSecondary}>
              <Edit3 size={18} /> Edit Profile
            </Link>
            <form action={handleSignOut}>
              <button type="submit" className={styles.btnDanger}>
                <LogOut size={18} /> Sign Out
              </button>
            </form>
          </div>
        </div>

        {/* Status Banner */}
        {!isProfileComplete ? (
          <div className={styles.alertBanner}>
            <p>⚠️ Your profile is incomplete. <a href="/dashboard/escort/profile">Complete your profile</a> (add photos and bio) to get listed.</p>
          </div>
        ) : !isActive ? (
          <div className={styles.alertBanner} style={{borderColor:'#f59e0b', background:'rgba(245,158,11,0.08)'}}>
            <p>🔔 You need an active subscription to appear in listings. Choose a plan below.</p>
          </div>
        ) : null}

        {/* Stats */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statVal}>${earnings.toFixed(0)}</div>
            <div className={styles.statLbl}>Total Earnings</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statVal}>{profile?.reviewCount || 0}</div>
            <div className={styles.statLbl}>Reviews</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statVal}>{profile?.rating?.toFixed(1) || '—'}</div>
            <div className={styles.statLbl}>Rating</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statVal}>{isActive ? 'Active' : 'Inactive'}</div>
            <div className={styles.statLbl}>Listing Status</div>
          </div>
        </div>

        {/* Subscription Management */}
        {isActive && user.stripeCustomerId && (
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2>Current Subscription</h2>
              <button onClick={handleManageSub} disabled={loading === 'portal'} className="btn-outline" style={{fontSize:'0.85rem'}}>
                {loading === 'portal' ? 'Loading...' : 'Manage / Cancel'}
              </button>
            </div>
            <p>Plan: <strong>{currentPlan?.toUpperCase()}</strong></p>
            {subscription?.currentPeriodEnd && (
              <p style={{marginTop:'0.5rem', color:'var(--color-text-secondary)', fontSize:'0.9rem'}}>
                Renews: {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
              </p>
            )}
          </div>
        )}

        {/* Plans */}
        {!isActive && (
          <div className={styles.plansSection}>
            <h2>Choose Your Plan</h2>
            <p className={styles.plansSubtitle}>Select a subscription to activate your listing</p>
            <div className={styles.plansGrid}>
              {plans.map((plan: any) => (
                <div key={plan.key} className={`${styles.planCard} ${plan.key === 'featured' ? styles.planCardPopular : ''}`}>
                  {plan.key === 'featured' && <div className={styles.popularBadge}>Most Popular</div>}
                  <div className={styles.planName} style={{color: plan.color}}>{plan.name}</div>
                  <div className={styles.planPrice}>${plan.price}<span>/mo</span></div>
                  <ul className={styles.planFeatures}>
                    {plan.features.map((f: any) => <li key={f}>✓ {f}</li>)}
                  </ul>
                  <div className={styles.planActions}>
                    <button
                      onClick={() => handleSubscribe(plan.key, 'stripe')}
                      disabled={!!loading}
                      className="btn-primary"
                      style={{width:'100%', marginBottom:'0.5rem', background: plan.color}}
                    >
                      {loading === `${plan.key}-stripe` ? 'Redirecting...' : '💳 Pay with Card'}
                    </button>
                    <button
                      onClick={() => handleSubscribe(plan.key, 'btc')}
                      disabled={!!loading}
                      className="btn-outline"
                      style={{width:'100%', fontSize:'0.85rem'}}
                    >
                      {loading === `${plan.key}-btc` ? 'Redirecting...' : '₿ Pay with Bitcoin'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Payments */}
        {recentPayments.length > 0 && (
          <div className={styles.card} style={{marginTop:'1.5rem'}}>
            <h2 className={styles.cardTitle}>Payment History</h2>
            <div className={styles.paymentList}>
              {recentPayments.map((p: any) => (
                <div key={p.id} className={styles.paymentItem}>
                  <div>
                    <p className={styles.payDesc}>{p.description || 'Payment'}</p>
                    <p className={styles.payMeta}>{p.provider} · {new Date(p.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className={styles.payRight}>
                    <span className={`${styles.badge} ${p.status === 'completed' ? styles.badge_ok : styles.badge_pending}`}>
                      {p.status}
                    </span>
                    <p className={styles.payAmount}>${p.amount.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
