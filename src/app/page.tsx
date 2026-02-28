export const dynamic = 'force-dynamic';
import Link from "next/link";
import { ArrowRight, Star, MapPin } from "lucide-react";
import styles from "./page.module.css";
import { PrismaClient } from "@prisma/client";
import ModelCard from "@/components/ModelCard";

import { prisma } from '@/lib/prisma';
import { cleanModelsList } from '@/lib/data-utils';

async function getFeaturedModels() {
  try {
    return await prisma.modelProfile.findMany({
      where: { 
        isFeatured: true,
        isVerified: true,
        isActive: true,
      },
      take: 3,
      include: {
        photos: true,
      }
    });
  } catch (error: any) {
    console.error("Database featured search failed:", error);
    return { error: error.message || error.toString() };
  }
}

export default async function Home() {
  const featuredModelsData = await getFeaturedModels();
  
  if ((featuredModelsData as any).error) {
    return (
      <main className={styles.main}>
        <div className="container" style={{ paddingTop: '100px', paddingBottom: '100px', color: 'red' }}>
          <h2>Database Error on Home Page</h2>
          <pre>{(featuredModelsData as any).error}</pre>
        </div>
      </main>
    );
  }

  const featuredModels = cleanModelsList(featuredModelsData as any[]);

  return (
    <main className={styles.main}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />
        <div className={`container ${styles.heroContent}`}>
          <h1 className={styles.heroTitle}>
            Experience <span className="text-gold">Luxury</span> beyond limits.
          </h1>
          <p className={styles.heroSubtitle}>
            Global access to elite companions for discerning gentlemen.
          </p>
          <div className={styles.heroActions}>
            <Link href="/search" className="btn-primary">
              View All Models <ArrowRight size={18} style={{ marginLeft: "8px" }} />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Models Preview */}
      <section className="section bg-secondary">
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2>Featured Companions</h2>
            <Link href="/search" className="btn-outline">
              View All
            </Link>
          </div>
          
          <div className={styles.grid}>
            {featuredModels.length > 0 ? (
              featuredModels.map((model) => (
                <ModelCard key={model.id} model={model} />
              ))
            ) : (
              <p className="text-secondary">No featured models available at the moment.</p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
