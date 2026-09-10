// App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'

import HomePage      from './pages/HomePage'
import AboutPage     from './pages/AboutPage'
import TeamPage      from './pages/TeamPage'
import LoginPage     from './pages/auth/LoginPage'
import RegisterPage  from './pages/auth/RegisterPage'
import StudentDash   from './pages/student/StudentDash'
import RecruiterDash from './pages/recruiter/RecruiterDash'
import InstituteDash from './pages/institute/InstituteDash'

// If already logged in, redirect to their dashboard
function PublicRoute({ children }) {
  const { user } = useAuth()
  if (user) return <Navigate to={`/${user.role}`} replace />
  return children
}

// If not logged in, redirect to login
function PrivateRoute({ children, role }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (role && user.role !== role) return <Navigate to={`/${user.role}`} replace />
  return children
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/"        element={<HomePage />} />
      <Route path="/about"   element={<AboutPage />} />
      <Route path="/team"    element={<TeamPage />} />
      <Route path="/login"   element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

      <Route path="/student/*"   element={<PrivateRoute role="student"><StudentDash /></PrivateRoute>} />
      <Route path="/recruiter/*" element={<PrivateRoute role="recruiter"><RecruiterDash /></PrivateRoute>} />
      <Route path="/institute/*" element={<PrivateRoute role="institute"><InstituteDash /></PrivateRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}