'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { UserPlus, Search, Filter, AlertTriangle, User, GraduationCap, ClipboardCheck, X } from 'lucide-react';

export default function ApplicantsPage() {
  const [applicants, setApplicants] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterQuota, setFilterQuota] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [quotaAvailability, setQuotaAvailability] = useState(null);
  const [newApp, setNewApp] = useState({
    fullName: '', dob: '', gender: 'Male', category: 'GM',
    parentName: '', phone: '', email: '',
    sslcPercentage: '', pucPercentage: '', qualifyingExam: 'KCET', examRegisterNumber: '',
    programId: '', flowType: 'Government', quotaType: 'KCET', entryType: 'Regular', allotmentNumber: '',
  });

  const fetchApplicants = async () => {
    try {
      const { data } = await api.get('/admission/applicants');
      setApplicants(data);
      const { data: p } = await api.get('/master/program');
      setPrograms(p);
    } catch (err) { console.error('Error:', err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchApplicants(); }, []);

  useEffect(() => {
    if (newApp.programId) {
      api.get(`/admission/quota-availability/${newApp.programId}`)
        .then(({ data }) => setQuotaAvailability(data))
        .catch(() => setQuotaAvailability(null));
    } else {
      setQuotaAvailability(null);
    }
  }, [newApp.programId]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admission/applicant', newApp);
      setShowModal(false);
      setNewApp({
        fullName: '', dob: '', gender: 'Male', category: 'GM',
        parentName: '', phone: '', email: '',
        sslcPercentage: '', pucPercentage: '', qualifyingExam: 'KCET', examRegisterNumber: '',
        programId: '', quotaType: 'KCET', flowType: 'Government',
        allotmentNumber: '', entryType: 'Regular',
      });
      fetchApplicants();
    } catch (err) { alert(err.response?.data?.error || 'Error creating applicant'); }
  };

  const handleAllocate = async (id) => {
    if (!confirm('Proceed to lock this seat? This will update real-time quota counters.')) return;
    try {
      const { data } = await api.post(`/admission/allocate/${id}`);
      alert(data.message);
      fetchApplicants();
    } catch (err) {
      alert(err.response?.data?.error || 'Allocation Failed');
    }
  };

  // Logic for filtered results
  const filteredApplicants = applicants.filter(app => {
    const matchesSearch = 
      app.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      app.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.phone?.includes(searchTerm);
    
    const matchesQuota = filterQuota === '' || app.quotaType === filterQuota;
    const matchesStatus = filterStatus === '' || app.admissionStatus === filterStatus;

    return matchesSearch && matchesQuota && matchesStatus;
  });

  if (loading) return <div className="text-muted">Loading applicant records...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1>Applicant Management</h1>
          <p className="text-muted">Search, filter, and manage student admissions.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <UserPlus size={18} /> New Applicant Form
        </button>
      </div>

      {/* SEARCH AND FILTERS BAR */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '300px' }}>
            <Search size={16} className="text-muted" style={{ position: 'absolute', top: '50%', left: '12px', transform: 'translateY(-50%)' }} />
            <input 
              className="form-control" 
              style={{ paddingLeft: '2.5rem' }} 
              placeholder="Search by name, email, or phone..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && <X size={14} className="text-muted" style={{ position: 'absolute', top: '50%', right: '12px', transform: 'translateY(-50%)', cursor: 'pointer' }} onClick={() => setSearchTerm('')} />}
          </div>
          
          <button 
            className="btn btn-secondary" 
            onClick={() => setShowFilters(!showFilters)}
            style={{ backgroundColor: showFilters ? 'var(--surface-hover)' : '' }}
          >
            <Filter size={16} /> Filters {(filterQuota || filterStatus) && '•'}
          </button>
        </div>

        {showFilters && (
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px dashed #334155' }}>
            <div style={{ flex: 1 }}>
              <label className="form-label" style={{ fontSize: '0.75rem' }}>Quota Filter</label>
              <select className="form-control" value={filterQuota} onChange={e => setFilterQuota(e.target.value)}>
                <option value="">All Quotas</option>
                <option value="KCET">KCET</option>
                <option value="COMEDK">COMEDK</option>
                <option value="Management">Management</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label className="form-label" style={{ fontSize: '0.75rem' }}>Status Filter</label>
              <select className="form-control" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                <option value="">All Statuses</option>
                <option value="Draft">Draft (New)</option>
                <option value="SeatLocked">Seat Locked</option>
                <option value="Confirmed">Confirmed</option>
              </select>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button className="btn btn-secondary" style={{ fontSize: '0.75rem' }} onClick={() => { setFilterQuota(''); setFilterStatus(''); }}>Reset</button>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex',
          justifyContent: 'center', alignItems: 'center', zIndex: 1000,
          backdropFilter: 'blur(4px)'
        }}>
          <div className="card" style={{ width: '850px', maxHeight: '90vh', overflowY: 'auto', padding: '2.5rem' }}>
            <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem' }}>Student Application Form</h2>
                <p className="text-muted small">Enter all detailed applicant information for processing.</p>
              </div>
              <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }} onClick={() => setShowModal(false)}><X /></button>
            </div>

            {quotaAvailability && (
              <div style={{ background: 'rgba(79, 70, 229, 0.05)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid rgba(79, 70, 229, 0.2)' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                  Live Seat Matrix for {quotaAvailability.program}
                </div>
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem' }}>
                  {quotaAvailability.quotas.map(q => (
                    <div key={q.quotaType} style={{ flex: 1, padding: '0.5rem', borderRadius: '6px', background: q.isFull ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)' }}>
                      <div style={{ fontWeight: 700, color: q.isFull ? 'var(--danger)' : 'var(--success)' }}>
                        {q.quotaType} {q.isFull && <AlertTriangle size={12} style={{ verticalAlign: 'middle' }} />}
                      </div>
                      <div className="text-muted">{q.filled}/{q.allocated} filled ({q.remaining} left)</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <form onSubmit={handleCreate}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <User size={16} color="var(--primary)" />
                <h3 style={{ fontSize: '1rem' }}>Basic Student Information</h3>
              </div>
              <div className="grid-cols-2" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input className="form-control" placeholder="Student Name" value={newApp.fullName} onChange={e => setNewApp({...newApp, fullName: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Date of Birth</label>
                  <input className="form-control" type="date" value={newApp.dob} onChange={e => setNewApp({...newApp, dob: e.target.value})} required />
                </div>
              </div>

              <div className="grid-cols-3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div className="form-group">
                  <label className="form-label">Gender</label>
                  <select className="form-control" value={newApp.gender} onChange={e => setNewApp({...newApp, gender: e.target.value})}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select className="form-control" value={newApp.category} onChange={e => setNewApp({...newApp, category: e.target.value})}>
                    <option value="GM">GM (General)</option>
                    <option value="SC">SC</option>
                    <option value="ST">ST</option>
                    <option value="OBC">OBC</option>
                    <option value="Cat-1">Cat-1</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Contact Number</label>
                  <input className="form-control" value={newApp.phone} onChange={e => setNewApp({...newApp, phone: e.target.value})} required />
                </div>
              </div>

              <div className="grid-cols-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div className="form-group">
                  <label className="form-label">Parent/Guardian Name</label>
                  <input className="form-control" value={newApp.parentName} onChange={e => setNewApp({...newApp, parentName: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Email ID</label>
                  <input className="form-control" type="email" value={newApp.email} onChange={e => setNewApp({...newApp, email: e.target.value})} required />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <GraduationCap size={16} color="var(--primary)" />
                <h3 style={{ fontSize: '1rem' }}>Academic Details</h3>
              </div>
              <div className="grid-cols-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">SSLC/10th Marks (%)</label>
                  <input className="form-control" type="number" step="0.01" value={newApp.sslcPercentage} onChange={e => setNewApp({...newApp, sslcPercentage: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label className="form-label">PUC/12th Marks (%)</label>
                  <input className="form-control" type="number" step="0.01" value={newApp.pucPercentage} onChange={e => setNewApp({...newApp, pucPercentage: e.target.value})} required />
                </div>
              </div>

              <div className="grid-cols-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div className="form-group">
                  <label className="form-label">Qualifying Exam</label>
                  <select className="form-control" value={newApp.qualifyingExam} onChange={e => setNewApp({...newApp, qualifyingExam: e.target.value})}>
                    <option value="KCET">KCET (Karnataka)</option>
                    <option value="COMEDK">COMEDK</option>
                    <option value="JEE">JEE Mains</option>
                    <option value="NATA">NATA (Architecture)</option>
                    <option value="PESSAT">PESSAT</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Exam Register Number</label>
                  <input className="form-control" placeholder="Optional" value={newApp.examRegisterNumber} onChange={e => setNewApp({...newApp, examRegisterNumber: e.target.value})} />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <ClipboardCheck size={16} color="var(--primary)" />
                <h3 style={{ fontSize: '1rem' }}>Admission & Seat Details</h3>
              </div>
              <div className="grid-cols-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Selected Program</label>
                  <select className="form-control" value={newApp.programId} onChange={e => setNewApp({...newApp, programId: e.target.value})} required>
                    <option value="">Select Program</option>
                    {programs.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Quota Type</label>
                  <select className="form-control" value={newApp.quotaType} onChange={e => setNewApp({...newApp, quotaType: e.target.value})}>
                    <option value="KCET">KCET</option>
                    <option value="COMEDK">COMEDK</option>
                    <option value="Management">Management</option>
                  </select>
                </div>
              </div>

              <div className="grid-cols-3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div className="form-group">
                  <label className="form-label">Admission Flow</label>
                  <select className="form-control" value={newApp.flowType} onChange={e => setNewApp({...newApp, flowType: e.target.value})}>
                    <option value="Government">Government</option>
                    <option value="Management">Management</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Entry Type</label>
                  <select className="form-control" value={newApp.entryType} onChange={e => setNewApp({...newApp, entryType: e.target.value})}>
                    <option value="Regular">Regular</option>
                    <option value="Lateral">Lateral Entry (Diploma)</option>
                  </select>
                </div>
                {newApp.flowType === 'Government' && (
                  <div className="form-group">
                    <label className="form-label">Govt. Allotment No.</label>
                    <input className="form-control" placeholder="Required for Govt flow" value={newApp.allotmentNumber} onChange={e => setNewApp({...newApp, allotmentNumber: e.target.value})} required />
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', justifyContent: 'flex-end', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ minWidth: '180px' }}>Save Applicant</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TABLE SECTION */}
      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Student Details</th>
              <th>Program</th>
              <th>Category/Quota</th>
              <th>Academics</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredApplicants.length > 0 ? filteredApplicants.map(app => (
              <tr key={app._id}>
                <td>
                  <div style={{ fontWeight: 600 }}>{app.fullName}</div>
                  <div className="text-muted" style={{ fontSize: '0.75rem' }}>{app.phone}</div>
                </td>
                <td>{app.programId?.name}</td>
                <td>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <span className="badge badge-info">{app.category}</span>
                    <span className="badge badge-warning" style={{ background: 'rgba(255,255,255,0.05)' }}>{app.quotaType}</span>
                  </div>
                </td>
                <td>
                  <div style={{ fontSize: '0.85rem' }}>PUC: {app.pucPercentage}%</div>
                  <div className="text-muted" style={{ fontSize: '0.75rem' }}>{app.qualifyingExam}</div>
                </td>
                <td>
                  <span className={`badge ${
                    app.admissionStatus === 'Draft' ? 'badge-warning' :
                    app.admissionStatus === 'SeatLocked' ? 'badge-info' : 'badge-success'
                  }`}>
                    {app.admissionStatus}
                  </span>
                </td>
                <td>
                  {app.admissionStatus === 'Draft' && (
                    <button className="btn btn-primary btn-sm" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }} onClick={() => handleAllocate(app._id)}>
                      Lock Seat
                    </button>
                  )}
                  {app.admissionStatus !== 'Draft' && <span className="text-muted small">Processed</span>}
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '3rem' }} className="text-muted">
                  No applicants found matching your search/filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
