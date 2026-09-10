// pages/auth/RegisterPage.jsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../api/axios'

const LogoIcon = () => (
  <div className="logo-icon">
    <svg viewBox="0 0 20 20"><path d="M10 2L2 6v8l8 4 8-4V6L10 2zm0 2.24L16 7.5 10 10.76 4 7.5l6-3.26zM3.5 9.08l5.75 3.13V17.5L3.5 14.42V9.08zm7.25 3.13L16.5 9.08v5.34L10.75 17.5v-5.29z"/></svg>
  </div>
)

const ROLES = [
  { id: 'student',   icon: '🎓', label: 'Student' },
  { id: 'recruiter', icon: '💼', label: 'Recruiter' },
  { id: 'institute', icon: '🏫', label: 'Institute' },
]

export default function RegisterPage() {
  const [role, setRole]     = useState('student')
  const [form, setForm]     = useState({ name: '', email: '', password: '', rollNumber: '', companyName: '' })
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const { login }   = useAuth()
  const navigate    = useNavigate()

  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return }
    setLoading(true)
    try {
      const res = await api.post('/auth/register', { ...form, role })
      login(res.data.user)
      navigate(`/${res.data.user.role}`, { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth: 460 }}>
        <Link to="/" className="logo" style={{ marginBottom: '1.5rem', display: 'inline-flex' }}>
          <LogoIcon />
          <span className="logo-name">PlacementHub</span>
        </Link>

        <h2>Create account</h2>
        <p className="auth-sub">Join PlacementHub — it's free</p>

        {/* Role selector */}
        <div className="role-selector">
          {ROLES.map(r => (
            <button key={r.id} type="button"
              className={`role-btn ${role === r.id ? 'selected' : ''}`}
              onClick={() => setRole(r.id)}>
              <span>{r.icon}</span>
              {r.label}
            </button>
          ))}
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={submit}>
          <div className="form-group">
            <label>Full Name <span className="req">*</span></label>
            <input type="text" name="name" required placeholder="Your full name"
              value={form.name} onChange={handle} />
          </div>

          <div className="form-group">
            <label>Email Address <span className="req">*</span></label>
            <input type="email" name="email" required placeholder="you@example.com"
              value={form.email} onChange={handle} />
          </div>

          <div className="form-group">
            <label>Password <span className="req">*</span></label>
            <input type="password" name="password" required placeholder="Min. 6 characters"
              value={form.password} onChange={handle} />
          </div>

          {/* Student: University Roll Number */}
          {role === 'student' && (
            <div className="form-group">
              <label>University Roll Number <span className="req">*</span></label>
              <input type="text" name="rollNumber" required
                placeholder="e.g. 24CSkxxxx"
                value={form.rollNumber} onChange={handle}
                style={{ textTransform: 'uppercase' }} />
              <p className="form-hint">Your unique roll number assigned by the university. Used to identify you on the portal.</p>
            </div>
          )}

          {/* Recruiter: Company Name */}
          {role === 'recruiter' && (
            <div className="form-group">
              <label>Company Name <span className="req">*</span></label>
              <input type="text" name="companyName" required placeholder="Your company name"
                value={form.companyName} onChange={handle} />
              <p className="form-hint">Your account will be reviewed and approved by the institute before you can post opportunities.</p>
            </div>
          )}

          {role === 'institute' && (
            <div className="alert alert-info" style={{ marginBottom: '1rem' }}>
              Institute accounts manage the entire portal — student records, recruiter approvals, and placement stats.
            </div>
          )}

          <button className="btn btn-solid btn-full" type="submit" disabled={loading}
            style={{ marginTop: '0.5rem' }}>
            {loading ? <span className="spinner"></span> : 'Create Account'}
          </button>
        </form>

        <div className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  )
}
