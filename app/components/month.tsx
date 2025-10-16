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

    const newDay = Number(event.target.dataset.day)
    const newMonth = Number(event.target.dataset.month)

    const newStartTime = new Date(Date.UTC(day.getFullYear(), newMonth, newDay, 0, 0))

    changeEventStartTime(newStartTime, eventID)
  }

  const handleDragOver = (event: any) => {
    event.preventDefault()
  }

  const handleDragLeave = (event: any) => {
    event.preventDefault()
  }

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
      {dayNumbers.map(({ day, month }, idx) => {
        const matchingEvents = events.filter(event => {
          const eventDate = new Date(event.startTime)
          return eventDate.getMonth() === month &&
                 eventDate.getDate() === day
        })

        const sortedMatchingEvents = matchingEvents.sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
        return <li
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        data-month={month}
        data-day={day}
        key={idx}
        className="border border-primary flex flex-col items-center justify-start relative p-2 gap-2"
        >
          <span className=''>{day}</span>
          {sortedMatchingEvents.map(event =>
            <article className='self-start text-sm' key={event.id}>
              <span>{event.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              <p className='whitespace-nowrap truncate overflow-hidden w-max-4'>{event.name}</p>
            </article>
          )}
        </li>
      })}
    </ul>
  </section>
}

function Event ({ name, height, margin, id, startTime, endTime }: { name: string, height: number, margin: number, id: string, startTime: Date, endTime: Date }) {
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
