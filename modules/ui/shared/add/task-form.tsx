import { Task } from '@tasks/types'
import { FormEvent } from 'react'

const defaultStart = new Date()
const defaultEnd = new Date(defaultStart)
defaultEnd.setHours(defaultEnd.getHours() + 1)

export default function TaskForm ({ task, close, onSubmit }: { task?: Task, close: () => void, onSubmit: (task: Omit<Task, 'id'>) => void }) {
  const handleSubmit = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault()
    const formData = new FormData(evt.currentTarget)
    const title = String(formData.get('title'))
    const startTime = String(formData.get('startTime'))
    const endTime = String(formData.get('endTime'))
    const day = String(formData.get('day'))

    if (!title || !startTime || !endTime || !day) {
      console.error('All fields are required')
      return
    }

    close()

    onSubmit({
      title,
      startTime: new Date(new Date(`${day}T${startTime}`)),
      endTime: new Date(new Date(`${day}T${endTime}`)),
      done: false
    })
  }

  return (
    <form method='dialog' onSubmit={handleSubmit} className='flex flex-col gap-4 dark:text-white text-zinc-800'>
      <button className='absolute top-3 right-4 text-white rounded-full size-10 border-2'
        onClick={event => {
          event.stopPropagation()
          event.preventDefault()
          close()
        }}>X</button>
      <label>
        Title:
        <input type='text' name='title' className='border rounded p-1 w-full text-black' defaultValue={task?.title} />
      </label>
      <label>
        Day:
        <input
          type='date'
          name='day'
          className='border rounded p-1 w-full text-black'
          defaultValue={`${task?.startTime.getFullYear()}-${(task ? task.startTime.getMonth() + 1 : '').toString().padStart(2, '0')}-${task?.startTime.getDate().toString().padStart(2, '0')}`} />
      </label>
      <label>
        Start Time:
        <input
          type='time'
          name='startTime'
          className='border rounded p-1 w-full text-black'
          defaultValue={task
            ? task.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : defaultStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} />
      </label>
      <label>
        End Time:
        <input
          type='time'
          name='endTime'
          className='border rounded p-1 w-full text-black'
          defaultValue={
            task
              ? task.endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : defaultEnd.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} />
      </label>
      <button type='submit' className='bg-secondary text-white rounded px-4 py-2 border'>Save</button>
    </form>
  )
}
