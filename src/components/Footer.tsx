"use client";

import Link from 'next/link';
import styles from './Footer.module.css';
import { useLanguage, Language } from '@/i18n/LanguageContext';

export default function Footer() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.container}`}>
        {/* Left Column: Logo, Language, and Description */}
        <div className={styles.leftCol}>
          <Link href="/" className={styles.logo}>
            <div className={styles.logoBubble}>
              <svg className={styles.logoIcon} viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
            <span className={styles.logoText}>LUMI<span className={styles.logoAccent}>NA</span></span>
          </Link>

          <div className={styles.languageSelector}>
            <select 
              className={styles.langSelect} 
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
            >
              <option value="en">🌐 English</option>
              <option value="es">🌐 Español</option>
              <option value="fr">🌐 Français</option>
              <option value="de">🌐 Deutsch</option>
              <option value="ru">🌐 Русский</option>
            </select>
          </div>

          <p className={styles.description}>
            {t('footerDesc')}
          </p>
        </div>

        {/* Link Columns */}
        <div className={styles.linksGrid}>
          <div className={styles.column}>
            <h4>LUMINA</h4>
            <Link href="/about" className={styles.link}>{t('about')}</Link>
            <Link href="/blog" className={styles.link}>Blog</Link>
            <Link href="/x" className={styles.link}>X</Link>
            <Link href="/media" className={styles.link}>Media Inquiries</Link>
          </div>

          <div className={styles.column}>
            <h4>LEGAL & SAFETY</h4>
            <Link href="/privacy" className={styles.link}>{t('privacy')}</Link>
            <Link href="/terms" className={styles.link}>{t('terms')}</Link>
            <Link href="/dmca" className={styles.link}>DMCA Policy</Link>
            <Link href="/cookies" className={styles.link}>Cookies Policy</Link>
            <Link href="/parental" className={styles.link}>Parental Control Guide</Link>
            <Link href="/anti-slavery" className={styles.link}>Anti-Slavery Help</Link>
          </div>

          <div className={styles.column}>
            <h4>WORK WITH US</h4>
            <Link href="/affiliate" className={styles.link}>Webcam Affiliate Program</Link>
          </div>

          <div className={styles.column}>
            <h4>HELP & SUPPORT</h4>
            <Link href="/support" className={styles.link}>{t('support')}</Link>
            <Link href="/billing" className={styles.link}>Billing Support</Link>
            <Link href="/dmca-protection" className={styles.link}>DMCA Protection</Link>
            <Link href="/report" className={styles.link}>Report Content</Link>
            <Link href="/2257" className={styles.link}>18 U.S.C. 2257 Record-Keeping Statement</Link>
          </div>
        </div>
      </div>
      
      <div className={styles.bottom}>
        <div className="container">
          <p className={styles.warningText}>This website contains materials that are strictly for adults (18+ only).</p>
          <p className={styles.copy}>&copy; {new Date().getFullYear()} Lumina. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
