// pages/student/StudentProfile.jsx
// Mirrors your original student.html profile form — now connected to backend
import { useEffect, useState } from 'react'
import api from '../../api/axios'

const BRANCHES = ['CSE', 'CSE (AI)', 'IT', 'ECE', 'Mechanical', 'Civil', 'Other']

export default function StudentProfile() {
  const [profile, setProfile]   = useState(null)
  const [form, setForm]         = useState({})
  const [msg, setMsg]           = useState({ type: '', text: '' })
  const [saving, setSaving]     = useState(false)

  useEffect(() => {
    api.get('/student/profile').then(res => {
      setProfile(res.data)
      setForm({
        phone:       res.data.phone       || '',
        branch:      res.data.branch      || 'CSE',
        cgpa:        res.data.cgpa        || '',
        passingYear: res.data.passingYear || '',
        tenthPct:    res.data.tenthPct    || '',
        twelfthPct:  res.data.twelfthPct  || '',
        skills:      (res.data.skills || []).join(', '),
        resumeUrl:   res.data.resumeUrl   || '',
        linkedIn:    res.data.linkedIn    || '',
        github:      res.data.github      || '',
      })
    })
  }, [])

  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const save = async (e) => {
    e.preventDefault()
    setSaving(true); setMsg({ type: '', text: '' })
    try {
      const payload = {
        ...form,
        cgpa:        parseFloat(form.cgpa)        || undefined,
        passingYear: parseInt(form.passingYear)   || undefined,
        tenthPct:    parseFloat(form.tenthPct)    || undefined,
        twelfthPct:  parseFloat(form.twelfthPct)  || undefined,
        skills:      form.skills.split(',').map(s => s.trim()).filter(Boolean),
      }
      const res = await api.put('/student/profile', payload)
      setProfile(res.data.profile)
      setMsg({ type: 'success', text: '✅ Profile saved successfully!' })
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Save failed.' })
    } finally {
      setSaving(false)
    }
  }

  if (!profile) return <div className="loading-page"><div className="spinner"></div></div>

  return (
    <>
      <div className="page-header">
        <h1>My Profile</h1>
        <p>Keep your profile up-to-date — it's shown to recruiters when you apply.</p>
      </div>

      {profile.isProfileComplete ? (
        <div className="alert alert-success">✅ Your profile is complete. You can apply to opportunities.</div>
      ) : (
        <div className="alert alert-warning">⚠️ Fill all required fields to unlock opportunities.</div>
      )}

      {/* Roll number — read-only, set at registration */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>University Roll Number</div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.3rem', fontWeight: 700, marginTop: '0.2rem' }}>{profile.rollNumber}</div>
          </div>
          <span className="badge badge-approved">Verified ID</span>
        </div>
      </div>

      {msg.text && <div className={`alert alert-${msg.type === 'success' ? 'success' : 'error'}`}>{msg.text}</div>}

      <form onSubmit={save}>
        {/* ── Personal ── */}
        <div className="form-section-title">Personal Information</div>
        <div className="form-row">
          <div className="form-group">
            <label>Phone Number <span className="req">*</span></label>
            <input type="tel" name="phone" placeholder="10-digit number"
              value={form.phone} onChange={handle} />
          </div>
          <div className="form-group">
            <label>Branch / Department <span className="req">*</span></label>
            <select name="branch" value={form.branch} onChange={handle}>
              {BRANCHES.map(b => <option key={b}>{b}</option>)}
            </select>
          </div>
        </div>

        {/* ── Academic ── */}
        <div className="form-section-title">Academic Information</div>
        <div className="form-row">
          <div className="form-group">
            <label>Current CGPA <span className="req">*</span></label>
            <input type="number" name="cgpa" step="0.01" min="0" max="10"
              placeholder="e.g. 8.25" value={form.cgpa} onChange={handle} />
          </div>
          <div className="form-group">
            <label>Passing Year <span className="req">*</span></label>
            <input type="number" name="passingYear" placeholder="e.g. 2027"
              value={form.passingYear} onChange={handle} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>10th Percentage</label>
            <input type="number" name="tenthPct" step="0.01" min="0" max="100"
              placeholder="e.g. 88.5" value={form.tenthPct} onChange={handle} />
          </div>
          <div className="form-group">
            <label>12th Percentage</label>
            <input type="number" name="twelfthPct" step="0.01" min="0" max="100"
              placeholder="e.g. 82.0" value={form.twelfthPct} onChange={handle} />
          </div>
        </div>

        {/* ── Professional ── */}
        <div className="form-section-title">Professional Information</div>
        <div className="form-group">
          <label>Skills <span className="req">*</span></label>
          <textarea name="skills" rows="3"
            placeholder="Comma-separated: Python, JavaScript, Machine Learning, React"
            value={form.skills} onChange={handle} />
          <p className="form-hint">Separate each skill with a comma</p>
        </div>
        <div className="form-group">
          <label>Resume Link <span className="req">*</span></label>
          <input type="url" name="resumeUrl"
            placeholder="Google Drive / Dropbox link to your resume PDF"
            value={form.resumeUrl} onChange={handle} />
          <p className="form-hint">Make sure the link is publicly accessible</p>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>LinkedIn</label>
            <input type="url" name="linkedIn" placeholder="https://linkedin.com/in/..."
              value={form.linkedIn} onChange={handle} />
          </div>
          <div className="form-group">
            <label>GitHub</label>
            <input type="url" name="github" placeholder="https://github.com/..."
              value={form.github} onChange={handle} />
          </div>
        </div>

        <button className="btn btn-solid" type="submit" disabled={saving}>
          {saving ? <><span className="spinner"></span> Saving...</> : 'Save Profile'}
        </button>
      </form>
    </>
  )
}
