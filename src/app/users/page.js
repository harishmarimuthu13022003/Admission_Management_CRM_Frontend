'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { UserPlus, UserCircle, Shield, Trash2, Mail, Lock } from 'lucide-react';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    fullName: '',
    role: 'Admission Officer'
  });

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/auth/users');
      setUsers(data);
    } catch (err) { console.error('Error fetching users:', err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', newUser);
      setShowModal(false);
      setNewUser({ username: '', password: '', fullName: '', role: 'Admission Officer' });
      fetchUsers();
    } catch (err) { alert(err.response?.data?.error || 'Registration failed'); }
  };

  if (loading) return <div className="text-muted">Loading user database...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1>User Management</h1>
          <p className="text-muted">Manage roles and access for campus staff.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <UserPlus size={18} /> Add New User
        </button>
      </div>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Staff Name</th>
              <th>Username</th>
              <th>Role</th>
              <th>Created On</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <UserCircle size={20} className="text-muted" />
                    </div>
                    <span style={{ fontWeight: 600 }}>{u.fullName || 'No Name'}</span>
                  </div>
                </td>
                <td>{u.username}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Shield size={14} color={u.role === 'Admin' ? 'var(--danger)' : u.role === 'Admission Officer' ? 'var(--primary)' : 'var(--warning)'} />
                    <span className={`badge ${u.role === 'Admin' ? 'badge-danger' : u.role === 'Admission Officer' ? 'badge-info' : 'badge-warning'}`}>
                      {u.role}
                    </span>
                  </div>
                </td>
                <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                <td><span className="badge-success badge">Active</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div className="card" style={{ width: '450px', padding: '2.5rem' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>Create Staff Account</h2>
            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <div style={{ position: 'relative' }}>
                  <UserCircle size={18} className="text-muted" style={{ position: 'absolute', top: '13px', left: '12px' }} />
                  <input className="form-control" style={{ paddingLeft: '2.5rem' }} value={newUser.fullName} onChange={e => setNewUser({...newUser, fullName: e.target.value})} required />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Username</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} className="text-muted" style={{ position: 'absolute', top: '13px', left: '12px' }} />
                  <input className="form-control" style={{ paddingLeft: '2.5rem' }} value={newUser.username} onChange={e => setNewUser({...newUser, username: e.target.value})} required />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Temporary Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} className="text-muted" style={{ position: 'absolute', top: '13px', left: '12px' }} />
                  <input className="form-control" style={{ paddingLeft: '2.5rem' }} type="password" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} required />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Access Role</label>
                <select className="form-control" value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})}>
                  <option value="Admin">Admin (Full Access)</option>
                  <option value="Admission Officer">Admission Officer</option>
                  <option value="Management">Management (Read Only Dashboard)</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Create Account</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
