'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import styles from './profile.module.css';

interface ProfileFormData {
  displayName: string;
  bio: string;
  country: string;
  city: string;
  age: string;
  height: string;
  weight: string;
  hourlyRate: string;
  btcAddress: string;
  services: string;
  photoUrls: string;
}

export default function EscortProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState<ProfileFormData>({
    displayName: '',
    bio: '',
    country: '',
    city: '',
    age: '21',
    height: '',
    weight: '',
    hourlyRate: '',
    btcAddress: '',
    services: '',
    photoUrls: '',
  });

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/escort/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || 'Failed to save profile');
      }

      setSuccess(true);
      setTimeout(() => router.push('/dashboard/escort'), 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className={styles.successPage}>
        <div className={styles.successCard}>
          <div className={styles.successIcon}>✓</div>
          <h2>Profile Saved!</h2>
          <p>Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <main className={styles.main}>
      <div className={`container ${styles.container}`}>
        <div className={styles.header}>
          <h1>Set Up Your Profile</h1>
          <p className={styles.subtitle}>Complete your model profile to get listed in the directory</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.error}>{error}</div>}

          {/* Basic Info */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Basic Information</h2>
            <div className={styles.grid2}>
              <div className={styles.field}>
                <label>Display Name *</label>
                <input name="displayName" value={form.displayName} onChange={handleChange} required placeholder="Sophia Rose" />
              </div>
              <div className={styles.field}>
                <label>Age *</label>
                <input name="age" type="number" min="18" max="99" value={form.age} onChange={handleChange} required />
              </div>
            </div>

            <div className={styles.field}>
              <label>Bio / Description</label>
              <textarea name="bio" value={form.bio} onChange={handleChange} rows={4}
                placeholder="Introduce yourself — your personality, interests, and what makes you special..." />
            </div>
          </div>

          {/* Location */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Location</h2>
            <div className={styles.grid2}>
              <div className={styles.field}>
                <label>Country *</label>
                <input name="country" value={form.country} onChange={handleChange} required placeholder="United Kingdom" />
              </div>
              <div className={styles.field}>
                <label>City *</label>
                <input name="city" value={form.city} onChange={handleChange} required placeholder="London" />
              </div>
            </div>
          </div>

          {/* Physical */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Physical Details (Optional)</h2>
            <div className={styles.grid3}>
              <div className={styles.field}>
                <label>Height (cm)</label>
                <input name="height" type="number" value={form.height} onChange={handleChange} placeholder="170" />
              </div>
              <div className={styles.field}>
                <label>Weight (kg)</label>
                <input name="weight" type="number" value={form.weight} onChange={handleChange} placeholder="58" />
              </div>
              <div className={styles.field}>
                <label>Hourly Rate (USD) *</label>
                <input name="hourlyRate" type="number" value={form.hourlyRate} onChange={handleChange} required placeholder="200" />
              </div>
            </div>
          </div>

          {/* Services */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Services</h2>
            <div className={styles.field}>
              <label>Services Offered (comma separated)</label>
              <input name="services" value={form.services} onChange={handleChange}
                placeholder="Dinner date, Travel companion, Massage, Social model..." />
            </div>
          </div>

          {/* Photos */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Photos</h2>
            <div className={styles.field}>
              <label>Photo URLs (one per line)</label>
              <textarea name="photoUrls" value={form.photoUrls} onChange={handleChange} rows={4}
                placeholder="https://example.com/photo1.jpg&#10;https://example.com/photo2.jpg" />
              <p className={styles.hint}>Enter the full URL of each photo on a separate line. Photos must be publicly accessible.</p>
            </div>
          </div>

          {/* BTC */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Bitcoin Wallet (Optional)</h2>
            <div className={styles.field}>
              <label>Bitcoin Address</label>
              <input name="btcAddress" value={form.btcAddress} onChange={handleChange}
                placeholder="bc1q..." />
              <p className={styles.hint}>For direct BTC bookings or tips from clients</p>
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={loading} style={{width:'100%', padding:'1rem', fontSize:'1rem'}}>
            {loading ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </div>
    </main>
  );
}
