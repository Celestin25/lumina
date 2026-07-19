'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Home, Image, ThumbsUp, Heart, MessageSquare, Clock, 
  Trophy, Globe2, Sparkles, Video, ShieldAlert, Zap, Compass
} from 'lucide-react';
import styles from './Sidebar.module.css';

interface SidebarCounts {
  specials: {
    worldTournament: number;
    african: number;
    ukrainian: number;
    newModels: number;
    vrCams: number;
    bdsm: number;
  };
  age: {
    teen: number;
    young: number;
    milf: number;
    mature: number;
    granny: number;
  };
  ethnicity: {
    Arab: number;
    Asian: number;
    Ebony: number;
    Indian: number;
    Latina: number;
    Mixed: number;
    White: number;
  };
  bodyType: {
    Slim: number;
    Athletic: number;
    Curvy: number;
    "Big Breast": number;
    Plump: number;
  };
  hairColor: {
    Blonde: number;
    Brunette: number;
    Black: number;
    Redhead: number;
    Bald: number;
  };
}

export default function Sidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [counts, setCounts] = useState<SidebarCounts | null>(null);
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');

  // Fetch counts from database on load
  useEffect(() => {
    fetch('/api/models/counts')
      .then(res => res.json())
      .then(data => {
        if (!data.error) setCounts(data);
      })
      .catch(err => console.error("Error fetching counts:", err));
  }, []);

  // Sync inputs with URL params
  useEffect(() => {
    setMinPrice(searchParams.get('minPrice') || '');
    setMaxPrice(searchParams.get('maxPrice') || '');
  }, [searchParams]);

  // Helper to check if a filter value is active in search parameters
  const isActive = (param: string, value: string) => {
    return searchParams.get(param) === value;
  };

  // Helper to handle filter toggle
  const toggleFilter = (param: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const currentValue = params.get(param);

    if (currentValue === value) {
      params.delete(param); // Clear if clicked again
    } else {
      params.set(param, value);
    }
    
    // Always route to search page when applying filters
    router.push(`/search?${params.toString()}`);
  };

  const handlePriceApply = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (minPrice) params.set('minPrice', minPrice);
    else params.delete('minPrice');

    if (maxPrice) params.set('maxPrice', maxPrice);
    else params.delete('maxPrice');

    router.push(`/search?${params.toString()}`);
  };

  const clearAllFilters = () => {
    setMinPrice('');
    setMaxPrice('');
    router.push('/search');
  };

  // Main menu items
  const menuItems = [
    { label: 'Home', icon: <Home size={18} />, route: '/' },
    { label: 'Gallery', icon: <Image size={18} />, route: '/search?gallery=true' },
    { label: 'Recommended', icon: <ThumbsUp size={18} />, filter: { param: 'recommended', value: 'true' } },
    { label: 'My Favorites', icon: <Heart size={18} />, filter: { param: 'favorites', value: 'true' } },
    { label: 'Best for Privates', icon: <MessageSquare size={18} />, filter: { param: 'privates', value: 'true' } },
    { label: 'Watch History', icon: <Clock size={18} />, filter: { param: 'history', value: 'true' } },
  ];

  return (
    <aside className={styles.sidebar}>
      {/* 50 FREE Cash banner */}
      <div className={styles.tokensBanner}>
        <div className={styles.tokensContent}>
          <div className={styles.tokensLeft}>
            <span className={styles.tokensGold}>50 FREE</span>
            <span className={styles.tokensSub}>Cash to Win Now</span>
          </div>
          <div className={styles.tokensIcon}>💰</div>
        </div>
      </div>

      {/* Main navigation menu */}
      <ul className={styles.navList}>
        {menuItems.map((item, idx) => {
          let active = false;
          if (item.route) {
            active = pathname === item.route && !searchParams.toString();
          } else if (item.filter) {
            active = isActive(item.filter.param, item.filter.value);
          }

          return (
            <li key={idx}>
              <button 
                onClick={() => {
                  if (item.route) router.push(item.route);
                  else if (item.filter) toggleFilter(item.filter.param, item.filter.value);
                }}
                className={`${styles.navItem} ${active ? styles.active : ''}`}
              >
                {item.icon}
                <span className={styles.label}>{item.label}</span>
              </button>
            </li>
          );
        })}
      </ul>

      {/* SPECIALS Section */}
      <div className={styles.section}>
        <h4 className={styles.sectionHeader}>SPECIALS</h4>
        <ul className={styles.filterList}>
          <li>
            <button 
              onClick={() => toggleFilter('featured', 'true')} 
              className={`${styles.filterBtn} ${isActive('featured', 'true') ? styles.activeFilter : ''}`}
            >
              <span className={styles.filterLeft}><Trophy size={14} className={styles.redIcon} /> World Tournament</span>
              <span className={styles.count}>{counts?.specials.worldTournament ?? 63}</span>
            </button>
          </li>
          <li>
            <button 
              onClick={() => toggleFilter('country', 'South Africa')} 
              className={`${styles.filterBtn} ${isActive('country', 'South Africa') ? styles.activeFilter : ''}`}
            >
              <span className={styles.filterLeft}>🌍 African</span>
              <span className={styles.count}>{counts?.specials.african ?? 595}</span>
            </button>
          </li>
          <li>
            <button 
              onClick={() => toggleFilter('country', 'Ukraine')} 
              className={`${styles.filterBtn} ${isActive('country', 'Ukraine') ? styles.activeFilter : ''}`}
            >
              <span className={styles.filterLeft}>🇺🇦 Ukrainian</span>
              <span className={styles.count}>{counts?.specials.ukrainian ?? 127}</span>
            </button>
          </li>
          <li>
            <button 
              onClick={() => toggleFilter('new', 'true')} 
              className={`${styles.filterBtn} ${isActive('new', 'true') ? styles.activeFilter : ''}`}
            >
              <span className={styles.filterLeft}><Zap size={14} className={styles.goldIcon} /> New Models</span>
              <span className={styles.count}>{counts?.specials.newModels ?? 1018}</span>
            </button>
          </li>
          <li>
            <button 
              onClick={() => toggleFilter('vr', 'true')} 
              className={`${styles.filterBtn} ${isActive('vr', 'true') ? styles.activeFilter : ''}`}
            >
              <span className={styles.filterLeft}><Video size={14} className={styles.blueIcon} /> VR Cams</span>
              <span className={styles.count}>{counts?.specials.vrCams ?? 126}</span>
            </button>
          </li>
          <li>
            <button 
              onClick={() => toggleFilter('bdsm', 'true')} 
              className={`${styles.filterBtn} ${isActive('bdsm', 'true') ? styles.activeFilter : ''}`}
            >
              <span className={styles.filterLeft}><ShieldAlert size={14} /> BDSM</span>
              <span className={styles.count}>{counts?.specials.bdsm ?? 48}</span>
            </button>
          </li>
        </ul>
      </div>

      {/* AGE Section */}
      <div className={styles.section}>
        <h4 className={styles.sectionHeader}>AGE</h4>
        <ul className={styles.filterList}>
          {[
            { label: 'Teen 18+', range: 'teen', defaultCount: 1134 },
            { label: 'Young 22+', range: 'young', defaultCount: 3242 },
            { label: 'MILF', range: 'milf', defaultCount: 1256 },
            { label: 'Mature', range: 'mature', defaultCount: 221 },
            { label: 'Granny', range: 'granny', defaultCount: 45 },
          ].map((age, idx) => (
            <li key={idx}>
              <button
                onClick={() => toggleFilter('ageRange', age.range)}
                className={`${styles.filterBtn} ${isActive('ageRange', age.range) ? styles.activeFilter : ''}`}
              >
                <span>{age.label}</span>
                <span className={styles.count}>
                  {counts ? counts.age[age.range as keyof typeof counts.age] : age.defaultCount}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* ETHNICITY Section */}
      <div className={styles.section}>
        <h4 className={styles.sectionHeader}>ETHNICITY</h4>
        <ul className={styles.filterList}>
          {['Arab', 'Asian', 'Ebony', 'Indian', 'Latina', 'Mixed', 'White'].map((eth) => (
            <li key={eth}>
              <button
                onClick={() => toggleFilter('ethnicity', eth)}
                className={`${styles.filterBtn} ${isActive('ethnicity', eth) ? styles.activeFilter : ''}`}
              >
                <span>{eth}</span>
                <span className={styles.count}>
                  {counts ? counts.ethnicity[eth as keyof typeof counts.ethnicity] : 120}
                </span>
              </button>
            </li>
          ))}
        </ul>
        <Link href="/categories" className={styles.allCategoriesBtn}>
          <Compass size={12} style={{ marginRight: '6px' }} /> ALL CATEGORIES
        </Link>
      </div>

      {/* BODY TYPE Section */}
      <div className={styles.section}>
        <h4 className={styles.sectionHeader}>BODY TYPE</h4>
        <ul className={styles.filterList}>
          {['Slim', 'Athletic', 'Curvy', 'Big Breast', 'Plump'].map((bt) => (
            <li key={bt}>
              <button
                onClick={() => toggleFilter('bodyType', bt)}
                className={`${styles.filterBtn} ${isActive('bodyType', bt) ? styles.activeFilter : ''}`}
              >
                <span>{bt}</span>
                <span className={styles.count}>
                  {counts ? counts.bodyType[bt as keyof typeof counts.bodyType] : 85}
                </span>
              </button>
            </li>
          ))}
        </ul>
        <Link href="/categories" className={styles.allCategoriesBtn}>
          <Compass size={12} style={{ marginRight: '6px' }} /> ALL CATEGORIES
        </Link>
      </div>

      {/* HAIR Section */}
      <div className={styles.section}>
        <h4 className={styles.sectionHeader}>HAIR</h4>
        <ul className={styles.filterList}>
          {['Blonde', 'Brunette', 'Black', 'Redhead', 'Bald'].map((hair) => (
            <li key={hair}>
              <button
                onClick={() => toggleFilter('hairColor', hair)}
                className={`${styles.filterBtn} ${isActive('hairColor', hair) ? styles.activeFilter : ''}`}
              >
                <span>{hair}</span>
                <span className={styles.count}>
                  {counts ? counts.hairColor[hair as keyof typeof counts.hairColor] : 75}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* PRICE RANGE Section */}
      <div className={styles.section}>
        <h4 className={styles.sectionHeader}>PRICE RANGE (USD / hr)</h4>
        <form onSubmit={handlePriceApply} className={styles.priceForm}>
          <div className={styles.priceInputs}>
            <input 
              type="number" 
              placeholder="Min" 
              value={minPrice} 
              onChange={(e) => setMinPrice(e.target.value)}
              className={styles.priceInput}
            />
            <span className={styles.priceDash}>-</span>
            <input 
              type="number" 
              placeholder="Max" 
              value={maxPrice} 
              onChange={(e) => setMaxPrice(e.target.value)}
              className={styles.priceInput}
            />
          </div>
          <button type="submit" className={styles.priceApplyBtn}>
            Apply Price
          </button>
        </form>
      </div>

      {/* Reset all filters */}
      {searchParams.toString() && (
        <button onClick={clearAllFilters} className={styles.clearBtn}>
          Clear All Filters
        </button>
      )}
    </aside>
  );
}
