'use client'
import { Event } from '@/types'
import { useRef } from 'react'
import { useEventsStore } from '@/store'
import EventForm from './event-form'

export default function EventInfo ({ event }: { event: Event }) {
  const { deleteEvent, updateEvent } = useEventsStore()

  const EventEditDialog = useRef<HTMLDialogElement>(null)

  const showEditDialog = () => {
    console.log(EventEditDialog.current)
    if (EventEditDialog.current) {
      console.log('Showing edit dialog for event:', event.id)
      EventEditDialog.current.showModal()
    }
  }

  return (
    <li className='border rounded-lg p-3 flex justify-between items-center bg-secondary border-primary' key={event.id} onClick={showEditDialog}>
        <dialog ref={EventEditDialog} className='bg-transparent backdrop-blur-sm border-2 rounded-lg p-4 shadow-lg top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 relative'>
          <h2 className='text-2xl font-bold mb-4 text-white'>Edit Event</h2>
          <EventForm event={event} close={() => EventEditDialog.current?.close()} onSubmit={(newEvent: Omit<Event, 'userId' | 'id'>) => updateEvent(event.id, newEvent)} />
        </dialog>
        <div>
          <h2 className='font-medium'>{event.name}</h2>
          <div className='text-sm text-zinc-500'>
            <span>{event.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            -
            <span>{event.endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            <br />
            <span>{event.startTime.toLocaleDateString('es-ES', { day: 'numeric', month: 'numeric' })}</span>
          </div>
        </div>
        <button className='border rounded-lg w-8 h-10 grid place-content-center p-1 hover:bg-red-400 shadow' onClick={() => deleteEvent(event.id)}>
          <svg className="size-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 7h16" /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /><path d="M10 12l4 4m0 -4l-4 4" /></svg>
        </button>
      </li>
  )
}
