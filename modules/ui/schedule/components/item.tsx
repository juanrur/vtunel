'use client'

import { useRef } from 'react'
import type { Event } from '@events/types'
import type { Task } from '@tasks/types'
import { useEventsStore } from '@events/store'
import { useTasksStore } from '@tasks/store'
import AddDialog from '@ui/shared/add/add-dialog'
import { DialogType } from '@ui/shared/add/add-button'
import TrashIcon from '@ui/shared/icons/trash'

const COLOR_PAIRS = [
  { light: '#C2C4C6', dark: '#B0B3B5' },
  { light: '#90CAF9', dark: '#64B5F6' },
  { light: '#FFE082', dark: '#FFD54F' },
  { light: '#6EE7B7', dark: '#4DBE9A' },
  { light: '#EF9A9A', dark: '#E57373' },
  { light: '#B39DDB', dark: '#9575CD' },
  { light: '#F48FB1', dark: '#EC407A' },
  { light: '#4DD0E1', dark: '#26C6DA' },
  { light: '#FFF176', dark: '#FFEE58' },
  { light: '#CE93D8', dark: '#BA68C8' }
]

function getColor (id: string) {
  const index = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % COLOR_PAIRS.length
  return COLOR_PAIRS[index]
}

interface ItemProps {
  item: Event | Task
}

export default function Item ({ item }: ItemProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const { updateEvent, deleteEvent } = useEventsStore()
  const { updateTask, deleteTask } = useTasksStore()

  const isTask = 'done' in item
  const title = isTask ? item.title : item.name
  const color = getColor(item.id)

  if (!item.startTime || !item.endTime) return null

  function handleDelete (event: React.MouseEvent) {
    event.stopPropagation()
    if (isTask) deleteTask(item.id)
    else deleteEvent(item.id)
  }

  function handleToggleDone (event: React.ChangeEvent<HTMLInputElement>) {
    event.stopPropagation()
    if (isTask) updateTask(item.id, { done: event.target.checked })
  }

  function handleSubmit (newItem: Omit<Task, 'id'> | Omit<Event, 'id'>) {
    if (isTask) updateTask(item.id, newItem as Task)
    else updateEvent(item.id, newItem as Event)
  }

  return (
    <article
      className='grid grid-cols-[25%_1fr] gap-4 group cursor-pointer'
      onClick={() => dialogRef.current?.showModal()}
    >
      <aside className='flex items-center justify-end relative'>
        <time className='text-zinc-400 mr-[4.5rem] text-sm'>
          {item.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </time>

        <div
          className='rounded-full size-14 grid place-content-center text-white text-sm px-2 py-1 absolute top-1/2 -translate-y-1/2 left-3/4 -translate-x-1/2 z-10'
          style={{ background: `linear-gradient(to right, ${color.light} 60%, ${color.dark})` }}
        >
          <svg className='size-7 fill-white' viewBox='0 0 78.369 78.369'>
            <path d='M78.049,19.015L29.458,67.606c-0.428,0.428-1.121,0.428-1.548,0L0.32,40.015c-0.427-0.426-0.427-1.119,0-1.547l6.704-6.704 c0.428-0.427,1.121-0.427,1.548,0l20.113,20.112l41.113-41.113c0.429-0.427,1.12-0.427,1.548,0l6.703,6.704 C78.477,17.894,78.477,18.586,78.049,19.015z' />
          </svg>
        </div>

        <div className='bg-zinc-600 h-[200%] w-0.5 absolute top-0 left-3/4 -translate-x-1/2' />
      </aside>

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
            {item.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            {' - '}
            {item.endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
      >
        Edit {isTask ? 'Task' : 'Event'}
      </AddDialog>
    </article>
  )
}
