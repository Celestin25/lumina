'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { africanLocations, worldLocations } from '@/locations/data';
import styles from './page.module.css'; // We'll share styles or move them

export default function SearchFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const currentCountry = searchParams.get('country') || '';
  const currentCity = searchParams.get('city') || '';
  
  // Determine initial region based on currentCountry
  const isAfrica = africanLocations.some(l => l.country === currentCountry);
  const isWorld = worldLocations.some(l => l.country === currentCountry);
  
  const [region, setRegion] = useState<'africa' | 'world' | ''>(
    isAfrica ? 'africa' : isWorld ? 'world' : ''
  );
  
  const [selectedCountry, setSelectedCountry] = useState(currentCountry);
  const [selectedCity, setSelectedCity] = useState(currentCity);

  // Get available countries based on region
  const availableCountries = region === 'africa' 
    ? africanLocations 
    : region === 'world' 
      ? worldLocations 
      : [...africanLocations, ...worldLocations];

  // Get available cities based on country
  const availableCities = selectedCountry 
    ? availableCountries.find(c => c.country === selectedCountry)?.cities || []
    : [];

  const handleRegionChange = (r: 'africa' | 'world') => {
    setRegion(r);
    setSelectedCountry('');
    setSelectedCity('');
  };

  const handleApply = () => {
    const params = new URLSearchParams();
    if (selectedCountry) params.set('country', selectedCountry);
    if (selectedCity) params.set('city', selectedCity);
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className={styles.filterCard}>
      <h3>Filter Results</h3>
      
      <div className={styles.formGroup}>
        <label>Region</label>
        <div style={{display: 'flex', gap: '10px'}}>
          <button 
            type="button"
            className={`${styles.regionBtn} ${region === 'africa' ? styles.active : ''}`}
            onClick={() => handleRegionChange('africa')}
          >
            Africa
          </button>
          <button 
            type="button"
            className={`${styles.regionBtn} ${region === 'world' ? styles.active : ''}`}
            onClick={() => handleRegionChange('world')}
          >
            World
          </button>
        </div>
      </div>

      <div className={styles.formGroup}>
        <label>Country</label>
        <select 
          value={selectedCountry} 
          onChange={(e) => {
            setSelectedCountry(e.target.value);
            setSelectedCity('');
          }}
          className={styles.select}
        >
          <option value="">All Countries</option>
          {availableCountries.map(c => (
            <option key={c.country} value={c.country}>{c.country}</option>
          ))}
        </select>
      </div>

      <div className={styles.formGroup}>
        <label>City (Capital/Major)</label>
        <select 
          value={selectedCity} 
          disabled={!selectedCountry}
          onChange={(e) => setSelectedCity(e.target.value)}
          className={styles.select}
        >
          <option value="">All Cities</option>
          {availableCities.map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </div>

      <button onClick={handleApply} className="btn-primary" style={{width: '100%'}}>
        Update Results
      </button>
    </div>
  );
}
