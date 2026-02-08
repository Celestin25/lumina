import Link from 'next/link';
import { registerUser } from '@/actions/register';
import styles from './page.module.css';

export default function RegisterPage() {
  return (
    <main className={styles.main}>
      <div className={`container ${styles.container}`}>
        <div className={styles.card}>
          <h1 className={styles.title}>Join Lumina</h1>
          <p className={styles.subtitle}>Create your exclusive account</p>
          
          <form action={registerUser} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Full Name</label>
              <input type="text" id="name" name="name" required placeholder="John Doe" />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email">Email Address</label>
              <input type="email" id="email" name="email" required placeholder="john@example.com" />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password">Password</label>
              <input type="password" id="password" name="password" required placeholder="••••••••" />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="role">I am a</label>
              <select id="role" name="role" required>
                <option value="CLIENT">Client (Seeking Companionship)</option>
                <option value="MODEL">Model (Offering Services)</option>
              </select>
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
              Create Account
            </button>
          </form>

          <p className={styles.loginLink}>
            Already have an account? <Link href="/login">Log in</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
