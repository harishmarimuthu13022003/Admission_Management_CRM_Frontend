'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  UserCheck,
  ClipboardList,
  Building2,
  LogOut,
  ChevronRight
} from 'lucide-react';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/master', label: 'Master Setup', icon: Building2 },
  { href: '/applicants', label: 'Applicants', icon: ClipboardList },
  { href: '/admissions', label: 'Admissions', icon: UserCheck },
  { href: '/users', label: 'Users', icon: Users },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('permissions');
    router.push('/login');
  };

  return (
    <nav style={{
      width: '260px',
      backgroundColor: '#0F172A',
      borderRight: '1px solid #1E293B',
      padding: '1.5rem 1rem',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
      zIndex: 50
    }}>
      <div style={{ marginBottom: '2rem', padding: '0 0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            backgroundColor: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <GraduationCap size={20} color="white" />
          </div>
          <div>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>AdmissionCRM</h2>
            <span className="text-muted" style={{ fontSize: '0.75rem' }}>Campus Management</span>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        {navItems.filter(item => {
          if (!user) return false;
          if (user.role === 'Admin') return true;
          if (user.role === 'Admission Officer') {
            return ['Dashboard', 'Applicants', 'Admissions'].includes(item.label);
          }
          if (user.role === 'Management') {
            return item.label === 'Dashboard';
          }
          return false;
        }).map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem',
                borderRadius: '8px',
                color: isActive ? 'white' : 'var(--text-muted)',
                backgroundColor: isActive ? 'rgba(79, 70, 229, 0.1)' : 'transparent',
                textDecoration: 'none',
                fontSize: '0.9rem',
                fontWeight: isActive ? 600 : 400,
                transition: 'all 0.15s'
              }}
            >
              <Icon size={18} />
              <span style={{ flex: 1 }}>{item.label}</span>
              {isActive && <ChevronRight size={16} />}
            </Link>
          );
        })}
      </div>

      <div style={{ borderTop: '1px solid #1E293B', paddingTop: '1rem' }}>
        {user && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.75rem',
            marginBottom: '0.5rem',
            borderRadius: '8px',
            backgroundColor: 'rgba(255,255,255,0.03)'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'rgba(79, 70, 229, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.85rem',
              fontWeight: 600
            }}>
              {user.fullName?.charAt(0) || user.username?.charAt(0) || '?'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.fullName || user.username}
              </div>
              <div className="text-muted" style={{ fontSize: '0.75rem' }}>{user.role}</div>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.75rem',
            width: '100%',
            border: 'none',
            background: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            borderRadius: '8px',
            fontSize: '0.9rem'
          }}
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
}
