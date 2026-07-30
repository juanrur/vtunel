'use client'

import { useRef } from 'react'
import type { Event } from '@events/types'
import type { Task } from '@tasks/types'
import type { Template } from 'modules/templates/types'
import { useEventsStore } from '@events/store'
import { useTasksStore } from '@tasks/store'
import AddDialog from '@ui/shared/components/add/add-dialog'
import { DialogType } from '@ui/shared/components/add/add-button'
import TrashIcon from '@ui/shared/components/icons/trash'
import TimeLabel from './time-label'

interface ItemProps {
  item: Event | Task
}

export default function Item ({ item }: ItemProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const { updateEvent, deleteEvent } = useEventsStore()
  const { updateTask, deleteTask } = useTasksStore()

  const isTask = 'done' in item
  const title = isTask ? item.title : item.name

  if (!item.startTime || !item.endTime) return null

  const diffMs = item.endTime.getTime() - item.startTime.getTime()
  const diffMinutes = Math.floor(diffMs / 60000)
  const hours = Math.floor(diffMinutes / 60)
  const minutes = diffMinutes % 60

  function handleDelete (event: React.MouseEvent) {
    event.stopPropagation()
    if (isTask) deleteTask(item.id)
    else deleteEvent(item.id)
  }

  function handleDeleteFromDialog () {
    if (isTask) deleteTask(item.id)
    else deleteEvent(item.id)
  }

  function handleToggleDone (event: React.ChangeEvent<HTMLInputElement>) {
    event.stopPropagation()
    if (isTask) updateTask(item.id, { done: event.target.checked })
  }

  function handleSubmit (newItem: Omit<Task, 'id'> | Omit<Event, 'id'> | Omit<Template, 'id'>) {
    if (isTask) updateTask(item.id, newItem as Task)
    else updateEvent(item.id, newItem as Event)
  }

  return (
    <article
      className='grid grid-cols-[25%_1fr] gap-4 group cursor-pointer'
      onClick={() => dialogRef.current?.showModal()}
    >
      <TimeLabel time={item.startTime} />

      <article className='p-4 border border-primary min-h-[82px] rounded-xl shadow bg-secondary flex flex-col justify-center relative'>
        <div>
          <header className='flex items-center gap-2'>
            {isTask && (
              <label className='flex items-center gap-2 cursor-pointer' onClick={(event) => event.stopPropagation()}>
                <input
                  type='checkbox'
                  checked={item.done}
                  onChange={handleToggleDone}
                  onClick={(event) => event.stopPropagation()}
                  className='peer hidden'
                />
                <div className='w-5 h-5 border rounded peer-checked:bg-indigo-900 grid place-content-center peer-checked:*:opacity-100 transition-all'>
                  <svg viewBox='0 0 24 24' className='w-4 h-4 fill-white opacity-20 peer-checked:opacity-100'>
                    <path d='M20.285 6.709a1 1 0 0 0-1.414-1.418l-9.192 9.205-4.192-4.205a1 1 0 0 0-1.414 1.418l5 5a1 1 0 0 0 1.414 0l10-10z' />
                  </svg>
                </div>
              </label>
            )}
            <h2 className={`text-lg ${isTask && item.done ? 'line-through opacity-50' : ''}`}>{title}</h2>
          </header>

          <p className='text-zinc-400 text-sm'>
            {hours > 0 ? `${hours}h ` : ''}{minutes > 0 ? `${minutes}m` : ''}
          </p>
        </div>

        <button
          className='absolute top-3 right-4 rounded border border-primary p-2 hover:bg-red-400/20 hover:text-red-400 transition-colors'
          onClick={handleDelete}
        >
          <TrashIcon />
        </button>
      </article>

      <AddDialog
        ref={dialogRef}
        type={isTask ? DialogType.Task : DialogType.Event}
        item={item}
        onSubmit={handleSubmit}
        onDelete={handleDeleteFromDialog}
      >
        Edit {isTask ? 'Task' : 'Event'}
      </AddDialog>
    </article>
  )
}
