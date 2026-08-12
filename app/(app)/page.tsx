import Aside from '@ui/calendar/components/aside'
import CalendarWrapper from '@ui/calendar/components/calendar-wrapper'

export default async function Home () {
  return (
    <main className='grid grid-cols-[20%,1fr] h-full max-md:grid-cols-1'>
      <div className='max-md:hidden'>
        <Aside />
      </div>
      <CalendarWrapper />
    </main>
  )
}
