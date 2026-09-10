// pages/institute/InstituteHome.jsx
import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import api from '../../api/axios'

export default function InstituteHome() {
  const { user } = useAuth()
  const [stats, setStats]   = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/institute/stats')
      .then(res => setStats(res.data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="loading-page"><div className="spinner"></div></div>

  const placementRate = stats?.totalStudents
    ? Math.round((stats.placedStudents / stats.totalStudents) * 100)
    : 0

  return (
    <>
      <div className="page-header">
        <h1>Admin Dashboard</h1>
        <p>Overview of all placement activity on the portal</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Students</div>
          <div className="stat-value">{stats?.totalStudents ?? '—'}</div>
          <div className="stat-sub">registered on portal</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Placed Students</div>
          <div className="stat-value" style={{ color: 'var(--success)' }}>{stats?.placedStudents ?? '—'}</div>
          <div className="stat-sub">{placementRate}% placement rate</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Approved Companies</div>
          <div className="stat-value">{stats?.totalRecruiters ?? '—'}</div>
          <div className="stat-sub">active recruiters</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Pending Approval</div>
          <div className="stat-value" style={{ color: stats?.pendingRecruiters > 0 ? 'var(--warning)' : 'var(--ink)' }}>
            {stats?.pendingRecruiters ?? '—'}
          </div>
          <div className="stat-sub">companies waiting</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Applications</div>
          <div className="stat-value">{stats?.totalApplications ?? '—'}</div>
          <div className="stat-sub">across all companies</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Offers Extended</div>
          <div className="stat-value" style={{ color: 'var(--success)' }}>{stats?.selectedApplications ?? '—'}</div>
          <div className="stat-sub">students selected</div>
        </div>
      </div>

      {stats?.pendingRecruiters > 0 && (
        <div className="pending-banner">
          <span style={{ fontSize: '1.5rem' }}>⚠️</span>
          <div>
            <h3>{stats.pendingRecruiters} recruiter(s) waiting for approval</h3>
            <p>Review and approve or reject pending company registrations from the Recruiters section.</p>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <div className="card-title">Quick Actions</div>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <a href="/institute/recruiters" className="btn btn-ghost">Review Recruiters</a>
          <a href="/institute/students" className="btn btn-ghost">View All Students</a>
          <a href="/institute/applications" className="btn btn-ghost">All Applications</a>
        </div>
      </div>
    </>
  )
}
