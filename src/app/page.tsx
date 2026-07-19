export const dynamic = 'force-dynamic';

import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import ModelCard from "@/components/ModelCard";
import { prisma } from '@/lib/prisma';
import { cleanModelsList } from '@/lib/data-utils';
import styles from "./page.module.css";

async function getAfricanModels() {
  try {
    const africanCountries = [
      "Nigeria", "South Africa", "Kenya", "Egypt", "Morocco", "Ghana", "Ethiopia", 
      "Tanzania", "Uganda", "Rwanda", "Burundi", "Senegal", "Ivory Coast", "Algeria", 
      "Tunisia", "Cameroon", "DR Congo", "Zambia", "Zimbabwe", "Botswana", "Namibia", 
      "Mozambique", "Angola", "Mauritius", "Seychelles"
    ];
    return await prisma.modelProfile.findMany({
      where: { 
        isVerified: true,
        isActive: true,
        country: { in: africanCountries },
      },
      take: 6,
      include: {
        photos: true,
      }
    });
  } catch (error: any) {
    console.error("Database query failed:", error);
    return [];
  }
}

async function getFeaturedModels() {
  try {
    return await prisma.modelProfile.findMany({
      where: { 
        isFeatured: true,
        isVerified: true,
        isActive: true,
      },
      take: 12,
      include: {
        photos: true,
      }
    });
  } catch (error: any) {
    console.error("Database query failed:", error);
    return [];
  }
}

export default async function Home() {
  const africanModelsData = await getAfricanModels();
  const featuredModelsData = await getFeaturedModels();

  const africanModels = cleanModelsList(africanModelsData as any[]);
  const featuredModels = cleanModelsList(featuredModelsData as any[]);

  return (
    <main className={styles.mainContainer}>
      <Sidebar />
      <div className={styles.content}>
        {/* African Category Section */}
        {africanModels.length > 0 && (
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2>African</h2>
              <Link href="/search?country=South+Africa" className={styles.seeAll}>
                See All
              </Link>
            </div>
            
            <div className={styles.grid}>
              {africanModels.map((model) => (
                <ModelCard key={model.id} model={model} />
              ))}
            </div>
          </section>
        )}

        {/* Featured Models Section */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Featured Models</h2>
            <Link href="/search?featured=true" className={styles.seeAll}>
              See All
            </Link>
          </div>
          
          <div className={styles.grid}>
            {featuredModels.length > 0 ? (
              featuredModels.map((model) => (
                <ModelCard key={model.id} model={model} />
              ))
            ) : (
              <p className={styles.noResults}>No featured models at the moment.</p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
