import Week from '@/components/week'
import EventAdderForm from '@/components/event-adder-form'
import Aside from '@/components/aside'
import AuthButton from './components/auth-button'
import { redirect } from 'next/navigation'
import { createServerClient } from '@/utils'
import { cookies } from 'next/headers'

export default async function Home () {
  const supabase = createServerClient(cookies)
  const { data: { session } } = await supabase.auth.getSession()

  if (session === null) redirect('/login')

  return (
    <main className='flex justify-between h-full'>
      <aside className='flex flex-col'>
        <AuthButton />
        <EventAdderForm />
        <div className='relative mt-4'>
          <div className='absolute top-0 left-0 w-full h-full [line-break:anywhere]'>
            <Aside />
          </div>
        </div>
      </aside>
      <Week token={session.access_token} />
    </main>
  )
}
