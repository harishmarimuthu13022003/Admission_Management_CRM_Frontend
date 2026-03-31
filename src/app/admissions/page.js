'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function AdmissionsPage() {
  const [lockedApplicants, setLockedApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const { data } = await api.get('/admission/applicants');
      setLockedApplicants(data.filter(a => a.admissionStatus !== 'Draft'));
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleUpdate = async (id, updates) => {
    try {
      await api.put(`/admission/update-status/${id}`, updates);
      fetchData();
    } catch (err) { alert(err.response?.data?.error || 'Update failed'); }
  };

  const handleConfirm = async (id) => {
    try {
      const { data } = await api.post(`/admission/confirm/${id}`);
      alert('Admission Confirmed\n\nGenerated Admission Number: ' + data.admissionNumber);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || 'Confirmation Failed');
    }
  };

  if (loading) return <div className="text-muted">Loading admissions...</div>;

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1>Admission Confirmation</h1>
        <p className="text-muted">Finalize admissions by verifying documents and fee payments.</p>
      </div>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Applicant</th>
              <th>Program</th>
              <th>Quota</th>
              <th>Docs Status</th>
              <th>Fee Status</th>
              <th>Final Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {lockedApplicants.map(app => (
              <tr key={app._id}>
                <td>
                  <div style={{ fontWeight: 600 }}>{app.fullName}</div>
                  <div className="text-muted" style={{ fontSize: '0.825rem' }}>{app.admissionNumber || 'ID Pending'}</div>
                </td>
                <td>{app.programId?.name}</td>
                <td>{app.quotaType}</td>
                <td>
                  <select
                    className="form-control"
                    style={{ padding: '0.25rem', fontSize: '0.8rem' }}
                    value={app.documentStatus}
                    onChange={(e) => handleUpdate(app._id, { documentStatus: e.target.value })}
                    disabled={app.admissionStatus === 'Confirmed'}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Submitted">Submitted</option>
                    <option value="Verified">Verified</option>
                  </select>
                </td>
                <td>
                  <select
                    className="form-control"
                    style={{ padding: '0.25rem', fontSize: '0.8rem' }}
                    value={app.feeStatus}
                    onChange={(e) => handleUpdate(app._id, { feeStatus: e.target.value })}
                    disabled={app.admissionStatus === 'Confirmed'}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                  </select>
                </td>
                <td>
                  <span className={`badge ${app.admissionStatus === 'Confirmed' ? 'badge-success' : 'badge-info'}`}>
                    {app.admissionStatus}
                  </span>
                </td>
                <td>
                  {app.admissionStatus === 'SeatLocked' && (
                    <button
                      className="btn btn-primary btn-sm"
                      style={{
                        padding: '0.4rem 0.8rem',
                        fontSize: '0.75rem',
                        opacity: (app.documentStatus === 'Verified' && app.feeStatus === 'Paid') ? 1 : 0.5
                      }}
                      onClick={() => handleConfirm(app._id)}
                      disabled={!(app.documentStatus === 'Verified' && app.feeStatus === 'Paid')}
                    >
                      <CheckCircle2 size={14} /> Confirm
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {lockedApplicants.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '3rem' }} className="text-muted">No locked seats found for confirmation.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <div className="card" style={{ display: 'inline-flex', alignItems: 'center', gap: '1rem', background: 'rgba(79, 70, 229, 0.05)' }}>
          <ShieldCheck size={24} color="var(--primary)" />
          <div>
            <h4 style={{ margin: 0 }}>System Guard Rails</h4>
            <p className="text-muted" style={{ margin: 0, fontSize: '0.85rem' }}>Admission number generated ONLY AFTER Fee is Marked Paid & Documents Verified.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
