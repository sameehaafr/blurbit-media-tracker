'use client'

import { useState } from 'react'
import { SignInForm } from '@/components/auth/sign-in-form'
import { SignUpForm } from '@/components/auth/sign-up-form'
import { useRouter } from 'next/navigation'

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false)
  const router = useRouter()

  const handleAuthSuccess = () => {
    router.push('/profile')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {isSignUp ? (
          <SignUpForm 
            onSuccess={handleAuthSuccess}
            onSwitchToSignIn={() => setIsSignUp(false)}
          />
        ) : (
          <SignInForm 
            onSuccess={handleAuthSuccess}
            onSwitchToSignUp={() => setIsSignUp(true)}
          />
        )}
      </div>
    </div>
  )
} 