import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { Calendar, CreditCard, User, Star, Clock, CheckCircle, XCircle } from 'lucide-react';
import styles from './dashboard.module.css';

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

  return (
    <main className={styles.main}>
      <div className={`container ${styles.container}`}>
        <div className={styles.header}>
          <div>
            <h1>Welcome back, {user.name?.split(' ')[0] || 'Client'}</h1>
            <p className={styles.subtitle}>Manage your bookings and account</p>
          </div>
          <Link href="/search" className="btn-primary">Browse Companions</Link>
        </div>

        {/* Stats */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}><Calendar size={22} /></div>
            <div>
              <div className={styles.statValue}>{user.bookings.length}</div>
              <div className={styles.statLabel}>Total Bookings</div>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}><CheckCircle size={22} /></div>
            <div>
              <div className={styles.statValue}>{completedBookings}</div>
              <div className={styles.statLabel}>Completed</div>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}><CreditCard size={22} /></div>
            <div>
              <div className={styles.statValue}>${totalSpent.toFixed(0)}</div>
              <div className={styles.statLabel}>Total Spent</div>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}><User size={22} /></div>
            <div>
              <div className={styles.statValue}>{user.role}</div>
              <div className={styles.statLabel}>Account Type</div>
            </div>
          </div>
        </div>

        <div className={styles.twoCol}>
          {/* Recent Bookings */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Recent Bookings</h2>
            {user.bookings.length === 0 ? (
              <div className={styles.empty}>
                <p>No bookings yet.</p>
                <Link href="/search" className="btn-outline" style={{marginTop:'1rem'}}>Browse Companions</Link>
              </div>
            ) : (
              <div className={styles.list}>
                {user.bookings.map((booking) => (
                  <div key={booking.id} className={styles.listItem}>
                    <div>
                      <p className={styles.listTitle}>{booking.model.displayName}</p>
                      <p className={styles.listMeta}>
                        <Clock size={12} /> {new Date(booking.startTime).toLocaleDateString()}
                      </p>
                    </div>
                    <div className={styles.listRight}>
                      <span className={`${styles.badge} ${styles[`badge_${booking.status.toLowerCase()}`]}`}>
                        {booking.status}
                      </span>
                      <p className={styles.listAmount}>${booking.totalPrice}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Payment History */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Payment History</h2>
            {user.payments.length === 0 ? (
              <div className={styles.empty}><p>No payments yet.</p></div>
            ) : (
              <div className={styles.list}>
                {user.payments.map((payment) => (
                  <div key={payment.id} className={styles.listItem}>
                    <div>
                      <p className={styles.listTitle}>{payment.description || 'Payment'}</p>
                      <p className={styles.listMeta}>{payment.provider} · {new Date(payment.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className={styles.listRight}>
                      <span className={`${styles.badge} ${payment.status === 'completed' ? styles.badge_completed : styles.badge_pending}`}>
                        {payment.status}
                      </span>
                      <p className={styles.listAmount}>${payment.amount.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Account Settings */}
        <div className={styles.card} style={{marginTop:'1.5rem'}}>
          <h2 className={styles.cardTitle}>Account Settings</h2>
          <div className={styles.settingsGrid}>
            <div className={styles.settingsItem}>
              <User size={18} />
              <div>
                <p className={styles.settingsLabel}>Name</p>
                <p>{user.name || 'Not set'}</p>
              </div>
            </div>
            <div className={styles.settingsItem}>
              <CreditCard size={18} />
              <div>
                <p className={styles.settingsLabel}>Email</p>
                <p>{user.email}</p>
              </div>
            </div>
            <div className={styles.settingsItem}>
              <Star size={18} />
              <div>
                <p className={styles.settingsLabel}>Member Since</p>
                <p>{new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
