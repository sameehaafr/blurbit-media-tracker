'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { getSession, onAuthStateChange } from './auth'

interface UserContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signOut: () => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { session: initialSession } = await getSession()
      setSession(initialSession)
      setUser(initialSession?.user ?? null)
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth state changes
    const unsubscribe = onAuthStateChange((event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signOut = async () => {
    const { signOut: authSignOut } = await import('./auth')
    await authSignOut()
  }

  const value = {
    user,
    session,
    loading,
    signOut,
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
} 