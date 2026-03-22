export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';
import ModelCard from '@/components/ModelCard';
import { cleanModelsList } from '@/lib/data-utils';
import styles from './page.module.css';

async function getModels() {
  try {
    return await prisma.modelProfile.findMany({
      where: {
        isVerified: true,
        isActive: true,
      },
      take: 15,
      include: {
        photos: {
          select: { id: true, modelId: true }
        },
        services: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  } catch (error: any) {
    console.error("Database query failed:", error);
    return { error: error.message || error.toString() };
  }
}

export default async function ModelsPage() {
  const modelsData = await getModels();
  
  if ((modelsData as any).error) {
    return (
      <main className={styles.main}>
        <div className="container" style={{ paddingTop: '100px', color: 'red' }}>
          <h2>Database Error</h2>
          <pre>{(modelsData as any).error}</pre>
        </div>
      </main>
    );
  }

  const models = cleanModelsList(modelsData as any[]);

  return (
    <main className={styles.main}>
      <div className="container">
        <header className={styles.header}>
          <h1 className={styles.title}>Our Elite Models</h1>
          <p className={styles.subtitle}>Discover our curated selection of premium companions.</p>
        </header>

        {models.length > 0 ? (
          <div className={styles.grid}>
            {models.map((model: any) => (
              <ModelCard key={model.id} model={model} />
            ))}
          </div>
        ) : (
          <div className={styles.noResults}>
            <p>No models available yet. Please check back later.</p>
          </div>
        )}
      </div>
    </main>
  );
}
