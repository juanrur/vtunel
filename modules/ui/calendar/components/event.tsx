'use client'

import { useEventsStore } from '@events/store'
import { useRef } from 'react'
import AddDialog from '@ui/shared/add/add-dialog'
import type { Event as EventType } from '@events/types'
import { DialogType } from '@ui/shared/add/add-button'

export default function Event ({ name, height, margin, id, startTime, endTime }: { name: string, height: number, margin: number, id: string, startTime: Date, endTime: Date }) {
  const { updateEvent } = useEventsStore()
  const dialogRef = useRef<HTMLDialogElement>(null)

  const handleDragStart = (event: any) => {
    event.dataTransfer?.setData('text/plain', 'event:' + id)
  }

  const handleDragEnd = (event: any) => {
  }

  return (
    <article draggable onDragStart={handleDragStart} onDragEnd={handleDragEnd} onClick={() => dialogRef.current?.showModal()}
    className='bg-zinc-600 w-3/4 inline-flex overflow-hidden py-1 px-1.5 rounded-r absolute border-2 border-[var(--background-color)]'
    style={{ height: height + 'px', marginTop: margin + 'px' }}
    >
      {name}
      <AddDialog
      type={DialogType.Event}
      ref={dialogRef}
      onSubmit={(newEvent) => updateEvent(id, newEvent as EventType)}
      item={{ name, startTime, endTime } as EventType}>
        Edit Event
      </AddDialog>
    </article>
  )
}
