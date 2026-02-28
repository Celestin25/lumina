export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';
import ModelCard from '@/components/ModelCard';
import { cleanModelsList } from '@/lib/data-utils';
import styles from './page.module.css';

async function getModels() {
  return await prisma.modelProfile.findMany({
    where: {
      isVerified: true,
      isActive: true,
    },
    include: {
      photos: true,
      services: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

export default async function ModelsPage() {
  const modelsData = await getModels();
  const models = cleanModelsList(modelsData);

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
