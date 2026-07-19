'use client';

import Link from 'next/link';
import styles from './StickyPromoBar.module.css';

export default function StickyPromoBar() {
  return (
    <div className={styles.stickyBar}>
      <div className={styles.content}>
        <div className={styles.left}>
          <svg className={styles.icon} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.02 2 11c0 2.22 1.21 4.23 3.22 5.61-.17.65-.63 2.37-.82 3.07-.23.83.3 1.32 1 .94 1.8-1 2.8-1.57 3.52-1.92A10.87 10.87 0 0012 20c5.52 0 10-4.02 10-9s-4.48-9-10-9zm0 13c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" />
          </svg>
          <span className={styles.text}>Join Lumina to interact with models!</span>
        </div>
        <Link href="/register" className={styles.btn}>
          Join FREE
        </Link>
      </div>
    </div>
  );
}
