import Link from 'next/link';
import styles from './admin.module.css';
import { 
  LayoutDashboard, 
  BarChart2, 
  Mail, 
  Send, 
  Briefcase, 
  Settings, 
  LogOut, 
  Menu
} from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.adminContainer}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <Link href="/" className={styles.logo}>
            go<span style={{color: '#10b981'}}>now</span>
          </Link>
          <div style={{color: '#10b981', fontSize: '0.7rem', border: '1px solid #10b981', padding: '2px 6px', borderRadius: '4px'}}>
            DEVELOPMENT
          </div>
        </div>

        <nav className={styles.nav}>
          <div className={styles.navSection}>
            <Link href="/admin" className={`${styles.navLink} ${styles.active}`}>
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </Link>
            <Link href="/admin/stats" className={styles.navLink}>
              <BarChart2 size={18} />
              <span>Statistics</span>
            </Link>
            <Link href="/admin/email" className={styles.navLink}>
              <Mail size={18} />
              <span>Email Marketing</span>
            </Link>
            <Link href="/admin/send" className={styles.navLink}>
              <Send size={18} />
              <span>Send Email</span>
            </Link>
          </div>

          <div className={styles.navSection}>
            <h4 className={styles.navSectionTitle}>Business</h4>
            <Link href="/admin/businesses" className={styles.navLink}>
              <Briefcase size={18} />
              <span>Businesses</span>
            </Link>
            <Link href="/admin/orders" className={styles.navLink}>
              <Briefcase size={18} />
              <span>Orders</span>
            </Link>
             <Link href="/admin/reviews" className={styles.navLink}>
              <Settings size={18} />
              <span>Reviews</span>
            </Link>
          </div>

          <div className={styles.navSection} style={{marginTop: 'auto'}}>
            <Link href="/" className={styles.navLink}>
               <LogOut size={18} />
               <span>Back to Site</span>
            </Link>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <div className={styles.mainContent}>
        <header className={styles.header}>
            <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
               <Menu size={20} className="lg:hidden" />
               <h2 className={styles.headerTitle}>Dashboard & Stats</h2>
            </div>
            
            <div style={{display: 'flex', gap: '15px'}}>
               {/* User Profile or Actions */}
            </div>
        </header>

        <main className={styles.contentBody}>
          {children}
        </main>
      </div>
    </div>
  );
}
