'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { regions, allLocations, countryFlag } from '@/locations/data';
import styles from './page.module.css'; // We'll share styles or move them

export default function SearchFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Convert URLSearchParams to state
  const currentCountry = searchParams.get('country') || '';
  const currentCity = searchParams.get('city') || '';
  const currentEthnicity = searchParams.get('ethnicity') || '';

  // Determine initial region based on currentCountry
  const initialRegion = currentCountry
    ? regions.find(r => r.locations.some(l => l.country === currentCountry))?.name || ''
    : '';

  const [region, setRegion] = useState<string>(initialRegion);
  const [selectedCountry, setSelectedCountry] = useState(currentCountry);
  const [selectedCity, setSelectedCity] = useState(currentCity);
  const [selectedEthnicity, setSelectedEthnicity] = useState(currentEthnicity);

  // Get available countries based on region
  const availableCountries = region
    ? regions.find(r => r.name === region)?.locations || []
    : allLocations;

  // Get available cities based on country
  const availableCities = selectedCountry
    ? allLocations.find(c => c.country === selectedCountry)?.cities || []
    : [];

  const handleRegionChange = (name: string) => {
    setRegion(prev => (prev === name ? '' : name));
    setSelectedCountry('');
    setSelectedCity('');
  };

  const handleApply = () => {
    const params = new URLSearchParams();
    if (selectedCountry) params.set('country', selectedCountry);
    if (selectedCity) params.set('city', selectedCity);
    if (selectedEthnicity) params.set('ethnicity', selectedEthnicity);
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className={styles.filterCard}>
      <h3>Filter Results</h3>

      <div className={styles.formGroup}>
        <label>Region</label>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {regions.map(r => (
            <button
              key={r.name}
              type="button"
              className={`${styles.regionBtn} ${region === r.name ? styles.active : ''}`}
              onClick={() => handleRegionChange(r.name)}
            >
              {r.icon} {r.name}
            </button>
          ))}
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
            <option key={c.country} value={c.country}>
              {countryFlag(c.country)} {c.country}
            </option>
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

      <div className={styles.formGroup}>
        <label>Ethnicity</label>
        <select
          value={selectedEthnicity}
          onChange={(e) => setSelectedEthnicity(e.target.value)}
          className={styles.select}
        >
          <option value="">All Ethnicities</option>
          <option value="Black">Black</option>
          <option value="White">White</option>
          <option value="Mixed">Mixed</option>
          <option value="Latino">Latino</option>
          <option value="Asian">Asian</option>
        </select>
      </div>

      <button onClick={handleApply} className="btn-primary" style={{ width: '100%' }}>
        Update Results
      </button>
    </div>
  );
}
