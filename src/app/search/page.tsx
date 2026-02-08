import { PrismaClient } from '@prisma/client';
import ModelCard from '@/components/ModelCard';
import { Search } from 'lucide-react';
import styles from './page.module.css';

const prisma = new PrismaClient();

async function getModels(searchParams: { country?: string; city?: string }) {
  const { country, city } = searchParams;
  
  // Note: For cleaner code, one might instantiate prisma differently to avoid multiple clients in dev
  // But for this simple implementation it's fine.
  
  return await prisma.modelProfile.findMany({
    where: {
      isVerified: true,
      ...(country && { country: { contains: country } }),
      ...(city && { city: { contains: city } }),
    },
    include: {
      photos: true,
    },
  });
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { country?: string; city?: string };
}) {
  const models = await getModels(searchParams);

  return (
    <main className={styles.main}>
      <div className={`container ${styles.container}`}>
        {/* Sidebar Filters */}
        <aside className={styles.sidebar}>
          <div className={styles.filterCard}>
            <h3>Filter Results</h3>
            <form className={styles.form}>
              <div className={styles.formGroup}>
                <label>Country</label>
                <input 
                  type="text" 
                  name="country" 
                  defaultValue={searchParams.country} 
                  placeholder="e.g. France" 
                  className={styles.input}
                />
              </div>
              <div className={styles.formGroup}>
                <label>City</label>
                <input 
                  type="text" 
                  name="city" 
                  defaultValue={searchParams.city} 
                  placeholder="e.g. Paris" 
                  className={styles.input}
                />
              </div>
              <button type="submit" className="btn-primary" style={{width: '100%'}}>
                Update Results
              </button>
            </form>
          </div>
        </aside>

        {/* Results Grid */}
        <section className={styles.results}>
          <div className={styles.resultsHeader}>
            <h1>Elite Companions</h1>
            <p>{models.length} models found</p>
          </div>

          {models.length > 0 ? (
            <div className={styles.grid}>
              {models.map((model) => (
                <ModelCard key={model.id} model={model} />
              ))}
            </div>
          ) : (
            <div className={styles.noResults}>
              <p>No models found matching your criteria.</p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
