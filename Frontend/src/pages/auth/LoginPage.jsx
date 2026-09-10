// pages/auth/LoginPage.jsx
import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../api/axios'

const LogoIcon = () => (
  <div className="logo-icon">
    <svg viewBox="0 0 20 20"><path d="M10 2L2 6v8l8 4 8-4V6L10 2zm0 2.24L16 7.5 10 10.76 4 7.5l6-3.26zM3.5 9.08l5.75 3.13V17.5L3.5 14.42V9.08zm7.25 3.13L16.5 9.08v5.34L10.75 17.5v-5.29z"/></svg>
  </div>
)

const roleLabels = { student: 'Student', recruiter: 'Recruiter (Company)', institute: 'Institute Admin' }

export default function LoginPage() {
  const [searchParams] = useSearchParams()
  const preRole = searchParams.get('role') || 'student'

  const [form, setForm]     = useState({ email: '', password: '' })
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const { login }   = useAuth()
  const navigate    = useNavigate()

  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await api.post('/auth/login', form)
      login(res.data.user)
      navigate(`/${res.data.user.role}`, { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Logo */}
        <Link to="/" className="logo" style={{ marginBottom: '1.5rem', display: 'inline-flex' }}>
          <LogoIcon />
          <span className="logo-name">PlacementHub</span>
        </Link>

        <h2>Welcome back</h2>
        <p className="auth-sub">Signing in as <strong>{roleLabels[preRole] || 'User'}</strong></p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={submit}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email" name="email" required
              placeholder="you@example.com"
              value={form.email} onChange={handle}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password" name="password" required
              placeholder="Enter your password"
              value={form.password} onChange={handle}
            />
          </div>

          <button className="btn btn-solid btn-full" type="submit" disabled={loading}
            style={{ marginTop: '0.5rem' }}>
            {loading ? <span className="spinner"></span> : 'Sign In'}
          </button>
        </form>

        <div className="auth-switch">
          Don't have an account? <Link to="/register">Sign up</Link>
        </div>

        {/* Quick role switcher */}
        <hr className="divider" />
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
          {['student', 'recruiter', 'institute'].map(r => (
            <Link key={r} to={`/login?role=${r}`}
              className="btn btn-ghost btn-sm"
              style={{ borderColor: preRole === r ? 'var(--accent)' : undefined, fontSize: '0.75rem' }}>
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
