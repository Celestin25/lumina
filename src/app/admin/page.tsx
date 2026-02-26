import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { Users, DollarSign, BookOpen, UserCheck, Crown } from 'lucide-react';
import styles from './admin.module.css';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== 'ADMIN') redirect('/');

  // Real DB stats
  const [
    totalUsers,
    totalEscorts,
    totalBookings,
    pendingBookings,
    totalRevenue,
    activeSubscriptions,
    newUsersThisWeek,
    recentPayments,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.modelProfile.count(),
    prisma.booking.count(),
    prisma.booking.count({ where: { status: 'PENDING' } }),
    prisma.payment.aggregate({ where: { status: 'completed' }, _sum: { amount: true } }),
    prisma.subscription.count({ where: { status: 'active' } }),
    prisma.user.count({
      where: { createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } }
    }),
    prisma.payment.findMany({
      orderBy: { createdAt: 'desc' },
      take: 8,
      include: { user: { select: { name: true, email: true } } },
    }),
  ]);

  const revenue = totalRevenue._sum.amount || 0;

  const stats = [
    { label: 'Total Users', value: totalUsers, icon: Users, color: '#6366f1', sub: `+${newUsersThisWeek} this week` },
    { label: 'Active Subscriptions', value: activeSubscriptions, icon: Crown, color: '#d4af37', sub: 'Paying escorts' },
    { label: 'Total Revenue', value: `$${revenue.toFixed(0)}`, icon: DollarSign, color: '#10b981', sub: 'All time' },
    { label: 'Total Bookings', value: totalBookings, icon: BookOpen, color: '#0ea5e9', sub: `${pendingBookings} pending` },
    { label: 'Escort Profiles', value: totalEscorts, icon: UserCheck, color: '#f59e0b', sub: 'In directory' },
  ];

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1>Admin Dashboard</h1>
          <p className={styles.pageSubtitle}>Platform overview — real-time data</p>
        </div>
        <div style={{display:'flex', gap:'10px'}}>
          <Link href="/admin/users" className="btn-outline" style={{fontSize:'0.85rem'}}>Manage Users</Link>
          <Link href="/admin/escorts" className="btn-primary" style={{fontSize:'0.85rem'}}>Manage Escorts</Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        {stats.map((s) => (
          <div key={s.label} className={styles.statCard}>
            <div className={styles.statHeader}>
              <div className={styles.statIcon} style={{background: s.color}}>
                <s.icon size={22} color="white" />
              </div>
            </div>
            <div className={styles.statValue}>{s.value}</div>
            <div className={styles.statLabel}>{s.label}</div>
            <div className={styles.statFooter}>
              <span className={`${styles.statTrend} ${styles.trendUp}`}>{s.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Payments */}
      <div className={styles.chartsGrid} style={{gridTemplateColumns:'1fr'}}>
        <div className={styles.chartCard}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1rem'}}>
            <h3 className={styles.chartTitle}>Recent Transactions</h3>
            <Link href="/admin/payments" style={{fontSize:'0.85rem', color:'var(--color-gold)'}}>View all →</Link>
          </div>
          <table style={{width:'100%', borderCollapse:'collapse', fontSize:'0.9rem'}}>
            <thead>
              <tr style={{borderBottom:'1px solid var(--color-border)', color:'var(--color-text-secondary)'}}>
                <th style={{textAlign:'left', padding:'0.5rem 0'}}>User</th>
                <th style={{textAlign:'left', padding:'0.5rem 0'}}>Description</th>
                <th style={{textAlign:'left', padding:'0.5rem 0'}}>Provider</th>
                <th style={{textAlign:'right', padding:'0.5rem 0'}}>Amount</th>
                <th style={{textAlign:'right', padding:'0.5rem 0'}}>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentPayments.length === 0 ? (
                <tr><td colSpan={5} style={{textAlign:'center', padding:'2rem', color:'var(--color-text-secondary)'}}>No payments yet</td></tr>
              ) : recentPayments.map((p: any) => (
                <tr key={p.id} style={{borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
                  <td style={{padding:'0.75rem 0'}}>{p.user.name || p.user.email}</td>
                  <td style={{color:'var(--color-text-secondary)'}}>{p.description || '—'}</td>
                  <td>
                    <span style={{
                      background: p.provider === 'BTC' ? 'rgba(245,158,11,0.15)' : 'rgba(99,102,241,0.15)',
                      color: p.provider === 'BTC' ? '#f59e0b' : '#6366f1',
                      padding:'2px 8px', borderRadius:'20px', fontSize:'0.75rem', fontWeight:600
                    }}>{p.provider}</span>
                  </td>
                  <td style={{textAlign:'right', fontWeight:700, color:'var(--color-gold)'}}>${p.amount.toFixed(2)}</td>
                  <td style={{textAlign:'right'}}>
                    <span style={{
                      background: p.status === 'completed' ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)',
                      color: p.status === 'completed' ? '#10b981' : '#f59e0b',
                      padding:'2px 8px', borderRadius:'20px', fontSize:'0.75rem', fontWeight:600
                    }}>{p.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
