import { Template } from '@templates/types'
import { FormEvent } from 'react'

const defaultStart = new Date()
const defaultEnd = new Date(defaultStart)
defaultEnd.setHours(defaultEnd.getHours() + 1)

export default function TemplateForm ({ template, close, onSubmit }: { template?: Template, close: () => void, onSubmit: (template: Omit<Template, 'id'>) => void }) {
  const handleSubmit = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault()
    const formData = new FormData(evt.currentTarget)
    const title = String(formData.get('title'))
    const duration = Number(formData.get('duration'))

    if (!title || isNaN(duration)) {
      console.error('All fields are required')
      return
    }

    close()

    onSubmit({
      title,
      duration
    })
  }

  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-4 dark:text-white text-zinc-800'>
      <button type='button' className='absolute top-3 right-4 text-white rounded-full size-10 border-2'
        onClick={event => {
          event.stopPropagation()
          event.preventDefault()
          close()
        }}>X</button>
      <label>
        Title:
        <input type='text' name='title' className='border rounded p-1 w-full text-black' defaultValue={template?.title} />
      </label>
      <label>
        Duration (minutes):
        <input
          type='number'
          name='duration'
          className='border rounded p-1 w-full text-black'
          defaultValue={0} />
      </label>
      <button type='submit' className='bg-secondary text-white rounded px-4 py-2 border'>Save</button>
    </form>
  )
}
