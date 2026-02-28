'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

function VerifyContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('No verification token provided.');
      return;
    }

    fetch('/api/auth/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    })
    .then(async (res) => {
      const data = await res.json();
      if (res.ok) {
        setStatus('success');
        setMessage(data.message || 'Email verified successfully!');
        setTimeout(() => router.push('/login'), 2500);
      } else {
        setStatus('error');
        setMessage(data.error || 'Invalid or expired token.');
      }
    })
    .catch(() => {
      setStatus('error');
      setMessage('An error occurred during verification.');
    });
  }, [token, router]);

  return (
    <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
      {status === 'loading' && <div style={{ fontSize: '1.2rem', color: 'var(--color-gold)' }}>Loading...</div>}
      {status === 'error' && (
        <div style={{ color: '#f43f5e' }}>
          <h2>Verification Failed</h2>
          <p>{message}</p>
          <Link href="/login" style={{ color: 'var(--color-text-secondary)', textDecoration: 'underline', marginTop: '1rem', display: 'inline-block' }}>Go to Login</Link>
        </div>
      )}
      {status === 'success' && (
        <div style={{ color: '#10b981' }}>
          <h2>Email Verified!</h2>
          <p>{message}</p>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginTop: '1rem' }}>Redirecting to login...</p>
        </div>
      )}
    </div>
  );
}

export default function VerifyPage() {
  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg)' }}>
      <Suspense fallback={<div>Loading verify...</div>}>
        <div style={{ background: 'var(--color-bg-secondary)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--color-border)', maxWidth: '400px', width: '100%' }}>
          <h1 style={{ textAlign: 'center', color: 'var(--color-text)', marginBottom: '1.5rem', fontSize: '1.5rem' }}>Lumina✦</h1>
          <VerifyContent />
        </div>
      </Suspense>
    </main>
  );
}
