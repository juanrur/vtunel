'use client'
import { useEventsStore } from '@/store'
import { type Event as EventType } from '@/types'
import EventDialog from './event-dialog'
import { useRef } from 'react'

export default function Month ({ events }: {events: EventType[]}) {
  const { day, changeEventStartTime } = useEventsStore()

  const handleDrop = (event: any) => {
    console.log('drop')
    event.target = event.target.closest('li')
    event.preventDefault()
    const eventID = event.dataTransfer.getData('text/plain')

    const draggedEvent = events.find(ev => ev.id === eventID)

    const newDay = Number(event.target.dataset.day)
    const newMonth = Number(event.target.dataset.month)

    const newStartTime = new Date(Date.UTC(day.getFullYear(), newMonth, newDay, draggedEvent?.startTime.getUTCHours(), draggedEvent?.startTime.getUTCMinutes()))

    changeEventStartTime(newStartTime, eventID)
  }

  const handleDragOver = (event: any) => {
    event.preventDefault()
  }

  const handleDragLeave = (event: any) => {
    event.preventDefault()
  }

  const actualMonth = day.getMonth()

  function getDaysInMonth (year: number, month: number) {
    return new Date(year, month + 1, 0).getDate()
  }

  function getDaysInMonthView (year: number, month: number) {
    const daysInLastMonth = getDaysInMonth(year, month - 1)
    const daysInMonth = getDaysInMonth(year, month)
    const remainingDays = Math.round((35 - daysInMonth) / 2)
    const daysArray = []
    let daysInMonthCounter = 1
    let remainingDaysCounter = remainingDays
    let daysInNextMonthCounter = 1

    for (let idx = 0; idx <= 35; idx++) {
      if (idx < remainingDays) {
        daysArray.push({ day: daysInLastMonth - remainingDaysCounter + 1, month: month - 1 })
        remainingDaysCounter--
      } else if (daysInMonthCounter >= daysInMonth) {
        daysArray.push({ day: daysInNextMonthCounter, month: month + 1 })
        daysInNextMonthCounter++
      } else if (idx > remainingDays) {
        daysArray.push({ day: daysInMonthCounter, month })
        daysInMonthCounter++
      }
    }

    return daysArray
  }

  const dayNumbers = getDaysInMonthView(day.getFullYear(), day.getMonth())
  console.log({ events })

  return <section className="h-full">
    <ul className="h-full grid grid-cols-7 grid-rows-5 p-1">
      {dayNumbers.map(({ day, month }, idx) => (
        <li key={idx}
        className="border border-primary flex items-center justify-center"
        >
          {day}, {month + 1}
        </li>
      })}
    </ul>
  </section>
}

function MonthEvent ({ event }: {event: EventType}) {
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
