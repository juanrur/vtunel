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
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSession(session)
        setToken(session.access_token)
      }
    })
  }, [supabase.auth, setToken])

  const handleGitHubSignIn = async () => {
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

  const handleGoogleSignIn = async () => {
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
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
          <button className='p-2 rounded-lg w-32' onClick={handleSignOut}>Sing Out</button>
          )
        : (
          <>
            <button className='p-2 rounded-lg w-32' onClick={handleGitHubSignIn}>Sing In with GitHub</button>
            <button className='p-2 rounded-lg w-32' onClick={handleGoogleSignIn}>Sign In with Google</button>
          </>
          )}
    </>
  )
}
