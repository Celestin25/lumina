import Link from 'next/link';
import { regions, countryFlag } from '@/locations/data';
import styles from './locations.module.css';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function LocationsPage() {
  let countryCounts: Record<string, number> = {};
  let cityCounts: Record<string, number> = {};

  try {
    const models = await prisma.modelProfile.findMany({
      where: {
        isActive: true,
        isVerified: true,
      },
      select: {
        country: true,
        city: true,
      }
    });

    models.forEach(model => {
      const country = model.country ? model.country.trim() : '';
      const city = model.city ? model.city.trim() : '';

      if (country) {
        countryCounts[country] = (countryCounts[country] || 0) + 1;
      }
      if (city && country) {
        const key = `${city}, ${country}`;
        cityCounts[key] = (cityCounts[key] || 0) + 1;
      }
    });
  } catch (error) {
    console.error("Failed to query model locations:", error);
  }

  return (
    <main className={styles.main}>
      <div className={`container ${styles.container}`}>
        {/* Hero */}
        <div className={styles.hero}>
          <span className={styles.badge}>Worldwide Presence</span>
          <h1>Our Locations</h1>
          <p className={styles.subtitle}>
            Lumina models are available across Africa, Europe, the Americas, Asia, and beyond.
            Find your perfect companion wherever you are in the world.
          </p>
        </div>

        {regions.map((region) => (
          <section key={region.name} className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionIcon}>{region.icon}</span>
              <h2>{region.name}</h2>
            </div>
            <div className={styles.grid}>
              {region.locations.map((loc) => {
                const count = countryCounts[loc.country] || 0;
                return (
                  <div key={loc.country} className={styles.card}>
                    <h3 className={styles.country}>
                      <Link href={`/search?country=${encodeURIComponent(loc.country)}`}>
                        {countryFlag(loc.country)} {loc.country}
                      </Link>
                      {count > 0 && <span className={styles.countBadge}>{count}</span>}
                    </h3>
                    <ul className={styles.cities}>
                      {loc.cities.map((city) => {
                        const cityCount = cityCounts[`${city}, ${loc.country}`] || 0;
                        return (
                          <li key={city}>
                            <Link href={`/search?city=${encodeURIComponent(city)}&country=${encodeURIComponent(loc.country)}`}>
                              {city} {cityCount > 0 && `(${cityCount})`}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}
            </div>
          </section>
        ))}

        {/* CTA */}
        <div className={styles.cta}>
          <h2>Don&apos;t see your city?</h2>
          <p>Our network is constantly growing. Contact us to request coverage in your area.</p>
          <Link href="/search" className="btn-primary">Browse All Models</Link>
        </div>
      </div>
    </main>
  );
}
