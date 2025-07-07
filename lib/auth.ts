import { supabase } from './supabase'
import { User, Session, AuthError } from '@supabase/supabase-js'

export interface AuthUser {
  id: string
  email: string
  username?: string
  full_name?: string
  avatar_url?: string
}

export interface SignUpData {
  email: string
  password: string
  username?: string
  full_name?: string
}

export interface SignInData {
  email: string
  password: string
}

// Sign up with email and password
export async function signUp(data: SignUpData): Promise<{ user: User | null; error: AuthError | null }> {
  if (!supabase) {
    return { user: null, error: { message: 'Supabase not configured', status: 500 } as AuthError }
  }

  const { data: authData, error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        username: data.username,
        full_name: data.full_name,
      }
    }
  })

  return { user: authData.user, error }
}

// Sign in with email and password
export async function signIn(data: SignInData): Promise<{ user: User | null; error: AuthError | null }> {
  if (!supabase) {
    return { user: null, error: { message: 'Supabase not configured', status: 500 } as AuthError }
  }

  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  })

  return { user: authData.user, error }
}

// Sign in with Google OAuth
export async function signInWithGoogle(): Promise<{ user: User | null; error: AuthError | null }> {
  if (!supabase) {
    return { user: null, error: { message: 'Supabase not configured', status: 500 } as AuthError }
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`
    }
  })

  if (error) {
    // Provide more helpful error messages
    let errorMessage = error.message
    if (error.message.includes('provider is not enabled')) {
      errorMessage = 'Google OAuth is not enabled in Supabase. Please follow the setup guide to enable it.'
    } else if (error.message.includes('Invalid redirect URI')) {
      errorMessage = 'Invalid redirect URI. Please check your Google OAuth configuration.'
    } else if (error.message.includes('Client ID not found')) {
      errorMessage = 'Invalid Google OAuth credentials. Please check your Client ID and Secret.'
    }
    
    return { 
      user: null, 
      error: { 
        ...error, 
        message: errorMessage 
      } as AuthError 
    }
  }

  // The user will be redirected to Google, so we return null for now
  return { user: null, error: null }
}

// Sign out
export async function signOut(): Promise<{ error: AuthError | null }> {
  if (!supabase) {
    return { error: { message: 'Supabase not configured', status: 500 } as AuthError }
  }

  const { error } = await supabase.auth.signOut()
  return { error }
}

// Get current session
export async function getSession(): Promise<{ session: Session | null; error: AuthError | null }> {
  if (!supabase) {
    return { session: null, error: { message: 'Supabase not configured', status: 500 } as AuthError }
  }

  const { data: { session }, error } = await supabase.auth.getSession()
  return { session, error }
}

// Get current user
export async function getCurrentUser(): Promise<{ user: User | null; error: AuthError | null }> {
  if (!supabase) {
    return { user: null, error: { message: 'Supabase not configured', status: 500 } as AuthError }
  }

  const { data: { user }, error } = await supabase.auth.getUser()
  return { user, error }
}

// Listen to auth state changes
export function onAuthStateChange(callback: (event: string, session: Session | null) => void) {
  if (!supabase) {
    console.warn('Supabase not configured - auth state change listener not available')
    return () => {}
  }

  const { data: { subscription } } = supabase.auth.onAuthStateChange(callback)
  return () => subscription.unsubscribe()
}

// Update user profile
export async function updateProfile(updates: {
  username?: string
  full_name?: string
  avatar_url?: string
}): Promise<{ user: User | null; error: AuthError | null }> {
  if (!supabase) {
    return { user: null, error: { message: 'Supabase not configured', status: 500 } as AuthError }
  }

  const { data: { user }, error } = await supabase.auth.updateUser({
    data: updates
  })

  return { user, error }
} 