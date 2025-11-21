'use client'

import { useEventsStore } from '@/store'
import { useEffect } from 'react'

export default function TaskPage () {
  const { events, getAllEvents, token } = useEventsStore()
  useEffect(() => {
    getAllEvents(token)
  }, [getAllEvents])
  return (
    <div className='flex items-center justify-center h-screen'>
      {JSON.stringify(events)}
      {events.map(event => (
        <div key={event.id} className='p-4 m-2 border rounded shadow'>
          <h2 className='text-xl font-bold'>{event.name}</h2>
          <p className='text-gray-600'>{event.startTime.toISOString()}</p>
        </div>
      ))}
    </div>
  )
}
