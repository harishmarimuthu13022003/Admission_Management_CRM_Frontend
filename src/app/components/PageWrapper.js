'use client';

export default function PageWrapper({ children }) {
  return (
    <main style={{
      marginLeft: '260px',
      flex: 1,
      padding: '2rem',
      minHeight: '100vh',
      backgroundColor: 'var(--bg)'
    }}>
      {children}
    </main>
  );
}
