export default function AboutPage() {
  return (
    <main style={{ paddingTop: '120px', paddingBottom: '4rem', minHeight: '100vh' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <h1 style={{ marginBottom: '2rem', fontSize: '3rem' }}>About Lumina</h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
          Lumina is the world&apos;s premier platform for connecting discerning clients with elite companions. 
          We prioritize potential, elegance, and discretion above all else.
        </p>
        <p style={{ fontSize: '1.1rem', color: 'var(--color-text-secondary)' }}>
          Founded in 2026, our mission is to redefine the industry standards by providing a safe, 
          transparent, and high-end environment for both models and clients.
        </p>
      </div>
    </main>
  );
}
