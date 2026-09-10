// pages/institute/InstituteRecruiters.jsx
import { useEffect, useState } from 'react'
import api from '../../api/axios'

const FILTERS = ['all', 'pending', 'approved', 'rejected']

export default function InstituteRecruiters() {
  const [recruiters, setRecruiters] = useState([])
  const [filter, setFilter]         = useState('pending')
  const [loading, setLoading]       = useState(true)
  const [acting, setActing]         = useState(null)

  const load = (f) => {
    setLoading(true)
    const params = f !== 'all' ? `?status=${f}` : ''
    api.get(`/institute/recruiters${params}`)
      .then(res => setRecruiters(res.data))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load(filter) }, [filter])

  const verify = async (id, action) => {
    setActing(id)
    try {
      await api.patch(`/institute/recruiter/${id}/verify`, { action })
      // Update local state
      setRecruiters(prev => prev.map(r =>
        r._id === id ? { ...r, status: action === 'approve' ? 'approved' : 'rejected' } : r
      ))
    } finally {
      setActing(null)
    }
  }

  const fmtDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

  return (
    <>
      <div className="page-header">
        <h1>Recruiter Management</h1>
        <p>Review and verify company registrations</p>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {FILTERS.map(f => (
          <button key={f} className="btn btn-ghost btn-sm"
            onClick={() => setFilter(f)}
            style={{
              borderColor: filter === f ? 'var(--accent)' : undefined,
              background:  filter === f ? 'var(--accent-light)' : undefined,
              color:       filter === f ? 'var(--accent)' : undefined,
              textTransform: 'capitalize'
            }}>
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading-page" style={{ minHeight: 200 }}><div className="spinner"></div></div>
      ) : recruiters.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">🏢</div>
          <h3>No {filter !== 'all' ? filter : ''} recruiters</h3>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Company</th>
                  <th>HR / Contact</th>
                  <th>Registered</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recruiters.map(r => (
                  <tr key={r._id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{r.companyName}</div>
                      {r.website && (
                        <a href={r.website} target="_blank" rel="noreferrer"
                          style={{ fontSize: '0.78rem', color: 'var(--accent)', textDecoration: 'none' }}>
                          {r.website.replace(/https?:\/\//, '')}
                        </a>
                      )}
                    </td>
                    <td>
                      <div style={{ fontSize: '0.875rem' }}>{r.user?.name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>{r.user?.email}</div>
                    </td>
                    <td style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{fmtDate(r.user?.createdAt)}</td>
                    <td><span className={`badge badge-${r.status}`}>{r.status}</span></td>
                    <td>
                      {r.status === 'pending' ? (
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button className="btn btn-sm"
                            style={{ background: 'var(--success-bg)', color: 'var(--success)', border: '1px solid #b8e0cb' }}
                            disabled={acting === r._id}
                            onClick={() => verify(r._id, 'approve')}>
                            {acting === r._id ? <span className="spinner"></span> : 'Approve'}
                          </button>
                          <button className="btn btn-sm"
                            style={{ background: 'var(--danger-bg)', color: 'var(--danger)', border: '1px solid #f5c6c6' }}
                            disabled={acting === r._id}
                            onClick={() => verify(r._id, 'reject')}>
                            Reject
                          </button>
                        </div>
                      ) : (
                        <button className="btn btn-ghost btn-sm"
                          onClick={() => verify(r._id, r.status === 'approved' ? 'reject' : 'approve')}>
                          {r.status === 'approved' ? 'Revoke' : 'Re-approve'}
                        </button>
                      )}
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
