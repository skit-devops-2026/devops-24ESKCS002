// pages/recruiter/RecruiterDash.jsx
import { Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'
import RecruiterHome       from './RecruiterHome'
import RecruiterProfile    from './RecruiterProfile'
import RecruiterOpportunities from './RecruiterOpportunities'
import PostOpportunity     from './PostOpportunity'

const NAV = [
  { to: '/recruiter',              icon: '⊞', label: 'Dashboard'    },
  { to: '/recruiter/profile',      icon: '◎', label: 'Company Profile' },
  { to: '/recruiter/opportunities',icon: '◈', label: 'My Postings'  },
  { to: '/recruiter/post',         icon: '+', label: 'Post New'      },
]

export default function RecruiterDash() {
  return (
    <div className="dash-layout">
      <Sidebar links={NAV} />
      <main className="dash-content">
        <Routes>
          <Route index                element={<RecruiterHome />} />
          <Route path="profile"       element={<RecruiterProfile />} />
          <Route path="opportunities" element={<RecruiterOpportunities />} />
          <Route path="post"          element={<PostOpportunity />} />
          <Route path="*"             element={<Navigate to="/recruiter" replace />} />
        </Routes>
      </main>
    </div>
  )
}
