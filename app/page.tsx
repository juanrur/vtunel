import Week from '@/components/week'
import EventAdderForm from '@/components/event-adder-form'

export default function Home () {
  return (
    <main className='flex justify-between h-full'>
      <EventAdderForm />
      <Week />
    </main>
  )
}
