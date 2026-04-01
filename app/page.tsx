import Calendar from '@ui/calendar/components/calendar'
import Aside from '@ui/calendar/components/aside'
import Header from '@ui/calendar/components/header'

export default async function Home () {
  return (
    <main className='grid grid-cols-[20%,1fr] h-screen max-md:grid-cols-1'>
      <div className='max-md:hidden'>
        <Aside />
      </div>
      <div className='h-full flex flex-col min-h-0'>
        <Header />
        <Calendar />
      </div>
    </main>
  )
}
