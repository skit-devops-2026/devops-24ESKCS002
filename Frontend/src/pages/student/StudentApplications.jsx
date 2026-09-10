// pages/student/StudentApplications.jsx
import { useEffect, useState } from 'react'
import api from '../../api/axios'

const STATUS_ORDER = ['applied', 'shortlisted', 'selected', 'rejected']

export default function StudentApplications() {
  const [apps, setApps]     = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/student/applications')
      .then(res => setApps(res.data))
      .finally(() => setLoading(false))
  }, [])

  const fmtDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

  if (loading) return <div className="loading-page"><div className="spinner"></div></div>

  return (
    <>
      <div className="page-header">
        <h1>My Applications</h1>
        <p>Track the status of every opportunity you've applied to</p>
      </div>

      {apps.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">📋</div>
          <h3>No applications yet</h3>
          <p>Go to Opportunities and start applying!</p>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Role</th>
                  <th>Company</th>
                  <th>Type</th>
                  <th>Applied On</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {apps.map(a => (
                  <tr key={a._id}>
                    <td style={{ fontWeight: 500 }}>{a.opportunity?.title || '—'}</td>
                    <td style={{ color: 'var(--muted)' }}>{a.opportunity?.recruiter?.companyName || '—'}</td>
                    <td>
                      {a.opportunity?.type && (
                        <span className={`badge badge-${a.opportunity.type}`}>{a.opportunity.type}</span>
                      )}
                    </td>
                    <td style={{ color: 'var(--muted)' }}>{fmtDate(a.appliedAt)}</td>
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
