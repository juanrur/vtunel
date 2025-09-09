import { Event } from '@/types'
import { FormEvent } from 'react'

export default function EventForm ({ event, close, onSubmit }: { event?: Omit<Event, 'userId' | 'id'> | Event, close: () => void, onSubmit: (event: Omit<Event, 'userId' | 'id'>) => void }) {
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

    const newEvent: Omit<Event, 'userId' | 'id'> = {
      name,
      startTime: new Date(new Date(`${day}T${startTime}`)),
      endTime: new Date(new Date(`${day}T${endTime}`))
    }

    close()

    onSubmit(newEvent)
  }

  return (
      <form method='dialog' onSubmit={handleSubmit} className='flex flex-col gap-4 dark:text-white text-zinc-800'>
        <button className='absolute top-3 right-4 text-white rounded-full size-10 border-2'
          onClick={event => {
            event.stopPropagation()
            close()
          }}>X</button>
        <label>
          Name:
          <input type='text' name='name' className='border rounded p-1 w-full text-black' defaultValue={event?.name} />
        </label>
        <label>
          Day:
          <input
            type='date'
            name='day'
            className='border rounded p-1 w-full text-black'
            defaultValue={`${event?.startTime.getFullYear()}-${(event ? event.startTime.getMonth() + 1 : '').toString().padStart(2, '0')}-${event?.startTime.getDate().toString().padStart(2, '0')}`} />
        </label>
        <label>
          Start Time:
          <input
            type='time'
            name='startTime'
            className='border rounded p-1 w-full text-black'
            defaultValue={event?.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} />
        </label>
        <label>
          End Time:
          <input
            type='time'
            name='endTime'
            className='border rounded p-1 w-full text-black'
            defaultValue={event?.endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}/>
        </label>
        <button type='submit' className='bg-secondary text-white rounded px-4 py-2 border'>Save</button>
      </form>
  )
}
