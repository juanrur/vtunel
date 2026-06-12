'use client'
import { pb } from '@shared/pocketbase/client'

export default function SingInButtons () {
  const handleGitHubSignIn = async () => {
    try {
      const redirectURL = `${window.location.origin}/auth/callback?provider=github`
      await pb.collection('users').authWithOAuth2({
        provider: 'github',
        redirectURL
      })
    } catch (error) {
      console.error('Error signing in:', error)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      const redirectURL = `${window.location.origin}/auth/callback?provider=google`
      await pb.collection('users').authWithOAuth2({
        provider: 'google',
        redirectURL
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
