// pages/student/StudentDash.jsx
import { Routes, Route, Navigate, Link } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'
import StudentHome        from './StudentHome'
import StudentProfile     from './StudentProfile'
import StudentOpportunities from './StudentOpportunities'
import StudentApplications from './StudentApplications'

const NAV = [
  { to: '/student',              icon: '⊞', label: 'Dashboard'    },
  { to: '/student/profile',      icon: '◎', label: 'My Profile'   },
  { to: '/student/opportunities',icon: '◈', label: 'Opportunities' },
  { to: '/student/applications', icon: '◷', label: 'Applications' },
]

export default function StudentDash() {
  return (
    <div className="dash-layout">
      <Sidebar links={NAV} />
      <main className="dash-content">
        <Routes>
          <Route index         element={<StudentHome />} />
          <Route path="profile"       element={<StudentProfile />} />
          <Route path="opportunities" element={<StudentOpportunities />} />
          <Route path="applications"  element={<StudentApplications />} />
          <Route path="*"      element={<Navigate to="/student" replace />} />
        </Routes>
      </main>
    </div>
  )
}
