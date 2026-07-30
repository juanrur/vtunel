import { Template } from '@templates/types'
import { FormEvent } from 'react'
import DeleteButton from './delete-button'
import CloseButton from './close-button'

const defaultStart = new Date()
const defaultEnd = new Date(defaultStart)
defaultEnd.setHours(defaultEnd.getHours() + 1)

export default function TemplateForm ({ template, close, onSubmit, onDelete }: { template?: Template, close: () => void, onSubmit: (template: Omit<Template, 'id'>) => void, onDelete?: () => void }) {
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
      <div className='absolute top-3 right-4 flex items-center gap-2'>
        {template?.id && onDelete && <DeleteButton onDelete={onDelete} close={close} />}
        <CloseButton close={close} />
      </div>
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
