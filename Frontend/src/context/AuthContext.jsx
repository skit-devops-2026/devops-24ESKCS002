// context/AuthContext.jsx
// No sessions. User object is saved to localStorage on login/register.
// On app load, we just read from localStorage — no API call needed.

import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  // Read user from localStorage on first load
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('ph_user')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  const login = (userData) => {
    localStorage.setItem('ph_user', JSON.stringify(userData))
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('ph_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
