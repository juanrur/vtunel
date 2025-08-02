'use client'

import { useEventsStore } from '@/store'
import { createBrowserClient } from '@supabase/ssr'
import { Session } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function AuthButton () {
  const [session, setSession] = useState<Session|null>(null)
  const { setToken } = useEventsStore()

  const router = useRouter()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
  )

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setSession(session)
        setToken(session.access_token)
      }
    }

    getSession()
  }, [supabase.auth, setToken])

  const handleSignIn = async () => {
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })
    } catch (error) {
      console.error('Error signing in:', error)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setSession(null)
    router.refresh()
  }

  return (
    <>
      {session
        ? (
          <button className='border p-2 rounded-lg' onClick={handleSignOut}>Sing Out</button>
          )
        : (
          <button className='border p-2 rounded-lg' onClick={handleSignIn}>Sing In</button>
          )}
    </>
  )
}
