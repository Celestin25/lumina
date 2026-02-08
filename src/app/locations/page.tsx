export default function LocationsPage() {
  const locations = [
    { country: 'France', cities: ['Paris', 'Nice', 'Cannes'] },
    { country: 'United Kingdom', cities: ['London', 'Manchester'] },
    { country: 'United Arab Emirates', cities: ['Dubai', 'Abu Dhabi'] },
    { country: 'USA', cities: ['New York', 'Los Angeles', 'Miami'] },
  ];

  return (
    <main style={{ paddingTop: '120px', paddingBottom: '4rem', minHeight: '100vh' }}>
      <div className="container">
        <h1 style={{ marginBottom: '3rem', fontSize: '3rem' }}>Our Locations</h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '2rem' }}>
          {locations.map((loc) => (
            <div key={loc.country} style={{ 
              background: 'var(--color-bg-secondary)', 
              padding: '2rem', 
              borderRadius: 'var(--border-radius-generic)',
              border: '1px solid rgba(255,255,255,0.05)'
            }}>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--color-accent-primary)' }}>{loc.country}</h2>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {loc.cities.map((city) => (
                  <li key={city} style={{ marginBottom: '0.5rem', color: 'var(--color-text-secondary)' }}>
                    {city}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
