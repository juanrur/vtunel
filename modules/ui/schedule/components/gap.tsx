'use client'

import { useRef } from 'react'
import type { Event } from '@events/types'
import { useEventsStore } from '@events/store'
import AddDialog from '@ui/shared/components/add/add-dialog'
import { DialogType } from '@ui/shared/components/add/add-button'
import TimeLabel from './time-label'

interface GapProps {
  startTime: Date
  endTime: Date
}

export default function Gap ({ startTime, endTime }: GapProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const { insertEvent } = useEventsStore()

  const diffMs = endTime.getTime() - startTime.getTime()
  const diffMinutes = Math.floor(diffMs / 60000)
  const hours = Math.floor(diffMinutes / 60)
  const minutes = diffMinutes % 60

  function handleDoubleClick () {
    dialogRef.current?.showModal()
  }

  function handleSubmit (newItem: Omit<Event, 'id'>) {
    insertEvent(newItem)
  }

  const defaultEvent = {
    name: '',
    startTime,
    endTime: new Date(Math.min(endTime.getTime(), startTime.getTime() + 3600000))
  }

  return (
    <article className='grid grid-cols-[25%_1fr] gap-4 opacity-60' onDoubleClick={handleDoubleClick}>
      <TimeLabel time={startTime} />

      <article className='p-4 border border-dashed border-primary min-h-[82px] rounded-xl bg-secondary/50 flex flex-col justify-center cursor-pointer'>
        <time className='text-zinc-500 text-sm select-none'>
          {hours > 0 ? `${hours}h ` : ''}{minutes > 0 ? `${minutes}m` : ''} free
        </time>
      </article>

      <AddDialog
        ref={dialogRef}
        type={DialogType.Event}
        item={defaultEvent as Event}
        onSubmit={handleSubmit}
      >
        New Event
      </AddDialog>
    </article>
  )
}
