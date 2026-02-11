import Link from 'next/link';
import { Star, MapPin, Briefcase, Phone, Heart } from 'lucide-react';
import styles from './ModelCard.module.css';

interface Service {
  id: string;
  name: string;
}

interface ModelProps {
  id: string;
  displayName: string;
  age: number;
  city: string;
  country: string;
  hourlyRate: number;
  rating: number;
  bio?: string | null;
  photos: { id: string; url: string }[];
  services?: Service[];
  isVerified?: boolean;
}

export default function ModelCard({ model }: { model: ModelProps }) {
  // Use first photo or placeholder
  const mainPhoto = model.photos.length > 0 ? model.photos[0].url : 'https://via.placeholder.com/400x500?text=No+Photo';
  
  // Get first service or default
  const mainService = model.services && model.services.length > 0 ? model.services[0].name : 'Companion';

  return (
    <div className={styles.card}>
      <Link href={`/models/${model.id}`} className={styles.imageContainer}>
        <img src={mainPhoto} alt={model.displayName} className={styles.image} />
        <span className={styles.serviceTag}>{mainService}</span>
        {model.isVerified && <span className={styles.premiumBadge}>PREMIUM</span>}
      </Link>
      
      <div className={styles.content}>
        <div className={styles.header}>
          <h3 className={styles.name}>{model.displayName}</h3>
          <div className={styles.location}>
            <MapPin size={12} />
            <span>{model.city || 'Unknown'}</span>
          </div>
        </div>
        
        <div className={styles.rating}>
           {[...Array(5)].map((_, i) => (
             <Star 
               key={i} 
               size={12} 
               fill={i < Math.floor(model.rating) ? "#fbbf24" : "none"} 
               color={i < Math.floor(model.rating) ? "#fbbf24" : "#d1d5db"} // Gold or Gray
             />
           ))}
        </div>

        <p className={styles.bio}>
          {model.bio || "No bio available."}
        </p>

        <div className={styles.footer}>
          <button className={`${styles.actionBtn} ${styles.btnBriefcase}`} title="Portfolio">
            <Briefcase size={20} />
          </button>
          
          <Link href={`/models/${model.id}`} className={`${styles.actionBtn} ${styles.btnCall}`} title="Contact">
             <Phone size={18} />
          </Link>
          
          <button className={`${styles.actionBtn} ${styles.btnLike}`} title="Save">
            <Heart size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
