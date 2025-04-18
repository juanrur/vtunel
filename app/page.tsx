import Week from '@/components/week'
import EventAdderForm from '@/components/event-adder-form'
import Aside from './components/aside'

export default function Home () {
  return (
    <main className='flex justify-between h-full'>
      <div className='flex flex-col'>
        <EventAdderForm />
        <div className='relative mt-4'>
          <div className='absolute top-0 left-0 w-full h-full [line-break:anywhere]'>
            <Aside />
          </div>
        </div>
      </div>
      <Week />
    </main>
  )
}
