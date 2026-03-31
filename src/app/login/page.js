'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { LogIn, User, Lock, AlertCircle, GraduationCap } from 'lucide-react';

const AUTH_URL = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/login`;

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(AUTH_URL, { username, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('permissions', JSON.stringify(response.data.permissions));
      router.push('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      height: '100vh', 
      width: '100vw', 
      alignItems: 'center', 
      justifyContent: 'center', 
      backgroundColor: '#020617', 
      margin: 0, 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      zIndex: 9999,
      backgroundImage: 'radial-gradient(circle at 50% 50%, #1e1b4b 0%, #020617 100%)'
    }}>
      <div className="card" style={{ 
        width: '420px', 
        padding: '3rem', 
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backgroundColor: 'rgba(15, 23, 42, 0.8)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ 
            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', 
            width: '56px', 
            height: '56px', 
            borderRadius: '16px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            margin: '0 auto 1.5rem',
            boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.4)'
          }}>
            <GraduationCap color="white" size={32} />
          </div>
          <h1 style={{ 
            fontSize: '2rem', 
            marginBottom: '0.5rem',
            background: 'linear-gradient(to bottom, #ffffff, #94a3b8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>Welcome Back</h1>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>Sign in to manage admissions</p>
        </div>

        {error && (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75rem', 
            padding: '1rem', 
            backgroundColor: 'rgba(239, 68, 68, 0.1)', 
            border: '1px solid rgba(239, 68, 68, 0.2)',
            color: '#f87171', 
            borderRadius: '12px', 
            marginBottom: '1.5rem', 
            fontSize: '0.9rem' 
          }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label" style={{ color: '#cbd5e1', marginBottom: '0.6rem' }}>Username</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ 
                position: 'absolute', 
                top: '50%', 
                left: '14px', 
                transform: 'translateY(-50%)',
                color: '#64748b'
              }} />
              <input
                type="text"
                className="form-control"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
                style={{ paddingLeft: '2.75rem', height: '48px', backgroundColor: 'rgba(2, 6, 23, 0.4)' }}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '2.5rem' }}>
            <label className="form-label" style={{ color: '#cbd5e1', marginBottom: '0.6rem' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ 
                position: 'absolute', 
                top: '50%', 
                left: '14px', 
                transform: 'translateY(-50%)',
                color: '#64748b'
              }} />
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{ paddingLeft: '2.75rem', height: '48px', backgroundColor: 'rgba(2, 6, 23, 0.4)' }}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ 
              width: '100%', 
              height: '50px', 
              fontSize: '1rem',
              letterSpacing: '0.025em',
              boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.4)'
            }}
            disabled={loading}
          >
            <LogIn size={18} style={{ marginRight: '8px' }} />
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div style={{ marginTop: '2.5rem', textAlign: 'center', fontSize: '0.85rem', color: '#64748b' }}>
          Contact administrator if you forgot credentials.
        </div>
      </div>
    </div>
  );
}
