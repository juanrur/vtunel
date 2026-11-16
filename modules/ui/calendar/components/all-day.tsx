'use client'

// Needed because all-day items have no hour, so they can't be placed in the hour grid.
// This band goes above the hours of the day and week views and lists, for each day,
// the all-day items that cover it (a trip from the 10th to the 12th shows in the 3 columns).
// Its height is fixed (h-[52px], same as the "All day" label in calendar.tsx) so the hours stay aligned.

import { useRef } from 'react'
import type { Event } from '@events/types'
import type { Task } from '@tasks/types'
import { useEventsStore } from '@events/store'
import { useTasksStore } from '@tasks/store'
import AddDialog, { type AddDialogData } from '@ui/shared/components/add/add-dialog'
import { DialogType } from '@ui/shared/components/add/add-button'
import { occursOnDay } from '@shared/utils'

// Needed to open the edit dialog of an all-day item, since it isn't drawn by the Event/Task components of the grid
function Item ({ item, style }: { item: Event | Task, style: React.CSSProperties }) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const { updateEvent, deleteEvent } = useEventsStore()
  const { updateTask, deleteTask } = useTasksStore()

  const isTask = 'done' in item

  function handleSubmit (newItem: AddDialogData) {
    if (isTask) updateTask(item.id, newItem as Task)
    else updateEvent(item.id, newItem as Event)
  }

  function handleDelete () {
    if (isTask) deleteTask(item.id)
    else deleteEvent(item.id)
  }

  const handleDragStart = (event: any) => {
    event.dataTransfer?.setData('text/plain', (isTask ? 'task:' : 'event:') + item.id)
  }

  return (
    <li
      draggable
      onDragStart={handleDragStart}
      className='text-xs bg-zinc-600 dark:bg-zinc-700/80 dark:hover:bg-zinc-700 transition-colors rounded px-1 cursor-pointer min-w-0'
      onClick={() => dialogRef.current?.showModal()}
      style={style}
    >
      <span className={`block truncate ${isTask && item.done ? 'line-through opacity-50' : ''}`}>
        {isTask ? item.title : item.name}
      </span>
      <AddDialog
        ref={dialogRef}
        type={isTask ? DialogType.Task : DialogType.Event}
        item={item}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
      >
        Edit {isTask ? 'Task' : 'Event'}
      </AddDialog>
    </li>
  )
}

export default function AllDay ({ days, items }: { days: Date[], items: (Event | Task)[] }) {
  const { updateEvent, changeEventStartTime } = useEventsStore()
  const { updateTask, changeTaskStartTime } = useTasksStore()

  const handleDrop = (event: any) => {
    event.preventDefault()
    const [type, id] = event.dataTransfer.getData('text/plain').split(':')
    // Routines and templates aren't in `items`: they can't be all-day
    const item = items.find(item => item.id === id)
    if (!item) return

    // The day is found by the pointer position because the drop can land on a bar, not on a column
    const { left, width } = event.currentTarget.getBoundingClientRect()
    const column = Math.min(Math.floor((event.clientX - left) / (width / days.length)), days.length - 1)
    const dayStart = new Date(days[column])
    dayStart.setHours(0, 0, 0, 0)

    // An all-day item only changes its day, keeping how many days it lasts
    if (item.allDay) {
      if (type === 'task') changeTaskStartTime(dayStart, id)
      else changeEventStartTime(dayStart, id)
      return
    }

    // An item with hours becomes all-day on the day it's dropped on
    const dayEnd = new Date(dayStart)
    dayEnd.setHours(23, 59, 59, 999)
    const newRange = { allDay: true, startTime: dayStart, endTime: dayEnd }
    if (type === 'task') updateTask(id, newRange)
    else updateEvent(id, newRange)
  }

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
      onDrop={handleDrop}
      onDragOver={event => event.preventDefault()}
      className='grid h-[52px] gap-y-0.5 p-0.5 border-b border-primary shrink-0 overflow-y-auto content-start'
      style={{ gridTemplateColumns: `repeat(${days.length}, minmax(0, 1fr))` }}
    >
      {bars.map(({ item, firstColumn, lastColumn, lane }) => (
        <Item key={item.id} item={item} style={{ gridColumn: `${firstColumn + 1} / ${lastColumn + 2}`, gridRow: lane + 1 }} />
      ))}
    </ul>
  )
}
