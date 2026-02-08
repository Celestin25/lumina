import Link from 'next/link';
import { Star, MapPin } from 'lucide-react';
// import Image from 'next/image'; // Use standard img for external URLs if domain not configured
import styles from './ModelCard.module.css';

interface ModelProps {
  id: string;
  displayName: string;
  age: number;
  city: string;
  country: string;
  hourlyRate: number;
  rating: number;
  photos: { id: string; url: string }[];
}

export default function ModelCard({ model }: { model: ModelProps }) {
  // Use first photo or placeholder
  const mainPhoto = model.photos.length > 0 ? model.photos[0].url : 'https://via.placeholder.com/400x500?text=No+Photo';

  return (
    <Link href={`/models/${model.id}`} className={styles.card}>
      <div 
        className={styles.image} 
        style={{ backgroundImage: `url(${mainPhoto})` }}
      />
      <div className={styles.content}>
        <div className={styles.header}>
          <h3 className={styles.name}>{model.displayName}, {model.age}</h3>
          <div className={styles.rating}>
            <Star size={14} fill="#d4af37" color="#d4af37" />
            <span>{model.rating.toFixed(1)}</span>
          </div>
        </div>
        
        <div className={styles.location}>
          <MapPin size={14} />
          <span>{model.city}, {model.country}</span>
        </div>
        
        <div className={styles.footer}>
          <span className={styles.price}>${model.hourlyRate}/hr</span>
          <span className={styles.viewBtn}>View Profile</span>
        </div>
      </div>
    </Link>
  );
}
