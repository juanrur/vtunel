'use client'

import { useEventsStore } from '@events/store'
import { useRef } from 'react'
import EventDialog from '@ui/shared/events/components/event-dialog'
import type { Task as TaskType } from '@tasks/types'
import { useTasksStore } from '@tasks/store'

export default function Task ({ task, height, margin }: { task: TaskType, height: number, margin: number }) {
  const { title, id, startTime, endTime } = task
  const { updateEvent } = useEventsStore()
  const { updateTask } = useTasksStore()
  const dialogRef = useRef<HTMLDialogElement>(null)

  const handleDragStart = (event: any) => {
    event.dataTransfer?.setData('text/plain', 'task:' + id)
  }

  const handleDragEnd = (event: any) => {
  }

  return (
    <article draggable onDragStart={handleDragStart} onDragEnd={handleDragEnd} onClick={event => dialogRef.current?.showModal() }
    className='bg-zinc-600 w-3/4 inline-flex gap-1 overflow-hidden py-1 px-1.5 rounded-r absolute border-2 border-[var(--background-color)]'
    style={{ height: height + 'px', marginTop: margin + 'px' }}
    >
      <label
        className="mt-0.5 h-fit"
        onClick={event => event.stopPropagation()}
      >
        <input type="checkbox" defaultChecked={task.done} onChange={(event) => updateTask(task.id, { done: event.target.checked })} className="peer hidden" />
        <div className="w-5 h-5 border rounded peer-checked:bg-indigo-900 grid place-content-center peer-checked:*:opacity-100 transition-all">
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white opacity-20 peer-checked:opacity-100">
            <path d="M20.285 6.709a1 1 0 0 0-1.414-1.418l-9.192 9.205-4.192-4.205a1 1 0 0 0-1.414 1.418l5 5a1 1 0 0 0 1.414 0l10-10z" />
          </svg>
        </div>
      </label>
      <h2>{task.title}</h2>
      <EventDialog ref={dialogRef} onSubmit={(newEvent) => updateEvent(id, newEvent)} event={{ name: title, startTime, endTime }}>
        Edit Event
      </EventDialog>
    </article>
  )
}
