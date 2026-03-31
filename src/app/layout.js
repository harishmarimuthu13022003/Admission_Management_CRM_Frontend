'use client';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Sidebar from './components/Sidebar';
import PageWrapper from './components/PageWrapper';
import './globals.css';

export default function RootLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token && pathname !== '/login') {
      router.push('/login');
    } else {
      setIsAuthenticated(!!token);
    }
    setLoading(false);
  }, [pathname, router]);

  if (loading) {
    return (
      <html lang="en">
        <body>
          <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
            <p className="text-muted">Loading...</p>
          </div>
        </body>
      </html>
    );
  }

  if (pathname === '/login') {
    return (
      <html lang="en">
        <body>{children}</body>
      </html>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <html lang="en">
      <body>
        <div style={{ display: 'flex', minHeight: '100vh' }}>
          <Sidebar />
          <PageWrapper>{children}</PageWrapper>
        </div>
      </body>
    </html>
  );
}
