// pages/recruiter/RecruiterProfile.jsx
import { useEffect, useState } from 'react'
import api from '../../api/axios'

export default function RecruiterProfile() {
  const [form, setForm]     = useState({ companyName: '', website: '', industry: '', hrName: '', hrPhone: '', description: '' })
  const [status, setStatus] = useState('pending')
  const [msg, setMsg]       = useState({ type: '', text: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    api.get('/recruiter/profile').then(res => {
      const p = res.data
      setStatus(p.status)
      setForm({
        companyName:  p.companyName  || '',
        website:      p.website      || '',
        industry:     p.industry     || '',
        hrName:       p.hrName       || '',
        hrPhone:      p.hrPhone      || '',
        description:  p.description  || '',
      })
    })
  }, [])

  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const save = async (e) => {
    e.preventDefault()
    setSaving(true); setMsg({ type: '', text: '' })
    try {
      await api.put('/recruiter/profile', form)
      setMsg({ type: 'success', text: '✅ Profile updated successfully!' })
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Save failed.' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <div className="page-header">
        <h1>Company Profile</h1>
        <p>This information is shown to students when they view your opportunities.</p>
      </div>

      {/* Approval status badge */}
      <div className="card" style={{ padding: '1rem 1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: '0.78rem', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Account Status</div>
          <div style={{ marginTop: '0.2rem', fontWeight: 600 }}>
            {status === 'pending'  && 'Waiting for institute approval'}
            {status === 'approved' && 'Approved — you can post opportunities'}
            {status === 'rejected' && 'Registration rejected — contact the institute'}
          </div>
        </div>
        <span className={`badge badge-${status}`} style={{ fontSize: '0.8rem', padding: '0.3rem 0.9rem' }}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>

      {msg.text && <div className={`alert alert-${msg.type === 'success' ? 'success' : 'error'}`}>{msg.text}</div>}

      <form onSubmit={save}>
        <div className="form-section-title">Company Information</div>
        <div className="form-row">
          <div className="form-group">
            <label>Company Name <span className="req">*</span></label>
            <input type="text" name="companyName" required value={form.companyName} onChange={handle} />
          </div>
          <div className="form-group">
            <label>Industry</label>
            <input type="text" name="industry" placeholder="e.g. IT, Finance, Core Engineering" value={form.industry} onChange={handle} />
          </div>
        </div>
        <div className="form-group">
          <label>Company Website</label>
          <input type="url" name="website" placeholder="https://yourcompany.com" value={form.website} onChange={handle} />
        </div>
        <div className="form-group">
          <label>Company Description</label>
          <textarea name="description" rows="3" placeholder="Brief description of your company..." value={form.description} onChange={handle} />
        </div>

        <div className="form-section-title">HR Contact</div>
        <div className="form-row">
          <div className="form-group">
            <label>HR Name</label>
            <input type="text" name="hrName" placeholder="HR point of contact" value={form.hrName} onChange={handle} />
          </div>
          <div className="form-group">
            <label>HR Phone</label>
            <input type="tel" name="hrPhone" placeholder="Contact number" value={form.hrPhone} onChange={handle} />
          </div>
        </div>

        <button className="btn btn-solid" type="submit" disabled={saving}>
          {saving ? <><span className="spinner"></span> Saving...</> : 'Save Profile'}
        </button>
      </form>
    </>
  )
}
