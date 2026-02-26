import Link from 'next/link';
import styles from './admin.module.css';
import { 
  LayoutDashboard, 
  Users, 
  UserCheck,
  CreditCard,
  BookOpen,
  Settings, 
  LogOut, 
  Crown,
  BarChart2,
} from 'lucide-react';
import { auth } from '@/auth';
import { handleSignOut } from '@/actions/auth';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/users', label: 'Users', icon: Users },
    { href: '/admin/escorts', label: 'Models', icon: UserCheck },
    { href: '/admin/payments', label: 'Payments', icon: CreditCard },
  ];

  return (
    <div className={styles.adminContainer}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <Link href="/" className={styles.logo}>
            Lumina<span style={{color: '#d4af37'}}>✦</span>
          </Link>
          <div style={{color: '#d4af37', fontSize: '0.65rem', border: '1px solid rgba(212,175,55,0.4)', padding: '2px 6px', borderRadius: '4px', fontWeight:700}}>
            ADMIN
          </div>
        </div>

        <nav className={styles.nav}>
          <div className={styles.navSection}>
            <h4 className={styles.navSectionTitle}>Overview</h4>
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href} className={styles.navLink}>
                <Icon size={17} />
                <span>{label}</span>
              </Link>
            ))}
          </div>

          <div className={styles.navSection} style={{marginTop: 'auto'}}>
            <Link href="/" className={styles.navLink}>
              <LayoutDashboard size={17} />
              <span>View Site</span>
            </Link>
            <form action={handleSignOut}>
              <button type="submit" className={styles.navLink} style={{background:'none', border:'none', cursor:'pointer', width:'100%', color:'var(--color-text-secondary)'}}>
                <LogOut size={17} />
                <span>Sign Out</span>
              </button>
            </form>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <div className={styles.mainContent}>
        <header className={styles.header}>
          <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
            <h2 className={styles.headerTitle}>Admin Panel</h2>
          </div>
          
          <div style={{display: 'flex', gap: '15px', alignItems: 'center'}}>
            {session?.user && (
              <span style={{color: 'var(--color-text-secondary)', fontSize: '0.85rem'}}>
                {session.user.name || session.user.email}
              </span>
            )}
          </div>
        </header>

        <main className={styles.contentBody}>
          {children}
        </main>
      </div>
    </div>
  );
}
