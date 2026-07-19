"use client";

import Link from "next/link";
import { User, Search, LogOut, LayoutDashboard, Crown, Menu, Wand2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { handleSignOut } from "@/actions/auth";
import { useLanguage } from "@/i18n/LanguageContext";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const { t } = useLanguage();
  const { data: session } = useSession();
  const user = session?.user as any;
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [registerOpen, setRegisterOpen] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [registerError, setRegisterError] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState(false);

  const [searchVal, setSearchVal] = useState(searchParams.get('q') || '');
  const [liveCount, setLiveCount] = useState(8217);

  // Sync search input with URL
  useEffect(() => {
    setSearchVal(searchParams.get('q') || '');
  }, [searchParams]);

  // Fetch counts or simulate model counts
  useEffect(() => {
    fetch('/api/models/counts')
      .then(res => res.json())
      .then(data => {
        if (data && data.age) {
          // Total sum of ages as dynamic live models count
          const total = Object.values(data.age).reduce((a: any, b: any) => a + b, 0) as number;
          if (total > 0) setLiveCount(total * 4 + 112); // scaled for cam site scale
        }
      })
      .catch(() => {});
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchVal) params.set('q', searchVal);
    else params.delete('q');
    router.push(`/search?${params.toString()}`);
  };

  const handleRegisterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsRegistering(true);
    setRegisterError("");
    setRegisterSuccess(false);
    
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);
    
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      
      if (!res.ok) throw new Error(result.error || 'Failed to create account');
      
      setRegisterSuccess(true);
    } catch (err: any) {
      setRegisterError(err.message);
    } finally {
      setIsRegistering(false);
    }
  };

  // Hide Navbar on admin routes
  if (pathname?.startsWith('/admin') || pathname?.startsWith('/dashboard')) {
    return null;
  }

  return (
    <header className={styles.header}>
      {/* Primary Top Navbar */}
      <nav className={styles.nav}>
        <div className={styles.container}>
          {/* Logo & Hamburger */}
          <div className={styles.logoSection}>
            <button className={styles.menuBtn}>
              <Menu size={20} />
            </button>
            <Link href="/" className={styles.logo}>
              <div className={styles.logoBubble}>
                <svg className={styles.logoIcon} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </div>
              <span className={styles.logoText}>LUMI<span className={styles.logoAccent}>NA</span></span>
            </Link>
            <div className={styles.liveBadge}>
              <span className={styles.liveDot}>●</span>
              <span>{liveCount.toLocaleString()} {t('live')}</span>
            </div>
            <Link href="/search?featured=true" className={styles.topModelsLink}>
              <Crown size={16} />
              <span>{t('topModels')}</span>
            </Link>
          </div>

          {/* Center Search bar */}
          <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
            <div className={styles.searchWrapper}>
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                value={searchVal}
                onChange={e => setSearchVal(e.target.value)}
                className={styles.searchInput}
              />
              <button type="submit" className={styles.searchSubmit}>
                <Search size={16} />
              </button>
            </div>
            <button 
              type="button" 
              onClick={() => router.push('/search?magic=true')} 
              className={styles.magicSearchBtn}
            >
              <Wand2 size={14} />
              <span>Magic Search</span>
              <span className={styles.magicBadge}>3</span>
            </button>
          </form>

          {/* Right actions / account area */}
          <div className={styles.actions}>
            <Link href="/about" className={styles.aboutLink}>About Lumina</Link>
            
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
                  <Link href="/admin" className={styles.iconBtn} title="Admin Dashboard">
                    <LayoutDashboard size={20} />
                  </Link>
                )}
                {user?.role === 'MODEL' && (
                  <Link href="/dashboard/escort" className={styles.iconBtn} title="Model Dashboard">
                    <Crown size={20} />
                  </Link>
                )}
                {user?.role === 'CLIENT' && (
                  <Link href="/dashboard" className={styles.iconBtn} title="My Dashboard">
                    <LayoutDashboard size={20} />
                  </Link>
                )}

                <form action={handleSignOut}>
                  <button type="submit" className={styles.logoutBtn} title="Sign Out">
                    <LogOut size={16} />
                  </button>
                </form>
              </div>
            ) : (
              <div className={styles.authActions}>
                <button onClick={() => setRegisterOpen(true)} className={styles.joinBtn}>
                  {t('createAccount')}
                </button>
                <Link href="/login" className={styles.loginBtn}>
                  {t('login')}
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Sub-navigation categories */}
      <div className={styles.subnav}>
        <div className={styles.subnavContainer}>
          {['Girls', 'Couples', 'Guys', 'Trans'].map((tab) => {
            const value = tab.toLowerCase().replace(/s$/, ''); // girls -> girl, couples -> couple, guys -> guy, trans -> trans
            const active = searchParams.get('gender') === value || (tab === 'Girls' && !searchParams.get('gender') && pathname === '/');
            return (
              <button
                key={tab}
                onClick={() => {
                  const params = new URLSearchParams(searchParams.toString());
                  params.set('gender', value);
                  router.push(`/search?${params.toString()}`);
                }}
                className={`${styles.tabBtn} ${active ? styles.tabActive : ''}`}
              >
                {t(tab.toLowerCase())}
              </button>
            );
          })}
          <Link
            href="/categories"
            className={`${styles.tabBtn} ${pathname === '/categories' ? styles.tabActive : ''}`}
          >
            {t('allCategories')}
          </Link>
        </div>
      </div>

      {/* Register Modal */}
      {registerOpen && (
        <div className={styles.modalOverlay} onClick={() => setRegisterOpen(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setRegisterOpen(false)}>✕</button>
            
            <h2 className={styles.modalTitle}>Join Lumina</h2>
            <p className={styles.modalSubtitle}>Create your free interactive account</p>

            <form onSubmit={handleRegisterSubmit} className={styles.modalForm}>
              {registerError && <div className={styles.modalError}>{registerError}</div>}
              {registerSuccess ? (
                <div className={styles.modalSuccess}>
                  Account created successfully! Please login.
                  <Link href="/login" className="btn-primary" style={{display:'block', textAlign:'center', marginTop:'1rem'}} onClick={() => setRegisterOpen(false)}>
                    Go to Login
                  </Link>
                </div>
              ) : (
                <>
                  <div className={styles.formGroup}>
                    <label>Full Name</label>
                    <input type="text" name="name" required placeholder="John Doe" />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Email Address</label>
                    <input type="email" name="email" required placeholder="john@example.com" />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Password</label>
                    <input type="password" name="password" required minLength={6} placeholder="••••••••" />
                  </div>
                  <div className={styles.formGroup}>
                    <label>I am a</label>
                    <select name="role" required>
                      <option value="CLIENT">Client (Viewer / Fan)</option>
                      <option value="MODEL">Model (Broadcaster)</option>
                    </select>
                  </div>
                  <button type="submit" disabled={isRegistering} className={styles.submitBtn}>
                    {isRegistering ? 'Creating Account...' : 'Create Free Account'}
                  </button>
                </>
              )}
            </form>
          </div>
        </div>
      )}
    </header>
  );
}
