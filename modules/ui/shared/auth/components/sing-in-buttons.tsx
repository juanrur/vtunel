'use client'
import { supabase } from '@shared/supabase/client'

export default function SingInButtons () {
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
    <button className='p-2 rounded-lg w-32' onClick={handleGitHubSignIn}>Sign In with GitHub</button>
    <button className='p-2 rounded-lg w-32' onClick={handleGoogleSignIn}>Sign In with Google</button>
  </>
}
