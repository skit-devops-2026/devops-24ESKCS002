// pages/student/StudentHome.jsx
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../api/axios'

export default function StudentHome() {
  const { user } = useAuth()
  const [profile, setProfile]   = useState(null)
  const [apps, setApps]         = useState([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/student/profile'),
      api.get('/student/applications')
    ])
      .then(([p, a]) => { setProfile(p.data); setApps(a.data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="loading-page"><div className="spinner"></div></div>

  // Profile completeness score (simple)
  const fields   = ['phone', 'cgpa', 'passingYear', 'skills', 'resumeUrl']
  const filled   = fields.filter(f => profile?.[f] && (!Array.isArray(profile[f]) || profile[f].length > 0)).length
  const pct      = Math.round((filled / fields.length) * 100)

  const statusCount = (s) => apps.filter(a => a.status === s).length

  return (
    <>
      <div className="page-header">
        <h1>Hello, {user?.name?.split(' ')[0]} 👋</h1>
        <p>Welcome to your placement dashboard</p>
      </div>

      {/* Profile completion warning */}
      {!profile?.isProfileComplete && (
        <div className="alert alert-warning" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>⚠️ Complete your profile to unlock opportunities.</span>
          <Link to="/student/profile" className="btn btn-ghost btn-sm">Complete Now</Link>
        </div>
      )}

      {/* Profile progress bar */}
      <div className="progress-wrap">
        <div className="progress-label">
          <span>Profile Completion</span>
          <span>{pct}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${pct}%` }}></div>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Applied</div>
          <div className="stat-value">{apps.length}</div>
          <div className="stat-sub">opportunities</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Shortlisted</div>
          <div className="stat-value">{statusCount('shortlisted')}</div>
          <div className="stat-sub">by recruiters</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Selected</div>
          <div className="stat-value" style={{ color: 'var(--success)' }}>{statusCount('selected')}</div>
          <div className="stat-sub">offers received</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Roll Number</div>
          <div className="stat-value" style={{ fontSize: '1.1rem', paddingTop: '0.4rem' }}>{profile?.rollNumber || '—'}</div>
          <div className="stat-sub">university ID</div>
        </div>
      </div>

      {/* Recent applications */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Recent Applications</div>
            <div className="card-meta">Your last 3 applications</div>
          </div>
          <Link to="/student/applications" className="btn btn-ghost btn-sm">View All</Link>
        </div>

        {apps.length === 0 ? (
          <div className="empty" style={{ padding: '2rem' }}>
            <div className="empty-icon">📋</div>
            <h3>No applications yet</h3>
            <p>Browse opportunities and start applying!</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Role</th>
                  <th>Company</th>
                  <th>Type</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {apps.slice(0, 3).map(a => (
                  <tr key={a._id}>
                    <td style={{ fontWeight: 500 }}>{a.opportunity?.title}</td>
                    <td style={{ color: 'var(--muted)' }}>{a.opportunity?.recruiter?.companyName}</td>
                    <td><span className={`badge badge-${a.opportunity?.type}`}>{a.opportunity?.type}</span></td>
                    <td><span className={`badge badge-${a.status}`}>{a.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}
