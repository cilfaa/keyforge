import { createContext, useContext, useEffect, useState } from 'react'
import { loginUser, registerUser } from './api.js'

const STORAGE_KEY = 'keyforge_user_v1'
const AuthContext = createContext(null)

function loadUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadUser)

  useEffect(() => {
    try {
      if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
      else localStorage.removeItem(STORAGE_KEY)
    } catch {
      // Abaikan jika storage penuh/diblokir
    }
  }, [user])

  const login = async (payload) => {
    const data = await loginUser(payload)
    setUser(data)
    return data
  }

  const register = async (payload) => {
    const data = await registerUser(payload)
    setUser(data)
    return data
  }

  const logout = () => setUser(null)

  return <AuthContext.Provider value={{ user, login, register, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
