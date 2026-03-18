import { useEventsStore } from '@/store'
import { useRef } from 'react'
import { type Event as EventType } from '@/types'
import EventDialog from '@/components/event-dialog'

export default function MonthEvent ({ event }: {event: EventType}) {
  const { updateEvent } = useEventsStore()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const showModal = () => {
    if (dialogRef.current) {
      dialogRef.current.showModal()
    }
  }
  return (
    <article
      draggable
      onDragStart={(evt) => {
        evt.dataTransfer?.setData('text/plain', event.id)
      }}
      onClick={showModal}
      className='self-start text-sm flex gap-1 max-w-full'
      key={event.id}
    >
      <span>{event.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      <p className='truncate'>{event.name}</p>
      <EventDialog
        key={event.id + event.startTime.getTime() + event.endTime.getTime()} // fuerza remount si cambian los datos
        ref={dialogRef}
        event={event}
        onSubmit={(newEvent) => updateEvent(event.id, newEvent)}
      >
        Edit Event
      </EventDialog>
    </article>
  )
}
