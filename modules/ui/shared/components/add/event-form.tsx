import { Event } from '@events/types'
import DateTimeRange from '@ui/shared/components/add/date-time-range'
import { FormEvent } from 'react'
import DeleteButton from './delete-button'
import CloseButton from './close-button'

const defaultStart = new Date()
const defaultEnd = new Date(defaultStart)
defaultEnd.setHours(defaultEnd.getHours() + 1)

export default function EventForm ({ event = { name: '', startTime: defaultStart, endTime: defaultEnd }, close, onSubmit, onDelete }: { event?: any | Event, close: () => void, onSubmit: (event: Omit<Event, 'id'>) => void, onDelete?: () => void }) {
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

    const newEvent: any = {
      name,
      startTime: new Date(new Date(`${day}T${startTime}`)),
      endTime: new Date(new Date(`${day}T${endTime}`))
    }

    close()

    onSubmit(newEvent)
  }

  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-4 dark:text-white text-zinc-800'>
      <div className='absolute top-3 right-4 flex items-center gap-2'>
        {event?.id && onDelete && <DeleteButton onDelete={onDelete} close={close} />}
        <CloseButton close={close} />
      </div>
      <label>
        Name:
        <input type='text' name='name' className='border rounded p-1 w-full text-black' defaultValue={event?.name} />
      </label>
      <DateTimeRange
        startDate={event?.startTime ?? defaultStart}
        endDate={event?.endTime ?? defaultEnd}
      />
      <button type='submit' className='bg-secondary text-white rounded px-4 py-2 border'>Save</button>
    </form>
  )
}
