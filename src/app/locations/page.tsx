import Link from 'next/link';
import { africanLocations, worldLocations } from '@/locations/data';
import styles from './locations.module.css';

export const dynamic = 'force-dynamic';

export default function LocationsPage() {
  return (
    <main className={styles.main}>
      <div className={`container ${styles.container}`}>
        {/* Hero */}
        <div className={styles.hero}>
          <span className={styles.badge}>Worldwide Presence</span>
          <h1>Our Locations</h1>
          <p className={styles.subtitle}>
            Lumina escorts are available across Africa, Europe, the Americas, Asia, and beyond.
            Find your perfect companion wherever you are in the world.
          </p>
        </div>

        {/* Africa Section */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>🌍</span>
            <h2>Africa</h2>
          </div>
          <div className={styles.grid}>
            {africanLocations.map((loc) => (
              <div key={loc.country} className={styles.card}>
                <h3 className={styles.country}>{loc.country}</h3>
                <ul className={styles.cities}>
                  {loc.cities.map((city) => (
                    <li key={city}>
                      <Link href={`/search?city=${encodeURIComponent(city)}&country=${encodeURIComponent(loc.country)}`}>
                        {city}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* World Section */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>🌐</span>
            <h2>Worldwide</h2>
          </div>
          <div className={styles.grid}>
            {worldLocations.map((loc) => (
              <div key={loc.country} className={styles.card}>
                <h3 className={styles.country}>{loc.country}</h3>
                <ul className={styles.cities}>
                  {loc.cities.map((city) => (
                    <li key={city}>
                      <Link href={`/search?city=${encodeURIComponent(city)}&country=${encodeURIComponent(loc.country)}`}>
                        {city}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className={styles.cta}>
          <h2>Don&apos;t see your city?</h2>
          <p>Our network is constantly growing. Contact us to request coverage in your area.</p>
          <Link href="/search" className="btn-primary">Browse All Escorts</Link>
        </div>
      </div>
    </main>
  );
}
