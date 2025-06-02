'use client'
import { useEventsStore } from '@/store'
import { type Event } from '@/types'
import RemoveScrollbar from '@/remove-scrollbar.module.css'

export default function EventList ({ events } : { events: Event[] }) {
  const { deleteEvent } = useEventsStore()

  return <ul className={`${RemoveScrollbar.remove} flex flex-col gap-2 overflow-auto`}>
    {events.length === 0 && <li>No events</li>}

    {events.map((event) => (
      <li className='border border-black dark:border-white rounded px-2 py-2 pt-1 flex justify-between' key={event.id}>
        <div>
          <h2>{event.name}</h2>
          <div className='text-sm text-gray-500'>
            <span>{event.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            -
            <span>{event.endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            <br />
            <span>{event.startTime.toLocaleDateString('es-ES', { day: 'numeric', month: 'numeric' })}</span>
          </div>
        </div>
        <button className='border rounded-full size-8 grid place-content-center' onClick={() => deleteEvent(event.id)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 7h16" /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /><path d="M10 12l4 4m0 -4l-4 4" /></svg>
        </button>
      </li>
    ))}
  </ul>
}
