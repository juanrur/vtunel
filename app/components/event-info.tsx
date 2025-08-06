import { Event } from '@/types'
import { FormEvent, useRef } from 'react'
import { useEventsStore } from '@/store'

export default function EventInfo ({ event }: { event: Event }) {
  const { deleteEvent } = useEventsStore()

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
        <dialog ref={EventEditDialog} className='bg-white rounded-lg p-4 shadow-lg top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' closedby="any">
          <EditEventDialog event={event} />
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

const EditEventDialog = ({ event }: { event: Event }) => {
  const { updateEvent } = useEventsStore()

  const handleSubmit = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault()
    const formData = new FormData(evt.currentTarget)
    const name = formData.get('name') as string
    const startTime = formData.get('startTime') as string
    const endTime = formData.get('endTime') as string
    const day = formData.get('day') as string

    if (!name || !startTime || !endTime || !day) {
      console.error('All fields are required')
      return
    }

    const updatedEvent: Event = {
      ...event,
      name,
      startTime: new Date(new Date(`${day}T${startTime}`)),
      endTime: new Date(new Date(`${day}T${endTime}`))
    }

    updateEvent(event.id, updatedEvent)
  }

  return (
      <form method='dialog' onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <h2 className='text-xl font-bold'>Edit Event</h2>
        <label>
          Name:
          <input type='text' name='name' className='border rounded p-1 w-full' defaultValue={event.name} />
        </label>
        <label>
          Day:
          <input
            type='date'
            name='day'
            className='border rounded p-1 w-full'
            defaultValue={`${event.startTime.getFullYear()}-${(event.startTime.getMonth() + 1).toString().padStart(2, '0')}-${event.startTime.getDate().toString().padStart(2, '0')}`} />
        </label>
        <label>
          Start Time:
          <input
            type='time'
            name='startTime'
            className='border rounded p-1 w-full'
            defaultValue={event.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} />
        </label>
        <label>
          End Time:
          <input
            type='time'
            name='endTime'
            className='border rounded p-1 w-full'
            defaultValue={event.endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}/>
        </label>
        <button type='submit' className='bg-blue-500 text-white rounded px-4 py-2'>Save</button>
      </form>
  )
}
