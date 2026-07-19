import Link from 'next/link';
import { Phone, Smartphone, Flame } from 'lucide-react';
import FavoriteButton from './FavoriteButton';
import { countryFlag } from '@/locations/data';
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
  ethnicity?: string | null;
  bodyType?: string | null;
  hairColor?: string | null;
  gender?: string | null;
  bio?: string | null;
  photos: { id: string; url: string }[];
  services?: Service[];
  isVerified?: boolean;
  isFeatured?: boolean;
  phone?: string | null;
}

export default function ModelCard({ model }: { model: ModelProps }) {
  // Select photo
  let mainPhoto = 'https://via.placeholder.com/400x500?text=No+Photo';
  if (model.photos && model.photos.length > 0) {
    const photo = model.photos[0];
    if (photo.url && photo.url.startsWith('http')) {
      mainPhoto = photo.url;
    } else {
      mainPhoto = `/api/photos/${photo.id}`;
    }
  }

  // Format WhatsApp Link
  const cleanPhone = model.phone ? model.phone.replace(/[^0-9]/g, '') : '1234567890';
  const whatsappLink = `https://wa.me/${cleanPhone}?text=Hi%20${model.displayName},%20I%20saw%20your%20profile%20on%20STRIPCHAT.`;

  // Determine flag
  const flag = countryFlag(model.country);

  // Indicators
  const hasToy = model.isVerified;
  const isMobile = !!model.phone;

  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        <Link href={`/models/${model.id}`} className={styles.imageLink}>
          <img src={mainPhoto} alt={model.displayName} className={styles.image} />
          
          {/* Top Left Icons */}
          <div className={styles.topLeftBadges}>
            {isMobile && (
              <div className={styles.iconBadge} title="Mobile Cam Enabled">
                <Smartphone size={10} />
              </div>
            )}
            {hasToy && (
              <div className={styles.iconBadge} title="Interactive Vibrator Enabled">
                <Flame size={10} className={styles.toyIcon} />
              </div>
            )}
          </div>

          {/* Top Right "NEW" Badge */}
          <div className={styles.topRightBadges}>
            {model.isFeatured && (
              <span className={styles.newBadge}>NEW</span>
            )}
          </div>

          {/* Bottom Gradient overlay */}
          <div className={styles.bottomOverlay}>
            <div className={styles.infoRow}>
              <span className={styles.name}>{model.displayName}</span>
              <span className={styles.flag} title={model.country}>{flag}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.rate}>${model.hourlyRate} / hr</span>
              <span className={styles.tag}>
                {model.age} • {model.ethnicity || 'Mixed'}
              </span>
            </div>
          </div>
        </Link>
      </div>

      {/* Floating Action Overlay on Hover */}
      <div className={styles.hoverActions}>
        <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className={styles.chatBtn} title="Chat Live on WhatsApp">
          <Phone size={12} style={{ marginRight: '4px' }} /> Chat
        </a>
        <div className={styles.favWrapper}>
          <FavoriteButton modelId={model.id} />
        </div>
      </div>
    </div>
  );
}
