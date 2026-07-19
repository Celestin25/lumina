'use client';

import { useState, useEffect } from 'react';
import styles from './CookieConsent.module.css';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'accepted');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <span>
          We use cookies to improve your experience and personalize content. Learn more in our{' '}
          <a href="/cookies" className={styles.link}>
            Cookie Policy
          </a>
          .
        </span>
        <div className={styles.actions}>
          <button className={styles.manageBtn}>Manage</button>
          <button className={styles.acceptBtn} onClick={handleAccept}>
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}
