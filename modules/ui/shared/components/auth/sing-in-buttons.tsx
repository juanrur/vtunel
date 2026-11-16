import GitHubIcon from '@icons/github'
import GoogleIcon from '@icons/google'

const base = 'inline-flex h-12 whitespace-nowrap items-center justify-center gap-2.5 rounded-lg px-5 text-[15px] font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500'

// Plain anchors: /auth/* are route handlers that redirect to the provider,
// so they work without JavaScript and must not be prefetched.
export default function SingInButtons () {
  return (
    <div className='flex flex-col gap-3 sm:flex-row sm:flex-wrap'>
      <a
        href='/auth/github'
        className={`${base} bg-[#24232a] text-white hover:bg-[#35343d] dark:bg-[#ecebf0] dark:text-[#18171c] dark:hover:bg-white`}
      >
        <GitHubIcon />
        Sign in with GitHub
      </a>
      <a
        href='/auth/google'
        className={`${base} border border-primary bg-primary hover:bg-secondary`}
      >
        <GoogleIcon />
        Sign in with Google
      </a>
    </div>
  )
}
