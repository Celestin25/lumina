export const dynamic = 'force-dynamic';

import Sidebar from '@/components/Sidebar';
import ModelCard from '@/components/ModelCard';
import { cleanModelsList } from '@/lib/data-utils';
import { prisma } from '@/lib/prisma';
import styles from './page.module.css';
import { Suspense } from 'react';

interface SearchFilters {
  country?: string;
  city?: string;
  ethnicity?: string;
  ageRange?: string;
  bodyType?: string;
  hairColor?: string;
  gender?: string;
  minPrice?: string;
  maxPrice?: string;
  featured?: string;
  new?: string;
  vr?: string;
  bdsm?: string;
  q?: string;
}

async function getModels(filters: SearchFilters) {
  try {
    const where: any = {
      isVerified: true,
      isActive: true,
    };

    if (filters.country) {
      // Handle "African" filter which passes "South Africa" as a flag, or general country search
      if (filters.country === 'South Africa') {
        // Broadly select African countries in DB
        const africanCountries = [
          "Nigeria", "South Africa", "Kenya", "Egypt", "Morocco", "Ghana", "Ethiopia", 
          "Tanzania", "Uganda", "Rwanda", "Burundi", "Senegal", "Ivory Coast", "Algeria", 
          "Tunisia", "Cameroon", "DR Congo", "Zambia", "Zimbabwe", "Botswana", "Namibia", 
          "Mozambique", "Angola", "Mauritius", "Seychelles"
        ];
        where.country = { in: africanCountries };
      } else {
        where.country = { contains: filters.country };
      }
    }
    
    if (filters.city) {
      where.city = { contains: filters.city };
    }
    
    if (filters.ethnicity) {
      where.ethnicity = { contains: filters.ethnicity };
    }
    
    if (filters.bodyType) {
      where.bodyType = { contains: filters.bodyType };
    }
    
    if (filters.hairColor) {
      where.hairColor = { contains: filters.hairColor };
    }
    
    if (filters.gender) {
      where.gender = filters.gender;
    }

    // Age groups
    if (filters.ageRange) {
      if (filters.ageRange === 'teen') {
        where.age = { gte: 18, lte: 21 };
      } else if (filters.ageRange === 'young') {
        where.age = { gte: 22, lte: 29 };
      } else if (filters.ageRange === 'milf') {
        where.age = { gte: 30, lte: 39 };
      } else if (filters.ageRange === 'mature') {
        where.age = { gte: 40, lte: 49 };
      } else if (filters.ageRange === 'granny') {
        where.age = { gte: 50 };
      }
    }

    // Price/Rate range filter (hourlyRate)
    if (filters.minPrice || filters.maxPrice) {
      where.hourlyRate = {};
      if (filters.minPrice) where.hourlyRate.gte = parseFloat(filters.minPrice);
      if (filters.maxPrice) where.hourlyRate.lte = parseFloat(filters.maxPrice);
    }

    // Specials
    if (filters.featured === 'true') {
      where.isFeatured = true;
    }

    // Text search query
    if (filters.q) {
      where.OR = [
        { displayName: { contains: filters.q } },
        { bio: { contains: filters.q } },
        { country: { contains: filters.q } },
        { city: { contains: filters.q } },
      ];
    }

    return await prisma.modelProfile.findMany({
      where,
      include: {
        photos: true,
        services: true,
      },
      orderBy: {
        createdAt: 'desc',
      }
    });
  } catch (error: any) {
    console.error("Database search query failed:", error);
    return { error: error.message || error.toString() };
  }
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<SearchFilters>;
}) {
  const resolvedParams = await searchParams;
  const modelsData = await getModels(resolvedParams);
  
  if ((modelsData as any).error) {
    return (
      <main className={styles.main}>
        <div className={`container ${styles.container}`} style={{ color: 'red', paddingTop: '40px' }}>
          <h2>Database Search Error</h2>
          <pre>{(modelsData as any).error}</pre>
        </div>
      </main>
    );
  }

  const models = cleanModelsList(modelsData as any[]);

  return (
    <main className={styles.main}>
      <div className={styles.mainContainer}>
        {/* Left Interactive Sidebar */}
        <Suspense fallback={<div style={{ padding: '24px', color: '#666' }}>Loading sidebar...</div>}>
          <Sidebar />
        </Suspense>

        {/* Results Grid */}
        <section className={styles.results}>
          <div className={styles.resultsHeader}>
            <h1>Models Directory</h1>
            <p className={styles.countText}>{models.length} models available</p>
          </div>

          {models.length > 0 ? (
            <div className={styles.grid}>
              {models.map((model) => (
                <ModelCard key={model.id} model={model} />
              ))}
            </div>
          ) : (
            <div className={styles.noResults}>
              <h3>No models match your filters</h3>
              <p>Try resetting some parameters in the sidebar to see more models.</p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
