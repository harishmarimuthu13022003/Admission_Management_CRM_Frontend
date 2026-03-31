'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Building2, GraduationCap, PlusCircle, CheckCircle, MapPin, Briefcase } from 'lucide-react';

export default function MasterSetup() {
  const [institutions, setInstitutions] = useState([]);
  const [campuses, setCampuses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [programs, setPrograms] = useState([]);

  const [selectedInst, setSelectedInst] = useState('');
  const [selectedCampus, setSelectedCampus] = useState('');
  const [selectedDept, setSelectedDept] = useState('');

  const [newProgram, setNewProgram] = useState({
    name: '',
    code: '',
    totalIntake: 0,
    courseType: 'UG',
    admissionMode: 'Government',
    academicYear: '2026-2027',
    quotas: [
      { quotaType: 'KCET', allocatedSeats: 0 },
      { quotaType: 'COMEDK', allocatedSeats: 0 },
      { quotaType: 'Management', allocatedSeats: 0 }
    ]
  });

  const fetchData = async () => {
    try {
      const [i, c, d, p] = await Promise.all([
        api.get('/master/institution'),
        api.get('/master/campus'),
        api.get('/master/department'),
        api.get('/master/program')
      ]);
      setInstitutions(i.data);
      setCampuses(c.data);
      setDepartments(d.data);
      setPrograms(p.data);
    } catch (err) { console.error('Error fetching masters:', err); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreateInstitution = async (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const code = e.target.code.value;
    try {
      await api.post('/master/institution', { name, code });
      fetchData(); e.target.reset();
    } catch(err) { alert(err.response?.data?.error || 'Institution failed'); }
  };

  const handleCreateCampus = async (e) => {
    e.preventDefault();
    if (!selectedInst) return alert('Select Institution first');
    const name = e.target.name.value;
    const city = e.target.city.value;
    try {
      await api.post('/master/campus', { institutionId: selectedInst, name, city });
      fetchData(); e.target.reset();
    } catch(err) { alert(err.response?.data?.error || 'Campus failed'); }
  };

  const handleCreateDepartment = async (e) => {
    e.preventDefault();
    if (!selectedCampus) return alert('Select Campus first');
    const name = e.target.name.value;
    const code = e.target.code.value;
    try {
      await api.post('/master/department', { campusId: selectedCampus, name, code });
      fetchData(); e.target.reset();
    } catch(err) { alert(err.response?.data?.error || 'Department failed'); }
  };

  const handleCreateProgram = async (e) => {
    e.preventDefault();
    if (!selectedDept) return alert('Select department first');
    const totalAllocated = newProgram.quotas.reduce((acc, q) => acc + q.allocatedSeats, 0);
    if (totalAllocated !== Number(newProgram.totalIntake)) {
      alert(`Error: Total quota seats (${totalAllocated}) must equal intake (${newProgram.totalIntake})`);
      return;
    }
    try {
      await api.post('/master/program', { ...newProgram, departmentId: selectedDept });
      fetchData();
      setNewProgram({
        ...newProgram,
        name: '',
        code: '',
        totalIntake: 0,
        quotas: [
          { quotaType: 'KCET', allocatedSeats: 0 },
          { quotaType: 'COMEDK', allocatedSeats: 0 },
          { quotaType: 'Management', allocatedSeats: 0 }
        ]
      });
    } catch(err) { 
      const msg = err.response?.data?.error || 'Program creation failed';
      alert('Error: ' + msg); 
    }
  };

  return (
    <div style={{ maxWidth: '1200px' }}>
      <h1>Master Configuration</h1>
      <p className="text-muted" style={{ marginBottom: '2rem' }}>Journey 1: Define institutional structure and seat matrices.</p>

      <div className="grid-cols-3" style={{ marginBottom: '2rem', alignItems: 'start', gap: '1.5rem' }}>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Building2 size={18} color="var(--primary)" />
            <h3>Institution</h3>
          </div>
          <form onSubmit={handleCreateInstitution}>
            <input name="name" className="form-control" placeholder="Name (e.g. SIT)" required style={{ marginBottom: '0.5rem' }} />
            <input name="code" className="form-control" placeholder="Code (e.g. SIT01)" required style={{ marginBottom: '1rem' }} />
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Add Inst</button>
          </form>
          <div style={{ marginTop: '1rem', maxHeight: '100px', overflowY: 'auto' }}>
            {institutions.map(i => <div key={i._id} className="text-muted small" style={{ padding: '0.2rem 0' }}>{i.name}</div>)}
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <MapPin size={18} color="var(--primary)" />
            <h3>Campus</h3>
          </div>
          <form onSubmit={handleCreateCampus}>
            <select className="form-control" value={selectedInst} onChange={e => setSelectedInst(e.target.value)} required style={{ marginBottom: '0.5rem' }}>
              <option value="">Select Inst</option>
              {institutions.map(i => <option key={i._id} value={i._id}>{i.name}</option>)}
            </select>
            <input name="name" className="form-control" placeholder="Campus Name" required style={{ marginBottom: '0.5rem' }} />
            <input name="city" className="form-control" placeholder="City" required style={{ marginBottom: '1rem' }} />
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Add Campus</button>
          </form>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Briefcase size={18} color="var(--primary)" />
            <h3>Department</h3>
          </div>
          <form onSubmit={handleCreateDepartment}>
            <select className="form-control" value={selectedCampus} onChange={e => setSelectedCampus(e.target.value)} required style={{ marginBottom: '0.5rem' }}>
              <option value="">Select Campus</option>
              {campuses.filter(c => c.institutionId?._id === selectedInst || c.institutionId === selectedInst).map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
            <input name="name" className="form-control" placeholder="Dept Name" required style={{ marginBottom: '0.5rem' }} />
            <input name="code" className="form-control" placeholder="Dept Code" required style={{ marginBottom: '1rem' }} />
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Add Dept</button>
          </form>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <GraduationCap size={18} color="var(--primary)" />
          <h3>Program & Seat Matrix Configuration</h3>
        </div>

        <div className="grid-cols-3" style={{ gap: '1rem', marginBottom: '1.5rem' }}>
          <div className="form-group">
            <label className="form-label">Department</label>
            <select className="form-control" value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)}>
              <option value="">Select Dept</option>
              {departments.map(d => <option key={d._id} value={d._id}>{d.name} ({d.campusId?.name})</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Program Name</label>
            <input className="form-control" value={newProgram.name} onChange={(e) => setNewProgram({...newProgram, name: e.target.value})} placeholder="e.g. B.E. Computer Science" />
          </div>
          <div className="form-group">
            <label className="form-label">Program Code</label>
            <input className="form-control" value={newProgram.code} onChange={(e) => setNewProgram({...newProgram, code: e.target.value})} placeholder="e.g. BE-CSE" />
          </div>
        </div>

        <div className="grid-cols-3" style={{ gap: '1rem', marginBottom: '1.5rem' }}>
          <div className="form-group">
            <label className="form-label">Total Intake (Must = Quota Sum)</label>
            <input type="number" className="form-control" value={newProgram.totalIntake} onChange={(e) => setNewProgram({...newProgram, totalIntake: parseInt(e.target.value) || 0})} />
          </div>
          <div className="form-group">
            <label className="form-label">Academic Year</label>
            <input className="form-control" value={newProgram.academicYear} onChange={(e) => setNewProgram({...newProgram, academicYear: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">Course Type</label>
            <select className="form-control" value={newProgram.courseType} onChange={(e) => setNewProgram({...newProgram, courseType: e.target.value})}>
              <option value="UG">UG</option><option value="PG">PG</option>
            </select>
          </div>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
          <h4 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Key System Rule: Quota seats cannot exceed intake</h4>
          <div className="grid-cols-3" style={{ gap: '1rem' }}>
            {newProgram.quotas.map((q, idx) => (
              <div key={q.quotaType} className="form-group">
                <label className="form-label">{q.quotaType} Seats</label>
                <input
                  type="number"
                  className="form-control"
                  value={q.allocatedSeats}
                  onChange={(e) => {
                    const qs = [...newProgram.quotas];
                    qs[idx].allocatedSeats = parseInt(e.target.value) || 0;
                    setNewProgram({...newProgram, quotas: qs});
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        <div style={{ 
          display: 'flex', 
          justifyContent: 'flex-end', 
          paddingTop: '1.5rem', 
          borderTop: '1px solid rgba(255,255,255,0.05)',
          marginTop: '0.5rem'
        }}>
          <button onClick={handleCreateProgram} className="btn btn-primary" style={{ minWidth: '220px' }}>
            <CheckCircle size={18} style={{ marginRight: '8px' }} /> 
            Save Program Matrix
          </button>
        </div>
      </div>

      <div className="card">
        <h3>Seat Matrix Monitor</h3>
        <table style={{ marginTop: '1rem' }}>
          <thead>
            <tr>
              <th>Program</th>
              <th>Dept</th>
              <th>Intake</th>
              <th>KCET</th>
              <th>COMEDK</th>
              <th>MGMT</th>
              <th>Academic Year</th>
            </tr>
          </thead>
          <tbody>
            {programs.map(p => (
              <tr key={p._id}>
                <td><strong>{p.name}</strong></td>
                <td>{p.departmentId?.name}</td>
                <td>{p.totalIntake}</td>
                <td>{p.quotas.find(q => q.quotaType === 'KCET')?.allocatedSeats}</td>
                <td>{p.quotas.find(q => q.quotaType === 'COMEDK')?.allocatedSeats}</td>
                <td>{p.quotas.find(q => q.quotaType === 'Management')?.allocatedSeats}</td>
                <td className="text-muted">{p.academicYear}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
