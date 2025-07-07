"use client"

import { useEffect, useState } from 'react'

export function DebugInfo() {
  const [envInfo, setEnvInfo] = useState({
    supabaseUrl: 'Not set',
    supabaseKey: 'Not set',
    isClient: false
  })

  useEffect(() => {
    setEnvInfo({
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not set',
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set (hidden)' : 'Not set',
      isClient: true
    })
  }, [])

  if (process.env.NODE_ENV === 'production') {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded-lg text-xs max-w-xs">
      <h3 className="font-bold mb-2">Debug Info</h3>
      <div>Client: {envInfo.isClient ? 'Yes' : 'No'}</div>
      <div>Supabase URL: {envInfo.supabaseUrl}</div>
      <div>Supabase Key: {envInfo.supabaseKey}</div>
    </div>
  )
} 