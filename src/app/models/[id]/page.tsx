import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { cleanModelData } from '@/lib/data-utils';
import Link from 'next/link';
import { MapPin, Star, Check, ArrowLeft } from 'lucide-react';
import styles from './page.module.css';

export const dynamic = 'force-dynamic';

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

export default async function ModelPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const rawModel = await getModel(resolvedParams.id);
  const model = cleanModelData(rawModel);

  if (!model) {
    notFound();
  }

  // Format WhatsApp Link using the model's phone number or a placeholder if missing
  const cleanPhone = (model as any).phone ? (model as any).phone.replace(/[^0-9]/g, '') : '1234567890';
  const whatsappLink = `https://wa.me/${cleanPhone}?text=Hi%20${model.displayName},%20I%20saw%20your%20profile%20on%20Lumina.`;

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
            style={{ 
              backgroundImage: `url(${
                model.photos[0] ? (model.photos[0].url.startsWith('data:') ? `/api/photos/${model.photos[0].id}` : model.photos[0].url) : ''
              })` 
            }}
          />
          <div className={styles.thumbnails}>
            {model.photos.slice(1).map((photo: any) => (
              <div 
                key={photo.id} 
                className={styles.thumbnail}
                style={{ backgroundImage: `url(${photo.url.startsWith('data:') ? `/api/photos/${photo.id}` : photo.url})` }}
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
              {model.services.map((service: any) => (
                <span key={service.id} className={styles.tag}>{service.name}</span>
              ))}
            </div>
          </section>

          <div className={styles.bookingCard}>
            <div className={styles.priceRow}>
              <span className={styles.priceLabel}>Hourly Rate</span>
              <span className={styles.priceValue}>${model.hourlyRate}</span>
            </div>
            
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{width: '100%', display: 'flex', justifyContent: 'center', marginBottom: '1rem'}}>
              Contact via WhatsApp
            </a>
            
            <button className="btn-outline" style={{width: '100%'}}>
              Request Booking
            </button>
            <p className={styles.disclaimer}>* No payment required until confirmation</p>
          </div>
        </div>
      </div>
    </main>
  );
}
