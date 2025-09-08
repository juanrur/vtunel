'use client'
import { createBrowserClient } from '@supabase/ssr'

export default function SingInButtons () {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
  )

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

  return <>
    <button className='p-2 rounded-lg w-32' onClick={handleGitHubSignIn}>Sing In with GitHub</button>
    <button className='p-2 rounded-lg w-32' onClick={handleGoogleSignIn}>Sign In with Google</button>
  </>
}
