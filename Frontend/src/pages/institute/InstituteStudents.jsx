// pages/institute/InstituteStudents.jsx
import { useEffect, useState } from 'react'
import api from '../../api/axios'

export default function InstituteStudents() {
  const [students, setStudents] = useState([])
  const [search, setSearch]     = useState('')
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    api.get('/institute/students')
      .then(res => setStudents(res.data))
      .finally(() => setLoading(false))
  }, [])

  const filtered = students.filter(s => {
    const q = search.toLowerCase()
    return (
      s.user?.name?.toLowerCase().includes(q) ||
      s.rollNumber?.toLowerCase().includes(q) ||
      s.branch?.toLowerCase().includes(q)
    )
  })

  if (loading) return <div className="loading-page"><div className="spinner"></div></div>

  return (
    <>
      <div className="page-header">
        <h1>All Students</h1>
        <p>{students.length} students registered on the portal</p>
      </div>

      {/* Search */}
      <div className="form-group" style={{ maxWidth: 360, marginBottom: '1.5rem' }}>
        <input type="text" placeholder="Search by name, roll number, or branch..."
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {filtered.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">🎓</div>
          <h3>No students found</h3>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Roll Number</th>
                  <th>Branch</th>
                  <th>CGPA</th>
                  <th>Year</th>
                  <th>Profile</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(s => (
                  <tr key={s._id}>
                    <td>
                      <div style={{ fontWeight: 500 }}>{s.user?.name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>{s.user?.email}</div>
                    </td>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--ink)', fontWeight: 600 }}>
                      {s.rollNumber}
                    </td>
                    <td style={{ color: 'var(--muted)' }}>{s.branch}</td>
                    <td style={{ fontWeight: 600 }}>{s.cgpa ?? '—'}</td>
                    <td style={{ color: 'var(--muted)' }}>{s.passingYear ?? '—'}</td>
                    <td>
                      <span className={`badge ${s.isProfileComplete ? 'badge-approved' : 'badge-pending'}`}>
                        {s.isProfileComplete ? 'Complete' : 'Incomplete'}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${s.isPlaced ? 'badge-selected' : 'badge-applied'}`}>
                        {s.isPlaced ? 'Placed' : 'Seeking'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  )
}
