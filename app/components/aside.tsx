'use client'
import { useEventsStore } from '@/store'

export default function Aside () {
  // TODO: un aside para hacer la lista de los eventos a un lado
  const { currentWeekEvents } = useEventsStore()

  return <aside className='w-full h-full'>
    <ul>
      {currentWeekEvents.map((event) => (
        <li className='border border-white rounded px-2 py-2 pt-1' key={event.id}>
          <h2>{event.name}</h2>
          <div className='text-sm text-gray-500'>
            <span>{event.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            -
            <span>{event.endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </li>
      ))}
      {currentWeekEvents.length === 0 && <li>No events</li>}
    </ul>
  </aside>
}
