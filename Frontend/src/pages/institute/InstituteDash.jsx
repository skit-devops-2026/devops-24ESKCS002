// pages/institute/InstituteDash.jsx
import { Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'
import InstituteHome      from './InstituteHome'
import InstituteRecruiters from './InstituteRecruiters'
import InstituteStudents  from './InstituteStudents'
import InstituteApplications from './InstituteApplications'

const NAV = [
  { to: '/institute',               icon: '⊞', label: 'Dashboard'    },
  { to: '/institute/recruiters',    icon: '✅', label: 'Recruiters'   },
  { to: '/institute/students',      icon: '🎓', label: 'Students'     },
  { to: '/institute/applications',  icon: '◷', label: 'Applications' },
]

export default function InstituteDash() {
  return (
    <div className="dash-layout">
      <Sidebar links={NAV} />
      <main className="dash-content">
        <Routes>
          <Route index                 element={<InstituteHome />} />
          <Route path="recruiters"     element={<InstituteRecruiters />} />
          <Route path="students"       element={<InstituteStudents />} />
          <Route path="applications"   element={<InstituteApplications />} />
          <Route path="*"              element={<Navigate to="/institute" replace />} />
        </Routes>
      </main>
    </div>
  )
}
