// pages/recruiter/RecruiterOpportunities.jsx
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/axios'

const STATUS_OPTIONS = ['shortlisted', 'selected', 'rejected']

export default function RecruiterOpportunities() {
  const [opps, setOpps]         = useState([])
  const [loading, setLoading]   = useState(true)
  const [expanded, setExpanded] = useState(null)      // which opp is showing applicants
  const [applicants, setApplicants] = useState({})    // oppId -> applicants array
  const [updating, setUpdating] = useState(null)

  useEffect(() => {
    api.get('/recruiter/opportunities')
      .then(res => setOpps(res.data))
      .finally(() => setLoading(false))
  }, [])

  const toggleExpand = async (oppId) => {
    if (expanded === oppId) { setExpanded(null); return }
    setExpanded(oppId)
    if (!applicants[oppId]) {
      const res = await api.get(`/recruiter/opportunity/${oppId}/applicants`)
      setApplicants(prev => ({ ...prev, [oppId]: res.data }))
    }
  }

  const toggleActive = async (opp) => {
    await api.patch(`/recruiter/opportunity/${opp._id}/toggle`)
    setOpps(prev => prev.map(o => o._id === opp._id ? { ...o, isActive: !o.isActive } : o))
  }

  const updateStatus = async (appId, oppId, status) => {
    setUpdating(appId)
    try {
      await api.patch(`/recruiter/application/${appId}/status`, { status })
      setApplicants(prev => ({
        ...prev,
        [oppId]: prev[oppId].map(a => a._id === appId ? { ...a, status } : a)
      }))
    } finally {
      setUpdating(null)
    }
  }

  const fmtDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

  if (loading) return <div className="loading-page"><div className="spinner"></div></div>

  return (
    <>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>My Postings</h1>
          <p>Manage your opportunities and review applicants</p>
        </div>
        <Link to="/recruiter/post" className="btn btn-solid">+ Post New</Link>
      </div>

      {opps.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">📢</div>
          <h3>No postings yet</h3>
          <p>Create your first job or internship listing.</p>
        </div>
      ) : (
        opps.map(opp => (
          <div className="card" key={opp._id} style={{ marginBottom: '1rem' }}>
            {/* Header row */}
            <div className="card-header">
              <div>
                <div className="card-title">{opp.title}</div>
                <div className="card-meta">
                  <span className={`badge badge-${opp.type}`} style={{ marginRight: '0.5rem' }}>{opp.type}</span>
                  {opp.location && <span>📍 {opp.location} · </span>}
                  <span>📅 Deadline: {fmtDate(opp.deadline)}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                <button
                  className={`btn btn-ghost btn-sm`}
                  onClick={() => toggleActive(opp)}
                  style={{ borderColor: opp.isActive ? 'var(--success)' : undefined }}>
                  {opp.isActive ? '● Active' : '○ Closed'}
                </button>
                <button className="btn btn-ghost btn-sm" onClick={() => toggleExpand(opp._id)}>
                  {expanded === opp._id ? 'Hide Applicants ↑' : 'View Applicants ↓'}
                </button>
              </div>
            </div>

            {/* Applicants table */}
            {expanded === opp._id && (
              <div style={{ borderTop: '1px solid var(--border)', marginTop: '0.5rem', paddingTop: '1rem' }}>
                {!applicants[opp._id] ? (
                  <div style={{ textAlign: 'center', padding: '1rem' }}><div className="spinner"></div></div>
                ) : applicants[opp._id].length === 0 ? (
                  <p style={{ color: 'var(--muted)', fontSize: '0.875rem', padding: '0.5rem 0' }}>No applications yet.</p>
                ) : (
                  <div className="table-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th>Student</th>
                          <th>Roll No.</th>
                          <th>Branch</th>
                          <th>CGPA</th>
                          <th>Resume</th>
                          <th>Status</th>
                          <th>Update</th>
                        </tr>
                      </thead>
                      <tbody>
                        {applicants[opp._id].map(app => (
                          <tr key={app._id}>
                            <td>
                              <div style={{ fontWeight: 500 }}>{app.student?.user?.name}</div>
                              <div style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>{app.student?.user?.email}</div>
                            </td>
                            <td style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{app.student?.rollNumber}</td>
                            <td style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{app.student?.branch}</td>
                            <td style={{ fontWeight: 600 }}>{app.student?.cgpa ?? '—'}</td>
                            <td>
                              {app.student?.resumeUrl
                                ? <a href={app.student.resumeUrl} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm">View</a>
                                : <span style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>Not uploaded</span>
                              }
                            </td>
                            <td><span className={`badge badge-${app.status}`}>{app.status}</span></td>
                            <td>
                              <select
                                value={app.status}
                                disabled={updating === app._id}
                                onChange={(e) => updateStatus(app._id, opp._id, e.target.value)}
                                style={{ padding: '0.3rem 0.5rem', border: '1px solid var(--border)', borderRadius: 4, fontSize: '0.8rem', background: 'var(--bg)', cursor: 'pointer' }}>
                                <option value="applied">Applied</option>
                                <option value="shortlisted">Shortlist</option>
                                <option value="selected">Select</option>
                                <option value="rejected">Reject</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        ))
      )}
    </>
  )
}
