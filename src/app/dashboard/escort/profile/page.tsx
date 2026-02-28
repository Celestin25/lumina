'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './profile.module.css';

interface ProfileFormData {
  displayName: string;
  bio: string;
  country: string;
  city: string;
  phone: string;
  age: string;
  height: string;
  weight: string;
  hourlyRate: string;
  ethnicity: string;
  btcAddress: string;
  services: string;
  photoUrls: string;
}

export default function EscortProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState<ProfileFormData>({
    displayName: '',
    bio: '',
    country: '',
    city: '',
    phone: '',
    age: '21',
    height: '',
    weight: '',
    hourlyRate: '',
    ethnicity: '',
    btcAddress: '',
    services: '',
    photoUrls: '',
  });

  // Fetch existing profile data on mount
  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch('/api/escort/profile');
        if (res.ok) {
          const data = await res.json();
          setForm(data);
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setFetching(false);
      }
    }
    fetchProfile();
  }, []);

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

  if (fetching) {
    return (
      <div className={styles.loadingPage}>
        <p>Loading your profile...</p>
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
              <div className={styles.field}>
                <label>Phone / WhatsApp *</label>
                <input name="phone" value={form.phone} onChange={handleChange} required placeholder="+44 7123 456789" />
              </div>
            </div>
          </div>

          {/* Physical */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Physical Details (Optional)</h2>
            <div className={styles.grid3}>
              <div className={styles.field}>
                <label>Ethnicity *</label>
                <select name="ethnicity" value={form.ethnicity} onChange={handleChange} required className={styles.select}>
                  <option value="">Select Ethnicity</option>
                  <option value="Black">Black</option>
                  <option value="White">White</option>
                  <option value="Mixed">Mixed</option>
                  <option value="Latino">Latino</option>
                </select>
              </div>
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
              <label>Upload Profile Pictures</label>
              <input 
                type="file" 
                accept="image/*" 
                multiple 
                onChange={(e) => {
                  const files = e.target.files;
                  if (!files) return;
                  
                  Array.from(files).forEach(file => {
                    if (file.size > 2 * 1024 * 1024) {
                      alert(`File ${file.name} is too large. Max 2MB.`);
                      return;
                    }
                    if (!file.type.startsWith('image/')) return;

                    const reader = new FileReader();
                    reader.onload = (event) => {
                      const img = new Image();
                      img.onload = () => {
                        const canvas = document.createElement('canvas');
                        let width = img.width;
                        let height = img.height;
                        const maxSide = 1000;
                        if (width > height && width > maxSide) { height *= maxSide / width; width = maxSide; }
                        else if (height > maxSide) { width *= maxSide / height; height = maxSide; }
                        canvas.width = width;
                        canvas.height = height;
                        const ctx = canvas.getContext('2d');
                        ctx?.drawImage(img, 0, 0, width, height);
                        const base64 = canvas.toDataURL('image/jpeg', 0.8);
                        if (base64) {
                          setForm(prev => {
                            const currentUrls = prev.photoUrls ? prev.photoUrls.split('\n').filter(Boolean) : [];
                            if (!currentUrls.includes(base64)) {
                              return { ...prev, photoUrls: [...currentUrls, base64].join('\n') };
                            }
                            return prev;
                          });
                        }
                      };
                      img.src = event.target?.result as string;
                    };
                    reader.readAsDataURL(file);
                  });
                  // Reset input so the same file can be selected again if removed
                  e.target.value = '';
                }}
                className={styles.fileInput}
              />
              <p className={styles.hint}>Select multiple images (Max 2MB each). They will be uploaded instantly.</p>
              
              {/* Photo Preview Grid */}
              {form.photoUrls && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '10px', marginTop: '1rem' }}>
                  {form.photoUrls.split('\n').filter(Boolean).map((url, i) => (
                    <div key={i} style={{ position: 'relative', width: '100%', aspectRatio: '1/1' }}>
                      <img src={url} alt={`Preview ${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                      <button
                        type="button"
                        onClick={() => {
                          setForm(prev => {
                            const currentUrls = prev.photoUrls.split('\n').filter(Boolean);
                            currentUrls.splice(i, 1);
                            return { ...prev, photoUrls: currentUrls.join('\n') };
                          });
                        }}
                        style={{
                          position: 'absolute', top: '4px', right: '4px', background: 'rgba(255,0,0,0.8)',
                          color: '#fff', border: 'none', borderRadius: '50%', width: '24px', height: '24px',
                          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '12px', fontWeight: 'bold'
                        }}
                        title="Remove photo"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
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
