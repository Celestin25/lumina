'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { authenticate } from '@/actions/login';
import styles from './page.module.css';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function LoginForm() {
  const [error, formAction, pending] = useActionState(authenticate, undefined);
  const searchParams = useSearchParams();
  const registered = searchParams.get('registered');

  return (
    <main className={styles.main}>
      <div className={`container ${styles.container}`}>
        <div className={styles.card}>
          <h1 className={styles.title}>Welcome Back</h1>
          <p className={styles.subtitle}>Log in to your exclusive account</p>
          
          {registered && (
            <div className={styles.successMessage}>
              Account created! Please log in.
            </div>
          )}

          {error && (
            <div className={styles.errorMessage}>
              {error}
            </div>
          )}

          <form action={formAction} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="email">Email Address</label>
              <input type="email" id="email" name="email" required placeholder="john@example.com" />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password">Password</label>
              <input type="password" id="password" name="password" required placeholder="••••••••" />
            </div>

            <button type="submit" className="btn-primary" disabled={pending} style={{ width: '100%', marginTop: '1rem' }}>
              {pending ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className={styles.registerLink}>
            Don&apos;t have an account? <Link href="/register">Join Lumina</Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
