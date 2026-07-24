'use client'
import { pb } from '@shared/pocketbase/client'

export default function SingInButtons () {
  const handleGitHubSignIn = async () => {
    pb.collection('users').authWithOAuth2({
      provider: 'github'
    }).then(() => {
      document.cookie = pb.authStore.exportToCookie({ secure: false, sameSite: 'Lax', httpOnly: false })
      window.location.href = '/'
    }).catch((err) => {
      console.error('GitHub sign in failed:', err)
    })
  }

  const handleGoogleSignIn = async () => {
    pb.collection('users').authWithOAuth2({
      provider: 'google'
    }).then(() => {
      document.cookie = pb.authStore.exportToCookie()
    }).catch((err) => {
      console.error('Google sign in failed:', err)
    })
  }

  return <>
    <button className='p-2 rounded-lg w-32' onClick={handleGitHubSignIn}>Sign In with GitHub</button>
    <button className='p-2 rounded-lg w-32' onClick={handleGoogleSignIn}>Sign In with Google</button>
  </>
}
