'use client'
import { type Event } from '@/types'
import RemoveScrollbar from '@/remove-scrollbar.module.css'
import EventInfo from './event-info'

export default function EventList ({ events } : { events: Event[] }) {
  return <ul className={`${RemoveScrollbar.remove} flex flex-col gap-2 overflow-auto`}>
    {events.length === 0 && <li>No events</li>}

    {events.map((event) => (
      <EventInfo
        key={event.id}
        event={event}
     />
    ))}
  </ul>
}
