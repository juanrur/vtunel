import { Task } from '@tasks/types'
import DateTimeRange from '@ui/shared/components/add/date-time-range'
import { FormEvent, useState } from 'react'
import DeleteButton from './delete-button'
import CloseButton from './close-button'

const defaultStart = new Date()
const defaultEnd = new Date(defaultStart)
defaultEnd.setHours(defaultEnd.getHours() + 1)

export default function TaskForm ({ task, close, onSubmit, onDelete }: { task?: Task, close: () => void, onSubmit: (task: Omit<Task, 'id'>) => void, onDelete?: () => void }) {
  const [hasDate, setHasDate] = useState(Boolean(task?.startTime))

  const handleSubmit = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault()
    const formData = new FormData(evt.currentTarget)
    const title = String(formData.get('title'))

    if (!title) {
      console.error('Title is required')
      return
    }

    if (!hasDate) {
      close()
      onSubmit({
        title,
        startTime: null,
        endTime: null,
        done: task?.done ?? false
      })
      return
    }

    const startTime = String(formData.get('startTime'))
    const endTime = String(formData.get('endTime'))
    const day = String(formData.get('day'))

    if (!startTime || !endTime || !day) {
      console.error('All date fields are required')
      return
    }

    close()

    onSubmit({
      title,
      startTime: new Date(`${day}T${startTime}`),
      endTime: new Date(`${day}T${endTime}`),
      done: task?.done ?? false
    })
  }

  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-4 dark:text-white text-zinc-800'>
      <div className='absolute top-3 right-4 flex items-center gap-2'>
        {task?.id && onDelete && <DeleteButton onDelete={onDelete} close={close} />}
        <CloseButton close={close} />
      </div>
      <label>
        Title:
        <input type='text' name='title' className='border rounded p-1 w-full text-black' defaultValue={task?.title} />
      </label>

      <label className='flex items-center gap-2 cursor-pointer'>
        <input
          type='checkbox'
          name='hasDate'
          checked={hasDate}
          onChange={(event) => setHasDate(event.target.checked)}
        />
        Has date
      </label>

      {hasDate && (
        <DateTimeRange
          startDate={task?.startTime ?? defaultStart}
          endDate={task?.endTime ?? defaultEnd}
        />
      )}
      <button type='submit' className='bg-secondary text-white rounded px-4 py-2 border'>Save</button>
    </form>
  )
}
