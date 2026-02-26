'use client';

import { useState } from 'react';
import styles from '../admin.module.css';

export default function AdminEscortsClient({ escorts }: { escorts: any[] }) {
  const [updating, setUpdating] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const filtered = escorts.filter(e =>
    !search || e.displayName.toLowerCase().includes(search.toLowerCase()) || 
    e.user.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggle = async (escortId: string, field: 'isVerified' | 'isFeatured' | 'isActive', current: boolean) => {
    setUpdating(`${escortId}-${field}`);
    try {
      const res = await fetch('/api/admin/escorts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ escortId, [field]: !current }),
      });
      if (res.ok) window.location.reload();
      else alert('Failed to update');
    } catch { alert('Error'); }
    finally { setUpdating(null); }
  };

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1>Escort Management</h1>
          <p className={styles.pageSubtitle}>{escorts.length} escort profiles</p>
        </div>
      </div>

      <div className={styles.chartCard}>
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width:'100%', background:'var(--color-bg)', border:'1px solid var(--color-border)',
            borderRadius:'8px', padding:'0.6rem 1rem', color:'var(--color-text)', 
            fontSize:'0.9rem', marginBottom:'1.5rem', boxSizing:'border-box'
          }}
        />

        <table style={{width:'100%', borderCollapse:'collapse', fontSize:'0.88rem'}}>
          <thead>
            <tr style={{borderBottom:'1px solid var(--color-border)', color:'var(--color-text-secondary)', textAlign:'left'}}>
              <th style={{padding:'0.75rem 0.5rem'}}>Escort</th>
              <th style={{padding:'0.75rem 0.5rem'}}>Location</th>
              <th style={{padding:'0.75rem 0.5rem'}}>Subscription</th>
              <th style={{padding:'0.75rem 0.5rem'}}>Stats</th>
              <th style={{padding:'0.75rem 0.5rem'}}>Verified</th>
              <th style={{padding:'0.75rem 0.5rem'}}>Featured</th>
              <th style={{padding:'0.75rem 0.5rem'}}>Active</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7} style={{textAlign:'center', padding:'2rem', color:'var(--color-text-secondary)'}}>No escorts found</td></tr>
            ) : filtered.map(e => (
              <tr key={e.id} style={{borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
                <td style={{padding:'0.75rem 0.5rem'}}>
                  <div style={{fontWeight:600}}>{e.displayName}</div>
                  <div style={{fontSize:'0.75rem', color:'var(--color-text-secondary)'}}>{e.user.email}</div>
                </td>
                <td style={{padding:'0.75rem 0.5rem', color:'var(--color-text-secondary)'}}>{e.city}, {e.country}</td>
                <td style={{padding:'0.75rem 0.5rem'}}>
                  {e.user.subscriptionStatus === 'active' ? (
                    <span style={{color:'#10b981', fontWeight:600, fontSize:'0.8rem'}}>✓ {e.user.subscriptionPlan}</span>
                  ) : (
                    <span style={{color:'var(--color-text-secondary)', fontSize:'0.8rem'}}>No sub</span>
                  )}
                </td>
                <td style={{padding:'0.75rem 0.5rem', fontSize:'0.8rem'}}>
                  ⭐ {e.rating.toFixed(1)} · {e._count.reviews} reviews
                </td>
                <ToggleCell
                  value={e.isVerified}
                  loading={updating === `${e.id}-isVerified`}
                  onClick={() => handleToggle(e.id, 'isVerified', e.isVerified)}
                  trueColor="#10b981"
                />
                <ToggleCell
                  value={e.isFeatured}
                  loading={updating === `${e.id}-isFeatured`}
                  onClick={() => handleToggle(e.id, 'isFeatured', e.isFeatured)}
                  trueColor="#d4af37"
                />
                <ToggleCell
                  value={e.isActive}
                  loading={updating === `${e.id}-isActive`}
                  onClick={() => handleToggle(e.id, 'isActive', e.isActive)}
                  trueColor="#6366f1"
                />
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ToggleCell({ value, loading, onClick, trueColor }: {
  value: boolean; loading: boolean; onClick: () => void; trueColor: string;
}) {
  return (
    <td style={{padding:'0.75rem 0.5rem'}}>
      <button
        onClick={onClick}
        disabled={loading}
        style={{
          padding:'4px 10px', borderRadius:'20px', border:'none', cursor:'pointer',
          fontSize:'0.75rem', fontWeight:700,
          background: value ? `rgba(${hexToRgb(trueColor)}, 0.2)` : 'rgba(100,100,100,0.2)',
          color: value ? trueColor : '#888',
          minWidth:'55px'
        }}
      >
        {loading ? '...' : value ? 'ON' : 'OFF'}
      </button>
    </td>
  );
}

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return `${r},${g},${b}`;
}
