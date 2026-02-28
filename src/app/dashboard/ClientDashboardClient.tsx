'use client';

import { useState } from 'react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { Calendar, CreditCard, User, Star, Clock, CheckCircle, Camera, LogOut } from 'lucide-react';
import styles from './dashboard.module.css';

interface ClientDashboardClientProps {
  user: any;
  totalSpent: number;
  completedBookings: number;
}

export default function ClientDashboardClient({
  user,
  totalSpent,
  completedBookings,
}: ClientDashboardClientProps) {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(user.image || '');
  const [name, setName] = useState(user.name || '');
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) { // 2MB Limit
      setErrorMessage("Image must be smaller than 2MB.");
      return;
    }
    
    setErrorMessage('');
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    try {
      const res = await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, image: imageUrl }),
      });
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        const data = await res.json();
        setErrorMessage(data.error || 'Update failed');
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('A network error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.main}>
      <div className={`container ${styles.container}`}>
        <div className={styles.header}>
          <div className={styles.headerTitle}>
            <div className={styles.avatarLarge}>
              {imageUrl ? (
                <img src={imageUrl} alt={name} className={styles.avatarImg} />
              ) : (
                <div className={styles.avatarPlaceholder}><User size={40} /></div>
              )}
            </div>
            <div>
              <h1>Welcome back, {name?.split(' ')[0] || 'Client'}</h1>
              <p className={styles.subtitle}>Manage your bookings and account</p>
            </div>
          </div>
          <div className={styles.headerActions}>
            <Link href="/search" className="btn-outline">Browse Companions</Link>
          </div>
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
                {user.bookings.map((booking: any) => (
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
                {user.payments.map((payment: any) => (
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
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Account Settings</h2>
            {success && <span className={styles.successMsg}>Profile updated!</span>}
            {errorMessage && <span style={{color: '#f43f5e', fontSize: '0.85rem'}}>{errorMessage}</span>}
          </div>
          <form onSubmit={handleUpdateProfile} className={styles.profileForm}>
            <div className={styles.settingsGrid}>
              <div className={styles.field}>
                <label><User size={14} /> Full Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="Enter your name"
                />
              </div>
              <div className={styles.field}>
                <label><Camera size={14} /> Profile Picture</label>
                <input 
                  type="file" 
                  accept="image/jpeg, image/png, image/webp"
                  onChange={handleFileChange} 
                />
              </div>
              <div className={styles.field}>
                <label><CreditCard size={14} /> Email (Cannot be changed)</label>
                <input type="email" value={user.email} disabled />
              </div>
              <div className={styles.field}>
                <label><Star size={14} /> Member Since</label>
                <input type="text" value={new Date(user.createdAt).toLocaleDateString()} disabled />
              </div>
            </div>
            <button type="submit" className="btn-primary" disabled={loading} style={{marginTop:'1rem'}}>
              {loading ? 'Saving...' : 'Update Profile'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
