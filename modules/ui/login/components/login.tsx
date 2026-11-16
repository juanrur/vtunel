import SignInButtons from '@ui/shared/components/auth/sing-in-buttons'
import Demo from './demo'
import Features from './features'

export default function Login () {
  return (
    <div className='min-h-svh text-[#393E46] dark:text-[#ecebf0]'>
      <header className='sticky top-0 z-10 border-b border-primary bg-primary'>
        <div className='mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4 sm:px-6'>
          <span className='text-xl font-bold tracking-tight'>Vtunel</span>
          <a
            href='#sign-in'
            className='rounded-lg border border-primary px-3 py-1.5 text-sm font-medium transition-colors hover:bg-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500'
          >
            Sign in
          </a>
        </div>
      </header>

      <main>
        <section
          id='sign-in'
          className='mx-auto grid w-full max-w-6xl scroll-mt-14 items-center gap-10 px-4 pt-10 sm:px-6 sm:pt-16 lg:grid-cols-12 lg:gap-12 lg:pt-20'
        >
          <div className='lg:col-span-5'>
            <h1 className='text-4xl font-semibold leading-[1.05] tracking-tight text-balance sm:text-5xl lg:text-[3.5rem]'>
              Plan your week by dragging it into place
            </h1>
            <p className='mt-5 max-w-[44ch] text-lg leading-relaxed opacity-70'>
              Vtunel is a calendar that keeps your events, tasks and weekly routines on one grid, so you can see what fits and where you still have time.
            </p>
            <div className='mt-8'>
              <SignInButtons />
            </div>
            <p className='mt-3 text-sm opacity-60'>
              No new password. Use the account you already have.
            </p>
          </div>

          <div className='lg:col-span-7'>
            <Demo />
          </div>
        </section>

        <Features />

        <section className='mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6 md:pb-28'>
          <div className='border-t border-primary pt-12 md:pt-16'>
            <h2 className='max-w-[16ch] text-3xl font-semibold tracking-tight text-balance sm:text-4xl'>
              Your real week goes here
            </h2>
            <p className='mt-3 max-w-[44ch] leading-relaxed opacity-70'>
              Sign in and the calendar opens empty, ready for your first event.
            </p>
            <div className='mt-8'>
              <SignInButtons />
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
