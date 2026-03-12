'use client'

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react'
import type { PublicUser } from '@/types'

interface AuthCtx {
  user: PublicUser | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthCtx | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<PublicUser | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const t = localStorage.getItem('pf_token')
    const u = localStorage.getItem('pf_user')
    queueMicrotask(() => {
      if (t && u) {
        setToken(t)
        setUser(JSON.parse(u))
      }
      setHydrated(true)
    })
  }, [])

  const persist = (u: PublicUser, t: string) => {
    setUser(u); setToken(t)
    localStorage.setItem('pf_token', t)
    localStorage.setItem('pf_user', JSON.stringify(u))
    // Set cookie for middleware (will be picked up by nextjs)
    document.cookie = `pf_token=${t}; path=/; sameSite=lax; max-age=2592000` // 30 days
  }

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message)
    persist(data.user, data.token)
  }, [])

  const register = useCallback(async (name: string, email: string, password: string) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message)
    persist(data.user, data.token)
  }, [])

  const logout = useCallback(() => {
    setUser(null); setToken(null)
    localStorage.removeItem('pf_token')
    localStorage.removeItem('pf_user')
    // Clear cookie
    document.cookie = 'pf_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
  }, [])

  if (!hydrated) return null

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
