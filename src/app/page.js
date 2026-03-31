'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import {
  Users,
  CheckCircle2,
  Clock,
  PieChart,
  FileText,
  Wallet
} from 'lucide-react';

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/dashboard/summary');
        setStats(response.data);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="text-muted">Loading dashboard...</div>;
  if (!stats) return <div className="text-muted">Error loading metrics.</div>;

  return (
    <div>
      <h1>Admission Overview</h1>

      <div className="grid-cols-3" style={{ marginBottom: '2.5rem' }}>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="form-label">Total Intake</span>
            <Users size={20} className="text-muted" />
          </div>
          <div className="stat-value">{stats.totalIntake}</div>
          <div className="text-muted" style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>
            Total capacity across all programs
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="form-label">Filled Seats</span>
            <CheckCircle2 size={20} className="text-muted" />
          </div>
          <div className="stat-value" style={{ color: 'var(--success)' }}>{stats.totalAdmitted}</div>
          <div className="text-muted" style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>
            Seats currently occupied
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="form-label">Available</span>
            <Clock size={20} className="text-muted" />
          </div>
          <div className="stat-value" style={{ color: 'var(--warning)' }}>{stats.remainingSeats}</div>
          <div className="text-muted" style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>
            Seats left for allocation
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <PieChart size={20} />
            <h2>Quota-wise Distribution</h2>
          </div>
          <table>
            <thead>
              <tr>
                <th>Quota Type</th>
                <th>Allocated</th>
                <th>Filled</th>
                <th>Remaining</th>
                <th>Filling %</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(stats.quotaStats).map(([key, data]) => (
                <tr key={key}>
                  <td><span className={`badge ${key === 'KCET' ? 'badge-info' : 'badge-warning'}`}>{key}</span></td>
                  <td>{data.allocated}</td>
                  <td>{data.filled}</td>
                  <td>{data.remaining}</td>
                  <td>
                    <div style={{ width: '100%', backgroundColor: '#334155', borderRadius: '4px', height: '8px' }}>
                      <div style={{
                        width: `${(data.filled / data.allocated) * 100 || 0}%`,
                        backgroundColor: 'var(--primary)',
                        height: '100%',
                        borderRadius: '4px'
                      }} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <FileText size={20} color="var(--warning)" />
              <h3>Pending Documents</h3>
            </div>
            <div className="stat-value" style={{ fontSize: '1.5rem' }}>{stats.pendingDocs}</div>
            <span className="text-muted">Applicants requiring verification</span>
          </div>

          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Wallet size={20} color="var(--danger)" />
              <h3>Pending Fees</h3>
            </div>
            <div className="stat-value" style={{ fontSize: '1.5rem' }}>{stats.pendingFees}</div>
            <span className="text-muted">Confirmed seats without payment</span>
          </div>
        </div>
      </div>
    </div>
  );
}
