// pages/recruiter/RecruiterHome.jsx
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../api/axios'

export default function RecruiterHome() {
  const { user } = useAuth()
  const [profile, setProfile]   = useState(null)
  const [opps, setOpps]         = useState([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    api.get('/recruiter/profile')
      .then(res => {
        setProfile(res.data)
        if (res.data.status === 'approved') {
          return api.get('/recruiter/opportunities')
        }
      })
      .then(res => { if (res) setOpps(res.data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="loading-page"><div className="spinner"></div></div>

  const isPending  = profile?.status === 'pending'
  const isRejected = profile?.status === 'rejected'
  const isApproved = profile?.status === 'approved'

  return (
    <>
      <div className="page-header">
        <h1>Hello, {user?.name?.split(' ')[0]} 👋</h1>
        <p>{profile?.companyName} · Recruiter Dashboard</p>
      </div>

      {/* Status banners */}
      {isPending && (
        <div className="pending-banner">
          <span style={{ fontSize: '1.5rem' }}>⏳</span>
          <div>
            <h3>Account Pending Approval</h3>
            <p>The institute is reviewing your company registration. You'll be able to post opportunities once approved. This usually takes 1-2 business days.</p>
          </div>
        </div>
      )}

      {isRejected && (
        <div className="alert alert-error">
          ❌ Your account registration was not approved. Please contact the institute for more information.
        </div>
      )}

      {isApproved && (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-label">Total Postings</div>
              <div className="stat-value">{opps.length}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Active</div>
              <div className="stat-value">{opps.filter(o => o.isActive).length}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Closed</div>
              <div className="stat-value">{opps.filter(o => !o.isActive).length}</div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <div className="card-title">Recent Postings</div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Link to="/recruiter/opportunities" className="btn btn-ghost btn-sm">View All</Link>
                <Link to="/recruiter/post" className="btn btn-solid btn-sm">+ Post New</Link>
              </div>
            </div>
            {opps.length === 0 ? (
              <div className="empty" style={{ padding: '2rem' }}>
                <div className="empty-icon">📢</div>
                <h3>No postings yet</h3>
                <p>Post your first job or internship opportunity.</p>
              </div>
            ) : (
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Title</th><th>Type</th><th>Deadline</th><th>Status</th></tr></thead>
                  <tbody>
                    {opps.slice(0, 5).map(o => (
                      <tr key={o._id}>
                        <td style={{ fontWeight: 500 }}>{o.title}</td>
                        <td><span className={`badge badge-${o.type}`}>{o.type}</span></td>
                        <td style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>
                          {new Date(o.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                        <td>
                          <span className={`badge ${o.isActive ? 'badge-approved' : 'badge-rejected'}`}>
                            {o.isActive ? 'Active' : 'Closed'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </>
  )
}
