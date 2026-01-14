import React, { forwardRef } from 'react'
import EventForm from './event-form'
import { Event } from '@/types'

interface EventDialogProps {
  children: React.ReactNode
  onSubmit: (newEvent: Omit<Event, 'userId' | 'id'>) => void
  event?: any | Event
}

const EventDialog = forwardRef<HTMLDialogElement, EventDialogProps>(
  function EventDialog ({ children, onSubmit, event }, ref) {
    return (
      <dialog
        className='bg-primary border-2 rounded-lg p-4 shadow-lg top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 relative'
        ref={ref}
      >
        <h2 className='text-2xl font-bold mb-4 text-white'>{children}</h2>
        <EventForm close={() => (ref as React.RefObject<HTMLDialogElement>)?.current?.close()} onSubmit={onSubmit} event={event} />
      </dialog>
    )
  }
)

export default EventDialog
