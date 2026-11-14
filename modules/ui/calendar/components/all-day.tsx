'use client'

// Needed because all-day items have no hour, so they can't be placed in the hour grid.
// This band goes above the hours of the day and week views and lists, for each day,
// the all-day items that cover it (a trip from the 10th to the 12th shows in the 3 columns).
// Its height is fixed (h-[52px], same as the "All day" label in calendar.tsx) so the hours stay aligned.

import { useRef } from 'react'
import type { Event } from '@events/types'
import type { Task } from '@tasks/types'
import type { Template } from 'modules/templates/types'
import { useEventsStore } from '@events/store'
import { useTasksStore } from '@tasks/store'
import AddDialog from '@ui/shared/components/add/add-dialog'
import { DialogType } from '@ui/shared/components/add/add-button'
import { occursOnDay } from '@shared/utils'

// Needed to open the edit dialog of an all-day item, since it isn't drawn by the Event/Task components of the grid
function Item ({ item, style }: { item: Event | Task, style: React.CSSProperties }) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const { updateEvent, deleteEvent } = useEventsStore()
  const { updateTask, deleteTask } = useTasksStore()

  const isTask = 'done' in item

  function handleSubmit (newItem: Omit<Task, 'id'> | Omit<Event, 'id'> | Omit<Template, 'id'>) {
    if (isTask) updateTask(item.id, newItem as Task)
    else updateEvent(item.id, newItem as Event)
  }

  function handleDelete () {
    if (isTask) deleteTask(item.id)
    else deleteEvent(item.id)
  }

  return (
    <li
      className={`text-xs bg-zinc-600 rounded px-1 truncate cursor-pointer ${isTask && item.done ? 'line-through opacity-50' : ''}`}
      onClick={() => dialogRef.current?.showModal()}
      style={style}
    >
      {isTask ? item.title : item.name}
      <div className='absolute text-base'>
        <AddDialog
          ref={dialogRef}
          type={isTask ? DialogType.Task : DialogType.Event}
          item={item}
          onSubmit={handleSubmit}
          onDelete={handleDelete}
        >
          Edit {isTask ? 'Task' : 'Event'}
        </AddDialog>
      </div>
    </li>
  )
}

export default function AllDay ({ days, items }: { days: Date[], items: (Event | Task)[] }) {
  // Needed so an item of several days is drawn as one continuous bar instead of one box per day:
  // each item spans from the first to the last column it covers (grid-column), and goes in the first
  // row (lane) where it doesn't overlap another bar
  const laneEnds: number[] = []
  const bars = items
    .filter(item => item.allDay && days.some(date => occursOnDay(item, date)))
    .sort((a, b) => a.startTime!.getTime() - b.startTime!.getTime())
    .map(item => {
      const firstColumn = days.findIndex(date => occursOnDay(item, date))
      const lastColumn = days.findLastIndex(date => occursOnDay(item, date))
      let lane = laneEnds.findIndex(laneEnd => laneEnd < firstColumn)
      if (lane === -1) lane = laneEnds.length
      laneEnds[lane] = lastColumn
      return { item, firstColumn, lastColumn, lane }
    })

  return (
    <ul
      className='grid h-[52px] gap-y-0.5 p-0.5 border-b border-primary shrink-0 overflow-y-auto content-start'
      style={{ gridTemplateColumns: `repeat(${days.length}, minmax(0, 1fr))` }}
    >
      {bars.map(({ item, firstColumn, lastColumn, lane }) => (
        <Item key={item.id} item={item} style={{ gridColumn: `${firstColumn + 1} / ${lastColumn + 2}`, gridRow: lane + 1 }} />
      ))}
    </ul>
  )
}
