// pages/institute/InstituteApplications.jsx
import { useEffect, useState } from 'react'
import api from '../../api/axios'

export default function InstituteApplications() {
  const [apps, setApps]       = useState([])
  const [filter, setFilter]   = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/institute/applications')
      .then(res => setApps(res.data))
      .finally(() => setLoading(false))
  }, [])

  const filtered = filter === 'all' ? apps : apps.filter(a => a.status === filter)
  const fmtDate  = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

  const counts = ['applied', 'shortlisted', 'selected', 'rejected'].reduce((acc, s) => {
    acc[s] = apps.filter(a => a.status === s).length
    return acc
  }, {})

  if (loading) return <div className="loading-page"><div className="spinner"></div></div>

  return (
    <>
      <div className="page-header">
        <h1>All Applications</h1>
        <p>Complete view of every student application across all companies</p>
      </div>

      {/* Status summary */}
      <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
        {Object.entries(counts).map(([status, count]) => (
          <div className="stat-card" key={status} style={{ cursor: 'pointer', borderColor: filter === status ? 'var(--accent)' : undefined }}
            onClick={() => setFilter(filter === status ? 'all' : status)}>
            <div className="stat-label" style={{ textTransform: 'capitalize' }}>{status}</div>
            <div className="stat-value" style={{ fontSize: '1.6rem' }}>{count}</div>
          </div>
        ))}
      </div>

      {/* Filter pills */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        {['all', 'applied', 'shortlisted', 'selected', 'rejected'].map(f => (
          <button key={f} className="btn btn-ghost btn-sm" onClick={() => setFilter(f)}
            style={{
              textTransform: 'capitalize',
              borderColor: filter === f ? 'var(--accent)' : undefined,
              background:  filter === f ? 'var(--accent-light)' : undefined,
              color:       filter === f ? 'var(--accent)' : undefined,
            }}>
            {f} {f !== 'all' && `(${counts[f] ?? 0})`}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">📋</div>
          <h3>No applications found</h3>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Roll No.</th>
                  <th>Opportunity</th>
                  <th>Company</th>
                  <th>Applied</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(a => (
                  <tr key={a._id}>
                    <td>
                      <div style={{ fontWeight: 500 }}>{a.student?.user?.name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>{a.student?.branch}</div>
                    </td>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.82rem', color: 'var(--ink)', fontWeight: 600 }}>
                      {a.student?.rollNumber}
                    </td>
                    <td style={{ fontWeight: 500 }}>{a.opportunity?.title}</td>
                    <td style={{ color: 'var(--muted)' }}>{a.opportunity?.recruiter?.companyName}</td>
                    <td style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{fmtDate(a.appliedAt)}</td>
                    <td><span className={`badge badge-${a.status}`}>{a.status}</span></td>
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
