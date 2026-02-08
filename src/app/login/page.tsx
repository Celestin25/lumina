import Link from 'next/link';
import { authenticate } from '@/actions/login';
import styles from './page.module.css';

export default function LoginPage({
  searchParams,
}: {
  searchParams: { registered?: string };
}) {
  return (
    <main className={styles.main}>
      <div className={`container ${styles.container}`}>
        <div className={styles.card}>
          <h1 className={styles.title}>Welcome Back</h1>
          <p className={styles.subtitle}>Log in to your exclusive account</p>
          
          {searchParams.registered && (
            <div className={styles.successMessage}>
              Account created! Please log in.
            </div>
          )}

          <form action={authenticate} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="email">Email Address</label>
              <input type="email" id="email" name="email" required placeholder="john@example.com" />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password">Password</label>
              <input type="password" id="password" name="password" required placeholder="••••••••" />
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
              Sign In
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
