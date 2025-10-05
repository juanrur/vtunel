import Week from '@/components/week'
import Aside from '@/components/aside'
import { redirect } from 'next/navigation'
import { createServerClient } from '@/utils'
import { cookies } from 'next/headers'
import Header from './components/header'

export default async function Home () {
  const supabase = createServerClient(cookies)
  const { data: { session } } = await supabase.auth.getSession()

  if (session === null) redirect('/login')

  return (
    <main className='grid grid-cols-[20%,1fr] h-screen overflow-hidden max-md:grid-cols-1'>
      <div className='max-md:hidden'>
        <Aside />
      </div>
      <div className='h-full flex flex-col min-h-0'>
        <Header />
        <Week />
      </div>
    </main>
  )
}
