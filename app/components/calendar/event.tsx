'use client'

import { useEventsStore } from '@/store'
import { useRef } from 'react'
import EventDialog from '@/components/event-dialog'

export default function Event ({ name, height, margin, id, startTime, endTime }: { name: string, height: number, margin: number, id: string, startTime: Date, endTime: Date }) {
  const { updateEvent } = useEventsStore()
  const dialogRef = useRef<HTMLDialogElement>(null)

  const handleDragStart = (event: any) => {
    event.dataTransfer?.setData('text/plain', id)
  }

  const handleDragEnd = (event: any) => {
  }

  return (
    <article draggable onDragStart={handleDragStart} onDragEnd={handleDragEnd} onClick={() => dialogRef.current?.showModal()}
    className='bg-zinc-600 w-3/4 inline-flex overflow-hidden py-1 px-1.5 rounded-r absolute'
    style={{ height: height + 'px', marginTop: margin + 'px' }}
    >
      {name}
      <EventDialog ref={dialogRef} onSubmit={(newEvent) => updateEvent(id, newEvent)} event={{ name, startTime, endTime }}>
        Edit Event
      </EventDialog>
    </article>
  )
}
