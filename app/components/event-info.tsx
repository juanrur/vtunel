'use client'
import { Event } from '@/types'
import { useRef } from 'react'
import { useEventsStore } from '@/store'
import EventDialog from './event-dialog'
import TrashIcon from './icons/trash'

export default function EventInfo ({ event }: { event: Event }) {
  const { deleteEvent, updateEvent } = useEventsStore()

  const EventEditDialog = useRef<HTMLDialogElement>(null)

  const showEditDialog = () => {
    if (EventEditDialog.current) {
      EventEditDialog.current.showModal()
    }
  }

  const handleDragStart = (event: any) => {
    event.dataTransfer?.setData('text/plain', event.id)
  }

  const handleDragEnd = (event: any) => {
  }

  return (
    <li draggable onDragStart={handleDragStart} onDragEnd={handleDragEnd} className='border rounded-lg p-3 flex justify-between items-center bg-secondary border-primary' key={event.id} onClick={showEditDialog}>
      <EventDialog
        key={event.id + event.startTime.getTime() + event.endTime.getTime()} // fuerza remount si cambian los datos
        ref={EventEditDialog}
        onSubmit={(newEvent) => updateEvent(event.id, newEvent)}
        event={event}>
        Edit Event
      </EventDialog>

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
       <TrashIcon></TrashIcon>
      </button>
    </li>
  )
}
