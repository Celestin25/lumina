import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

import Link from 'next/link';
import styles from '../admin.module.css';

export default async function AdminPaymentsPage() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== 'ADMIN') redirect('/');

  const payments = await prisma.payment.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
    include: {
      user: { select: { name: true, email: true } },
    },
  });

  const totalRevenue = payments
    .filter(p => p.status === 'completed')
    .reduce((acc, p) => acc + p.amount, 0);

  const stripeRevenue = payments
    .filter(p => p.status === 'completed' && p.provider === 'STRIPE')
    .reduce((acc, p) => acc + p.amount, 0);

  const btcRevenue = payments
    .filter(p => p.status === 'completed' && p.provider === 'BTC')
    .reduce((acc, p) => acc + p.amount, 0);

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1>Payments & Transactions</h1>
          <p className={styles.pageSubtitle}>{payments.length} total transactions</p>
        </div>
      </div>

      {/* Revenue Summary */}
      <div className={styles.statsGrid} style={{gridTemplateColumns:'repeat(3, 1fr)', marginBottom:'1.5rem'}}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>${totalRevenue.toFixed(2)}</div>
          <div className={styles.statLabel}>Total Revenue</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>${stripeRevenue.toFixed(2)}</div>
          <div className={styles.statLabel}>Card (Stripe)</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>${btcRevenue.toFixed(2)}</div>
          <div className={styles.statLabel}>Bitcoin</div>
        </div>
      </div>

      <div className={styles.chartCard}>
        <table style={{width:'100%', borderCollapse:'collapse', fontSize:'0.88rem'}}>
          <thead>
            <tr style={{borderBottom:'1px solid var(--color-border)', color:'var(--color-text-secondary)', textAlign:'left'}}>
              <th style={{padding:'0.75rem 0.5rem'}}>Date</th>
              <th style={{padding:'0.75rem 0.5rem'}}>User</th>
              <th style={{padding:'0.75rem 0.5rem'}}>Description</th>
              <th style={{padding:'0.75rem 0.5rem'}}>Provider</th>
              <th style={{textAlign:'right', padding:'0.75rem 0.5rem'}}>Amount</th>
              <th style={{textAlign:'right', padding:'0.75rem 0.5rem'}}>Status</th>
            </tr>
          </thead>
          <tbody>
            {payments.length === 0 ? (
              <tr><td colSpan={6} style={{textAlign:'center', padding:'2rem', color:'var(--color-text-secondary)'}}>No payments yet</td></tr>
            ) : payments.map(p => (
              <tr key={p.id} style={{borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
                <td style={{padding:'0.75rem 0.5rem', fontSize:'0.8rem', color:'var(--color-text-secondary)'}}>
                  {new Date(p.createdAt).toLocaleDateString()}
                </td>
                <td style={{padding:'0.75rem 0.5rem'}}>
                  <div style={{fontWeight:600, fontSize:'0.85rem'}}>{p.user.name || '—'}</div>
                  <div style={{fontSize:'0.75rem', color:'var(--color-text-secondary)'}}>{p.user.email}</div>
                </td>
                <td style={{padding:'0.75rem 0.5rem', color:'var(--color-text-secondary)', fontSize:'0.85rem'}}>{p.description || '—'}</td>
                <td style={{padding:'0.75rem 0.5rem'}}>
                  <span style={{
                    padding:'2px 8px', borderRadius:'20px', fontSize:'0.75rem', fontWeight:600,
                    background: p.provider === 'BTC' ? 'rgba(245,158,11,0.15)' : 'rgba(99,102,241,0.15)',
                    color: p.provider === 'BTC' ? '#f59e0b' : '#a5b4fc'
                  }}>{p.provider}</span>
                </td>
                <td style={{textAlign:'right', padding:'0.75rem 0.5rem', fontWeight:700, color:'var(--color-gold)'}}>
                  {p.currency} ${p.amount.toFixed(2)}
                </td>
                <td style={{textAlign:'right', padding:'0.75rem 0.5rem'}}>
                  <span style={{
                    padding:'2px 8px', borderRadius:'20px', fontSize:'0.75rem', fontWeight:600,
                    background: p.status === 'completed' ? 'rgba(16,185,129,0.15)' : p.status === 'failed' ? 'rgba(244,63,94,0.15)' : 'rgba(245,158,11,0.15)',
                    color: p.status === 'completed' ? '#10b981' : p.status === 'failed' ? '#f43f5e' : '#f59e0b'
                  }}>{p.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
