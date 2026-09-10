// pages/student/StudentOpportunities.jsx
import { useEffect, useState } from 'react'
import api from '../../api/axios'

export default function StudentOpportunities() {
  const [opps, setOpps]       = useState([])
  const [applied, setApplied] = useState(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')
  const [applying, setApplying] = useState(null)

  useEffect(() => {
    // Load opportunities and existing applications together
    Promise.all([
      api.get('/student/opportunities'),
      api.get('/student/applications')
    ])
      .then(([o, a]) => {
        setOpps(o.data)
        setApplied(new Set(a.data.map(app => app.opportunity?._id)))
      })
      .catch(err => setError(err.response?.data?.message || 'Failed to load opportunities.'))
      .finally(() => setLoading(false))
  }, [])

  const apply = async (oppId) => {
    setApplying(oppId)
    try {
      await api.post(`/student/apply/${oppId}`)
      setApplied(prev => new Set([...prev, oppId]))
    } catch (err) {
      alert(err.response?.data?.message || 'Application failed.')
    } finally {
      setApplying(null)
    }
  }

  const fmtDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

  if (loading) return <div className="loading-page"><div className="spinner"></div></div>

  return (
    <>
      <div className="page-header">
        <h1>Opportunities</h1>
        <p>Jobs and internships matching your profile and branch</p>
      </div>

      {error && <div className="alert alert-warning">{error}</div>}

      {opps.length === 0 && !error ? (
        <div className="empty">
          <div className="empty-icon">🔍</div>
          <h3>No opportunities yet</h3>
          <p>Check back soon — recruiters are being onboarded.</p>
        </div>
      ) : (
        opps.map(opp => (
          <div className="opp-card" key={opp._id}>
            <div className="opp-title">{opp.title}</div>
            <div className="opp-company">{opp.recruiter?.companyName} · {opp.recruiter?.industry}</div>

            <div className="opp-meta">
              <span>📍 {opp.location || 'Location TBD'}</span>
              <span>💰 {opp.stipend || 'Not specified'}</span>
              <span>📅 Deadline: {fmtDate(opp.deadline)}</span>
              {opp.eligibility?.minCGPA > 0 && <span>📊 Min. CGPA: {opp.eligibility.minCGPA}</span>}
              {opp.eligibility?.branches?.length > 0 && (
                <span>🎓 Branches: {opp.eligibility.branches.join(', ')}</span>
              )}
            </div>

            <p style={{ fontSize: '0.875rem', color: 'var(--muted)', marginBottom: '1rem', lineHeight: 1.6 }}>
              {opp.description?.slice(0, 200)}{opp.description?.length > 200 ? '…' : ''}
            </p>

            <div className="opp-footer">
              <span className={`badge badge-${opp.type}`}>{opp.type}</span>
              {applied.has(opp._id) ? (
                <span className="badge badge-applied">✓ Applied</span>
              ) : (
                <button
                  className="btn btn-accent btn-sm"
                  onClick={() => apply(opp._id)}
                  disabled={applying === opp._id}>
                  {applying === opp._id ? <span className="spinner"></span> : 'Apply Now'}
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </>
  )
}
