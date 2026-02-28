"use client";

import Link from "next/link";
import { User, Search, LogOut, LayoutDashboard, Crown } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const { data: session } = useSession();
  const user = session?.user as any;

  return (
    <nav className={styles.nav}>
      <div className={`container ${styles.container}`}>
        <Link href="/" className={styles.logo}>
          Lumina<span className="text-gold">✦</span>
        </Link>
        <div className={styles.links}>
          <Link href="/search" className={styles.link}>Models</Link>
          <Link href="/locations" className={styles.link}>Locations</Link>
          <Link href="/pricing" className={styles.link}>Pricing</Link>
          <Link href="/about" className={styles.link}>About</Link>
        </div>
        <div className={styles.actions}>
          <Link href="/search" className={styles.iconBtn}>
            <Search size={20} />
          </Link>
          
          {session ? (
            <div className={styles.userMenu}>
              {user?.image ? (
                <img src={user.image} alt={user.name || 'User'} className={styles.navAvatar} />
              ) : (
                <span className={styles.userName}>
                  {user?.name?.split(' ')[0] || 'Account'}
                </span>
              )}
              
              {user?.role === 'ADMIN' && (
                <Link href="/admin" className={styles.iconBtn} title="Admin Dashboard" style={{color: '#d4af37'}}>
                  <LayoutDashboard size={20} />
                </Link>
              )}
              {user?.role === 'MODEL' && (
                <Link href="/dashboard/escort" className={styles.iconBtn} title="Model Dashboard" style={{color: '#6366f1'}}>
                  <Crown size={20} />
                </Link>
              )}
              {user?.role === 'CLIENT' && (
                <Link href="/dashboard" className={styles.iconBtn} title="My Dashboard">
                  <LayoutDashboard size={20} />
                </Link>
              )}

              <button type="button" className={styles.logoutBtn} onClick={() => signOut()} title="Sign Out">
                <LogOut size={18} />
                <span className={styles.logoutText}>Sign Out</span>
              </button>
            </div>
          ) : (
            <div className={styles.actions}>
              <Link href="/login" className={styles.loginBtn}>
                <User size={18} />
                <span>Login</span>
              </Link>
              <Link href="/register" className="btn-primary" style={{fontSize:'0.85rem', padding:'0.5rem 1rem'}}>
                Join
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
