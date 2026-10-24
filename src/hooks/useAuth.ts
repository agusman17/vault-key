import { useCallback, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { AuthStatus, User } from '@/types'

type SupabaseUser = {
  id: string
  email: string | null
  created_at: string | null
}

function mapUser(u: SupabaseUser): User {
  return {
    id: u.id,
    email: u.email ?? '',
    created_at: u.created_at ?? new Date().toISOString(),
  }
}

export interface UseAuthReturn {
  authStatus: AuthStatus
  user: User | null
  error: string | null
  signInWithPassword: (email: string, password: string) => Promise<{
    success: boolean
    user: User | null
    error: string | null
  }>
  signUp: (email: string, password: string) => Promise<{
    success: boolean
    user: User | null
    error: string | null
  }>
  signOut: () => Promise<{ success: boolean; error: string | null }>
}

export function useAuth(): UseAuthReturn {
  const [authStatus, setAuthStatus] = useState<AuthStatus>('loading')
  const [user, setUser] = useState<User | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    const initialize = async () => {
      try {
        const { data, error: sessionError } = await supabase.auth.getSession()
        if (!mounted) return
        if (sessionError) throw sessionError
        const sessionUser = data.session?.user
        setUser(sessionUser ? mapUser(sessionUser) : null)
        setAuthStatus(data.session ? 'authenticated' : 'unauthenticated')
      } catch (err) {
        if (!mounted) return
        setError(err instanceof Error ? err.message : 'Failed to load session')
        setAuthStatus('unauthenticated')
      }
    }

    initialize()

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!mounted) return
        setUser(session?.user ? mapUser(session.user) : null)
        setAuthStatus(session ? 'authenticated' : 'unauthenticated')
        setError(null)
      },
    )

    return () => {
      mounted = false
      subscription.subscription.unsubscribe()
    }
  }, [])

  const signInWithPassword = useCallback(
    async (email: string, password: string) => {
      setError(null)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError(error.message)
        return { success: false, user: null, error: error.message }
      }

      const authenticatedUser = data.user
      setUser(authenticatedUser ? mapUser(authenticatedUser) : null)
      setAuthStatus(authenticatedUser ? 'authenticated' : 'unauthenticated')
      return {
        success: !!authenticatedUser,
        user: authenticatedUser ? mapUser(authenticatedUser) : null,
        error: null,
      }
    },
    [],
  )

  const signUp = useCallback(async (email: string, password: string) => {
    setError(null)
    const { data, error } = await supabase.auth.signUp({ email, password })

    if (error) {
      setError(error.message)
      return { success: false, user: null, error: error.message }
    }

    const newUser = data.user
    setUser(newUser ? mapUser(newUser) : null)
    setAuthStatus(newUser ? 'authenticated' : 'unauthenticated')
    return {
      success: !!newUser,
      user: newUser ? mapUser(newUser) : null,
      error: null,
    }
  }, [])

  const signOut = useCallback(async () => {
    setError(null)
    const { error } = await supabase.auth.signOut()

    if (error) {
      setError(error.message)
      return { success: false, error: error.message }
    }

    setUser(null)
    setAuthStatus('unauthenticated')
    return { success: true, error: null }
  }, [])

  return {
    authStatus,
    user,
    error,
    signInWithPassword,
    signUp,
    signOut,
  }
}
