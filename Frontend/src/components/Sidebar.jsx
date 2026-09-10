// components/Sidebar.jsx
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Sidebar({ links }) {
  const { user, logout } = useAuth()
  const location = useLocation()

  // Avatar initials from name
  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : '?'

  return (
    <aside className="sidebar">
      {/* User info */}
      <div className="sidebar-user">
        <div className="avatar">{initials}</div>
        <div>
          <div className="sidebar-user-name">{user?.name}</div>
          <div className="sidebar-user-role" style={{ textTransform: 'capitalize' }}>{user?.role}</div>
        </div>
      </div>

      <div className="sidebar-title">Menu</div>

      <ul className="sidebar-nav">
        {links.map(link => (
          <li key={link.to}>
            <Link
              to={link.to}
              className={location.pathname === link.to || location.pathname.startsWith(link.to + '/') ? 'active' : ''}
            >
              <span style={{ fontSize: '1rem' }}>{link.icon}</span>
              {link.label}
            </Link>
          </li>
        ))}

        <li style={{ marginTop: '2rem' }}>
          <button onClick={logout} style={{ color: 'var(--muted)' }}>
            <span style={{ fontSize: '1rem' }}>→</span>
            Logout
          </button>
        </li>
      </ul>
    </aside>
  )
}
