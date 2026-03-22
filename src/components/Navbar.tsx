"use client";

import Link from "next/link";
import { User, Search, LogOut, LayoutDashboard, Crown } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { handleSignOut } from "@/actions/auth";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const { data: session } = useSession();
  const user = session?.user as any;
  const pathname = usePathname();

  const [registerOpen, setRegisterOpen] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [registerError, setRegisterError] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState(false);

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

  // Completely hide Navbar on distinct dashboard/app routes
  if (pathname?.startsWith('/admin') || pathname?.startsWith('/dashboard')) {
    return null;
  }

  return (
    <nav className={styles.nav}>
      <div className={`container ${styles.container}`}>
        <Link href="/" className={styles.logo}>
          Lumina<span className="text-gold">✦</span>
        </Link>
        <div className={styles.links}>
          <Link href="/models" className={styles.link}>Models</Link>

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

              <form action={handleSignOut}>
                <button type="submit" className={styles.logoutBtn} title="Sign Out">
                  <LogOut size={18} />
                  <span className={styles.logoutText}>Sign Out</span>
                </button>
              </form>
            </div>
          ) : (
            <div className={styles.actions}>
              <Link href="/login" className={styles.loginBtn}>
                <User size={18} />
                <span>Login</span>
              </Link>
              <button onClick={() => setRegisterOpen(true)} className="btn-primary" style={{fontSize:'0.85rem', padding:'0.5rem 1rem', border:'none', cursor:'pointer'}}>
                Join
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Register Modal */}
      {registerOpen && (
        <div className={styles.modalOverlay} onClick={() => setRegisterOpen(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setRegisterOpen(false)}>✕</button>
            
            <h2 className={styles.modalTitle}>Join Lumina</h2>
            <p className={styles.modalSubtitle}>Create your exclusive account</p>

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
                      <option value="CLIENT">Client (Seeking Companionship)</option>
                      <option value="MODEL">Model (Offering Services)</option>
                    </select>
                  </div>
                  <button type="submit" disabled={isRegistering} className="btn-primary" style={{ width: '100%', marginTop: '1rem', padding:'0.8rem' }}>
                    {isRegistering ? 'Creating Account...' : 'Create Account'}
                  </button>
                </>
              )}
            </form>
          </div>
        </div>
      )}
    </nav>
  );
}
