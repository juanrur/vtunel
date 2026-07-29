'use client'

export default function SingInButtons () {
const handleGitHubSignIn = () => {
  window.location.href = '/auth/github'
}

const handleGoogleSignIn = () => {
  window.location.href = '/auth/google'
}

  return <>
    <button className='p-2 rounded-lg w-32' onClick={handleGitHubSignIn}>Sign In with GitHub</button>
    <button className='p-2 rounded-lg w-32' onClick={handleGoogleSignIn}>Sign In with Google</button>
  </>
}
