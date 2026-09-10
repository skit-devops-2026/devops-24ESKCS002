// pages/recruiter/PostOpportunity.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'

const BRANCHES = ['CSE', 'CSE (AI)', 'IT', 'ECE', 'Mechanical', 'Civil', 'Other']

export default function PostOpportunity() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    title: '', type: 'internship', description: '', location: '',
    stipend: '', deadline: '',
    minCGPA: '', branches: [], passingYear: ''
  })
  const [msg, setMsg]       = useState({ type: '', text: '' })
  const [saving, setSaving] = useState(false)

  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const toggleBranch = (b) => {
    setForm(f => ({
      ...f,
      branches: f.branches.includes(b) ? f.branches.filter(x => x !== b) : [...f.branches, b]
    }))
  }

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true); setMsg({ type: '', text: '' })
    try {
      await api.post('/recruiter/opportunity', {
        title:       form.title,
        type:        form.type,
        description: form.description,
        location:    form.location,
        stipend:     form.stipend,
        deadline:    form.deadline,
        eligibility: {
          minCGPA:     parseFloat(form.minCGPA) || 0,
          branches:    form.branches,
          passingYear: parseInt(form.passingYear) || undefined,
        }
      })
      setMsg({ type: 'success', text: '✅ Opportunity posted successfully!' })
      setTimeout(() => navigate('/recruiter/opportunities'), 1200)
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to post opportunity.' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <div className="page-header">
        <h1>Post Opportunity</h1>
        <p>Create a new job or internship opening for students</p>
      </div>

      {msg.text && <div className={`alert alert-${msg.type === 'success' ? 'success' : 'error'}`}>{msg.text}</div>}

      <form onSubmit={submit}>
        <div className="form-section-title">Basic Details</div>

        <div className="form-group">
          <label>Job / Internship Title <span className="req">*</span></label>
          <input type="text" name="title" required placeholder="e.g. Frontend Developer Intern, SDE-1" value={form.title} onChange={handle} />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Type <span className="req">*</span></label>
            <select name="type" value={form.type} onChange={handle}>
              <option value="internship">Internship</option>
              <option value="job">Full-time Job</option>
            </select>
          </div>
          <div className="form-group">
            <label>Location</label>
            <input type="text" name="location" placeholder="e.g. Bengaluru / Remote" value={form.location} onChange={handle} />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Stipend / Package</label>
            <input type="text" name="stipend" placeholder="e.g. ₹20,000/month or 6 LPA" value={form.stipend} onChange={handle} />
          </div>
          <div className="form-group">
            <label>Application Deadline <span className="req">*</span></label>
            <input type="date" name="deadline" required
              min={new Date().toISOString().split('T')[0]}
              value={form.deadline} onChange={handle} />
          </div>
        </div>

        <div className="form-group">
          <label>Job Description <span className="req">*</span></label>
          <textarea name="description" rows="5" required
            placeholder="Describe the role, responsibilities, and what you're looking for..."
            value={form.description} onChange={handle} />
        </div>

        <div className="form-section-title">Eligibility Criteria</div>
        <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '1rem' }}>
          Leave fields empty to make this open to all eligible students.
        </p>

        <div className="form-row">
          <div className="form-group">
            <label>Minimum CGPA</label>
            <input type="number" name="minCGPA" step="0.01" min="0" max="10"
              placeholder="e.g. 7.5 (0 = no minimum)" value={form.minCGPA} onChange={handle} />
          </div>
          <div className="form-group">
            <label>Passing Year</label>
            <input type="number" name="passingYear" placeholder="e.g. 2026 (leave blank = all)" value={form.passingYear} onChange={handle} />
          </div>
        </div>

        <div className="form-group">
          <label>Eligible Branches</label>
          <p className="form-hint" style={{ marginBottom: '0.65rem' }}>Select branches — or leave all unselected to allow all branches</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {BRANCHES.map(b => (
              <button key={b} type="button"
                onClick={() => toggleBranch(b)}
                className="btn btn-ghost btn-sm"
                style={{
                  borderColor: form.branches.includes(b) ? 'var(--accent)' : undefined,
                  background:  form.branches.includes(b) ? 'var(--accent-light)' : undefined,
                  color:       form.branches.includes(b) ? 'var(--accent)' : undefined,
                }}>
                {b}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
          <button className="btn btn-solid" type="submit" disabled={saving}>
            {saving ? <><span className="spinner"></span> Posting...</> : 'Post Opportunity'}
          </button>
          <button type="button" className="btn btn-ghost" onClick={() => navigate('/recruiter/opportunities')}>
            Cancel
          </button>
        </div>
      </form>
    </>
  )
}
