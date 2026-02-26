'use client';

import { useState } from 'react';
import styles from '../admin.module.css';

export default function AdminUsersClient({ users }: { users: any[] }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [updating, setUpdating] = useState<string | null>(null);

  const filtered = users.filter(u => {
    const matchSearch = !search || 
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'ALL' || u.role === filter;
    return matchSearch && matchFilter;
  });

  const handleRoleChange = async (userId: string, newRole: string) => {
    setUpdating(userId);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: newRole }),
      });
      if (res.ok) {
        window.location.reload();
      } else {
        alert('Failed to update role');
      }
    } catch {
      alert('Error updating role');
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1>User Management</h1>
          <p className={styles.pageSubtitle}>{users.length} total users</p>
        </div>
      </div>

      <div className={styles.chartCard}>
        {/* Filters */}
        <div style={{display:'flex', gap:'1rem', marginBottom:'1.5rem', flexWrap:'wrap'}}>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              flex:1, minWidth:'200px', background:'var(--color-bg)', border:'1px solid var(--color-border)',
              borderRadius:'8px', padding:'0.6rem 1rem', color:'var(--color-text)', fontSize:'0.9rem'
            }}
          />
          {['ALL', 'CLIENT', 'MODEL', 'ADMIN'].map(role => (
            <button
              key={role}
              onClick={() => setFilter(role)}
              style={{
                padding:'0.5rem 1rem', borderRadius:'8px', border:'1px solid var(--color-border)',
                background: filter === role ? 'var(--color-gold)' : 'var(--color-bg)',
                color: filter === role ? '#000' : 'var(--color-text)',
                cursor:'pointer', fontWeight: filter === role ? 700 : 400, fontSize:'0.85rem'
              }}
            >{role}</button>
          ))}
        </div>

        <table style={{width:'100%', borderCollapse:'collapse', fontSize:'0.9rem'}}>
          <thead>
            <tr style={{borderBottom:'1px solid var(--color-border)', color:'var(--color-text-secondary)', textAlign:'left'}}>
              <th style={{padding:'0.75rem 0.5rem'}}>User</th>
              <th style={{padding:'0.75rem 0.5rem'}}>Role</th>
              <th style={{padding:'0.75rem 0.5rem'}}>Subscription</th>
              <th style={{padding:'0.75rem 0.5rem'}}>Bookings</th>
              <th style={{padding:'0.75rem 0.5rem'}}>Joined</th>
              <th style={{padding:'0.75rem 0.5rem'}}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} style={{textAlign:'center', padding:'2rem', color:'var(--color-text-secondary)'}}>No users found</td></tr>
            ) : filtered.map(u => (
              <tr key={u.id} style={{borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
                <td style={{padding:'0.75rem 0.5rem'}}>
                  <div style={{fontWeight:600}}>{u.name || 'No name'}</div>
                  <div style={{fontSize:'0.78rem', color:'var(--color-text-secondary)'}}>{u.email}</div>
                </td>
                <td style={{padding:'0.75rem 0.5rem'}}>
                  <span style={{
                    padding:'2px 10px', borderRadius:'20px', fontSize:'0.75rem', fontWeight:600,
                    background: u.role === 'ADMIN' ? 'rgba(212,175,55,0.2)' : u.role === 'MODEL' ? 'rgba(99,102,241,0.2)' : 'rgba(16,185,129,0.15)',
                    color: u.role === 'ADMIN' ? '#d4af37' : u.role === 'MODEL' ? '#a5b4fc' : '#10b981'
                  }}>{u.role}</span>
                </td>
                <td style={{padding:'0.75rem 0.5rem'}}>
                  {u.subscriptionStatus === 'active' ? (
                    <span style={{color:'#10b981', fontSize:'0.85rem'}}>✓ {u.subscriptionPlan}</span>
                  ) : (
                    <span style={{color:'var(--color-text-secondary)', fontSize:'0.85rem'}}>None</span>
                  )}
                </td>
                <td style={{padding:'0.75rem 0.5rem'}}>{u._count.bookings}</td>
                <td style={{padding:'0.75rem 0.5rem', fontSize:'0.82rem', color:'var(--color-text-secondary)'}}>
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
                <td style={{padding:'0.75rem 0.5rem'}}>
                  <select
                    value={u.role}
                    disabled={updating === u.id}
                    onChange={e => handleRoleChange(u.id, e.target.value)}
                    style={{
                      background:'var(--color-bg)', border:'1px solid var(--color-border)',
                      borderRadius:'6px', padding:'0.3rem 0.5rem', color:'var(--color-text)',
                      fontSize:'0.8rem', cursor:'pointer'
                    }}
                  >
                    <option value="CLIENT">CLIENT</option>
                    <option value="MODEL">MODEL</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
