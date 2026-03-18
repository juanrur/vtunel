import Calendar from '@/components/calendar'
import Aside from '@/components/aside'
import Header from './components/header'

export default async function Home () {
  return (
    <main className='grid grid-cols-[20%,1fr] h-screen overflow-hidden max-md:grid-cols-1'>
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
