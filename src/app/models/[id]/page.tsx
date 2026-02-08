import { PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MapPin, Star, Check, ArrowLeft } from 'lucide-react';
import styles from './page.module.css';

const prisma = new PrismaClient();

async function getModel(id: string) {
  const model = await prisma.modelProfile.findUnique({
    where: { id },
    include: {
      photos: true,
      services: true,
      reviews: true,
    },
  });

  if (!model) return null;
  return model;
}

export default async function ModelPage({ params }: { params: { id: string } }) {
  const model = await getModel(params.id);

  if (!model) {
    notFound();
  }

  return (
    <main className={styles.main}>
      <Link href="/search" className={styles.backLink}>
        <ArrowLeft size={20} /> Back to Search
      </Link>

      <div className={`container ${styles.grid}`}>
        {/* Left Column: Photos */}
        <div className={styles.gallery}>
          <div 
            className={styles.mainImage}
            style={{ backgroundImage: `url(${model.photos[0]?.url || ''})` }}
          />
          <div className={styles.thumbnails}>
            {model.photos.slice(1).map((photo) => (
              <div 
                key={photo.id} 
                className={styles.thumbnail}
                style={{ backgroundImage: `url(${photo.url})` }}
              />
            ))}
          </div>
        </div>

        {/* Right Column: Details */}
        <div className={styles.details}>
          <header className={styles.header}>
            <div className={styles.titleRow}>
              <h1>{model.displayName}</h1>
              <div className={styles.verifiedBadge}><Check size={14} /> Verified</div>
            </div>
            <div className={styles.meta}>
              <span className={styles.location}><MapPin size={16} /> {model.city}, {model.country}</span>
              <span className={styles.rating}><Star size={16} fill="#d4af37" color="#d4af37"/> {model.rating} ({model.reviewCount} reviews)</span>
            </div>
          </header>

          <section className={styles.section}>
            <h2>About</h2>
            <p className={styles.bio}>{model.bio}</p>
          </section>

          <section className={styles.statsGrid}>
            <div className={styles.statBox}>
              <span className={styles.statLabel}>Age</span>
              <span className={styles.statValue}>{model.age}</span>
            </div>
            <div className={styles.statBox}>
              <span className={styles.statLabel}>Height</span>
              <span className={styles.statValue}>{model.height}cm</span>
            </div>
            <div className={styles.statBox}>
              <span className={styles.statLabel}>Weight</span>
              <span className={styles.statValue}>{model.weight}kg</span>
            </div>
          </section>

          <section className={styles.section}>
            <h2>Services</h2>
            <div className={styles.tags}>
              {model.services.map((service) => (
                <span key={service.id} className={styles.tag}>{service.name}</span>
              ))}
            </div>
          </section>

          <div className={styles.bookingCard}>
            <div className={styles.priceRow}>
              <span className={styles.priceLabel}>Hourly Rate</span>
              <span className={styles.priceValue}>${model.hourlyRate}</span>
            </div>
            <button className="btn-primary" style={{width: '100%'}}>
              Request Booking
            </button>
            <p className={styles.disclaimer}>* No payment required until confirmation</p>
          </div>
        </div>
      </div>
    </main>
  );
}
