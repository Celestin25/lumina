import Link from 'next/link';
import { Facebook, Twitter, Instagram, Mail } from 'lucide-react';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.container}`}>
        <div className={styles.column}>
          <h3 className={styles.logo}>Lumina</h3>
          <p className={styles.tagline}>
            Redefining luxury companionship with elegance and discretion.
          </p>
          <div className={styles.socials}>
            <Link href="#" className={styles.socialIcon}><Instagram size={20} /></Link>
            <Link href="#" className={styles.socialIcon}><Twitter size={20} /></Link>
            <Link href="#" className={styles.socialIcon}><Facebook size={20} /></Link>
          </div>
        </div>

        <div className={styles.column}>
          <h4>Discover</h4>
          <Link href="/search" className={styles.link}>All Models</Link>
          <Link href="/locations" className={styles.link}>Locations</Link>
          <Link href="/search?featured=true" className={styles.link}>Featured</Link>
        </div>

        <div className={styles.column}>
          <h4>Company</h4>
          <Link href="/about" className={styles.link}>About Us</Link>
          <Link href="/register" className={styles.link}>Become a Model</Link>
          <Link href="/#contact" className={styles.link}>Contact</Link>
        </div>

        <div className={styles.column}>
          <h4>Contact</h4>
          <a href="mailto:vip@lumina.com" className={styles.contactLink}>
            <Mail size={16} /> vip@lumina.com
          </a>
          <p className={styles.address}>
            123 Avenue Montaigne<br />
            75008 Paris, France
          </p>
        </div>
      </div>
      
      <div className={styles.bottom}>
        <div className="container">
          <p>&copy; {new Date().getFullYear()} Lumina. All rights reserved. 18+ Only.</p>
        </div>
      </div>
    </footer>
  );
}
