import { 
  ShoppingCart, 
  DollarSign, 
  Users, 
  Clock, 
  Mail 
} from 'lucide-react';
import styles from './admin.module.css';

export default function AdminDashboard() {
  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
        <div>
          <h1 style={{fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem', color: '#1f2937'}}>GoNow Dashboard</h1>
          <p style={{color: '#6b7280'}}>Welcome back! Here's your platform overview.</p>
        </div>
        <div style={{display: 'flex', gap: '10px'}}>
            <button style={{background: 'white', border: '1px solid #e5e7eb', padding: '10px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer'}}>
                <Mail size={16} /> Send Email
            </button>
             <button style={{background: '#1f2937', color: 'white', border: 'none', padding: '10px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer'}}>
                <Mail size={16} /> Email Marketing
            </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <div className={styles.statIcon} style={{background: '#0ea5e9'}}>
              <ShoppingCart size={24} />
            </div>
          </div>
          <div className={styles.statValue}>27</div>
          <div className={styles.statLabel}>Total Orders</div>
          <div className={styles.statFooter} style={{marginTop: '1rem'}}>
             <span className={`${styles.statTrend} ${styles.trendUp}`}>0 today</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <div className={styles.statIcon} style={{background: '#10b981'}}>
              <DollarSign size={24} />
            </div>
          </div>
          <div className={styles.statValue}>$0</div>
          <div className={styles.statLabel}>Total Revenue</div>
           <div className={styles.statFooter} style={{marginTop: '1rem'}}>
             <span className={`${styles.statTrend} ${styles.trendUp}`}>$0 this week</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <div className={styles.statIcon} style={{background: '#6366f1'}}>
              <Users size={24} />
            </div>
          </div>
          <div className={styles.statValue}>15</div>
          <div className={styles.statLabel}>Total Users</div>
           <div className={styles.statFooter} style={{marginTop: '1rem'}}>
             <span className={`${styles.statTrend} ${styles.trendUp}`}>+8 new this week</span>
          </div>
        </div>

        <div className={styles.statCard}>
           <div className={styles.statHeader}>
            <div className={styles.statIcon} style={{background: '#f59e0b'}}>
              <Clock size={24} />
            </div>
          </div>
          <div className={styles.statValue}>0</div>
          <div className={styles.statLabel}>Pending Orders</div>
           <div className={styles.statFooter} style={{marginTop: '1rem'}}>
             <span className={`${styles.statTrend} ${styles.trendUp}`}>1 open tickets</span>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className={styles.chartsGrid}>
        <div className={styles.chartCard}>
           <h3 className={styles.chartTitle}>Orders & Revenue (Last 30 Days)</h3>
           <div className={styles.chartArea}>
              {/* Fake Bar Chart */}
              <div style={{width: '100%', height: '100%', display: 'flex', alignItems: 'flex-end', gap: '10px'}}>
                  {[30, 45, 25, 60, 40, 70, 50, 80, 55, 35, 90, 65].map((h, i) => (
                      <div key={i} className={styles.bar} style={{height: `${h}%`, background: '#3b82f6'}}></div>
                  ))}
                   {[30, 45, 25, 60, 40, 70, 50, 80, 55, 35, 90, 65].map((h, i) => (
                      <div key={`rev-${i}`} className={styles.bar} style={{height: `${h * 0.7}%`, background: '#10b981'}}></div>
                  ))}
              </div>
           </div>
           <div style={{display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '1rem'}}>
               <div style={{display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', color: '#64748b'}}>
                   <span style={{width: '12px', height: '12px', background: '#3b82f6', borderRadius: '2px'}}></span> Orders
               </div>
                <div style={{display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', color: '#64748b'}}>
                   <span style={{width: '12px', height: '12px', background: '#10b981', borderRadius: '2px'}}></span> Revenue ($)
               </div>
           </div>
        </div>

        <div className={styles.chartCard}>
           <h3 className={styles.chartTitle}>Order Status</h3>
           <div className={styles.donutContainer}>
               <div className={styles.donut}></div>
               <div className={styles.donutHole}></div>
           </div>
           <div style={{marginTop: '1.5rem'}}>
               <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem'}}>
                   <span style={{display: 'flex', alignItems: 'center', gap: '6px'}}><span style={{width: '10px', height: '10px', background: '#10b981', borderRadius: '50%'}}></span> Completed</span>
                   <span style={{fontWeight: 600}}>65%</span>
               </div>
               <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem'}}>
                   <span style={{display: 'flex', alignItems: 'center', gap: '6px'}}><span style={{width: '10px', height: '10px', background: '#f43f5e', borderRadius: '50%'}}></span> Cancelled</span>
                   <span style={{fontWeight: 600}}>20%</span>
               </div>
               <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem'}}>
                   <span style={{display: 'flex', alignItems: 'center', gap: '6px'}}><span style={{width: '10px', height: '10px', background: '#3b82f6', borderRadius: '50%'}}></span> Pending</span>
                   <span style={{fontWeight: 600}}>15%</span>
               </div>
           </div>
        </div>
      </div>
    </div>
  );
}
