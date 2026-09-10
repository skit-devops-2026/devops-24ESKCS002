// components/Header.jsx
import { useState, useEffect, useRef } from 'react'
import { Link, NavLink } from 'react-router-dom'

const LogoIcon = () => (
  <div className="logo-icon">
    <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 2L2 6v8l8 4 8-4V6L10 2zm0 2.24L16 7.5 10 10.76 4 7.5l6-3.26zM3.5 9.08l5.75 3.13V17.5L3.5 14.42V9.08zm7.25 3.13L16.5 9.08v5.34L10.75 17.5v-5.29z"/>
    </svg>
  </div>
)

export default function Header({ activePage }) {
  const [open, setOpen] = useState(false)
  const dropRef = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [])

  return (
    <header>
      <Link to="/" className="logo">
        <LogoIcon />
        <span className="logo-name">PlacementHub</span>
      </Link>

      {/* Nav — exactly your original 3 links */}
      <nav>
        <NavLink to="/" end className={activePage === 'home' || !activePage ? 'active' : ''}>Home</NavLink>
        <NavLink to="/about" className={activePage === 'about' ? 'active' : ''}>About</NavLink>
        <NavLink to="/team" className={activePage === 'team' ? 'active' : ''}>Team</NavLink>
      </nav>

      <div className="actions" ref={dropRef}>
        <button className="btn btn-ghost" onClick={(e) => { e.stopPropagation(); setOpen(v => !v) }}>
          Login
        </button>
        <Link to="/register" className="btn btn-solid">Sign up</Link>

        {/* Role dropdown — your original design */}
        <div className={`dropdown ${open ? 'open' : ''}`}>
          <div className="dropdown-title">Continue as</div>
          <div className="role-cards">

            <Link to="/login?role=institute" className="role-card" onClick={() => setOpen(false)}>
              <div className="role-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3"/>
                </svg>
              </div>
              <span className="role-label">Institute</span>
            </Link>

            <Link to="/login?role=student" className="role-card" onClick={() => setOpen(false)}>
              <div className="role-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5-10-5z"/>
                  <path d="M6 12v5c0 2.21 2.686 4 6 4s6-1.79 6-4v-5"/>
                </svg>
              </div>
              <span className="role-label">Student</span>
            </Link>

            <Link to="/login?role=recruiter" className="role-card" onClick={() => setOpen(false)}>
              <div className="role-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2"/>
                  <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2M12 12v4M10 14h4"/>
                </svg>
              </div>
              <span className="role-label">Recruiter</span>
            </Link>

          </div>
        </div>
      </div>
    </header>
  )
}