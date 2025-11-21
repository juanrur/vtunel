'use client'
import SingOutButton from '@/components/sing-out-button'
import { useEventsStore } from '@/store'
import { useEffect } from 'react'

export default function TaskPage () {
  const { events, getAllEvents, token } = useEventsStore()
  useEffect(() => {
    if (token) getAllEvents(token)
  }, [getAllEvents, token])

  return (
    <main className='text-right'>
      <div>
        <SingOutButton />
      </div>

      <div className='flex items-center justify-center h-screen'>
        {events.map(event => (
          <div key={event.id} className='p-4 m-2 border rounded shadow'>
            <h2 className='text-xl font-bold'>{event.name}</h2>
            <p className='text-gray-600'>{event.startTime.toISOString()}</p>
          </div>
        ))}
      </div>
    </main>
  )
}
