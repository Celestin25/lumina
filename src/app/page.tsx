import Link from "next/link";
import { ArrowRight, Star, MapPin } from "lucide-react";
import styles from "./page.module.css";
import { PrismaClient } from "@prisma/client";
import ModelCard from "@/components/ModelCard";

const prisma = new PrismaClient();

async function getFeaturedModels() {
  return await prisma.modelProfile.findMany({
    where: { 
      isFeatured: true,
      isVerified: true 
    },
    take: 3,
    include: {
      photos: true,
    }
  });
}

export default async function Home() {
  const featuredModels = await getFeaturedModels();

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
