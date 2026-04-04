'use client'
import { useViewStore } from '../../store'
import { type Event as EventType } from '@events/domain/types'

export default function Month ({ events }: {events: EventType[]}) {
  const { viewDate } = useViewStore()

  // const handleDrop = (event: any) => {
  //   console.log('drop')
  //   event.target = event.target.closest('li')
  //   event.preventDefault()
  //   const eventID = event.dataTransfer.getData('text/plain')

  //   const draggedEvent = events.find(ev => ev.id === eventID)

  //   const newDay = Number(event.target.dataset.day)
  //   const newMonth = Number(event.target.dataset.month)

  //   const newStartTime = new Date(Date.UTC(day.getFullYear(), newMonth, newDay, draggedEvent?.startTime.getUTCHours(), draggedEvent?.startTime.getUTCMinutes()))

  //   changeEventStartTime(newStartTime, eventID)
  // }

  // const handleDragOver = (event: any) => {
  //   event.preventDefault()
  // }

  // const handleDragLeave = (event: any) => {
  //   event.preventDefault()
  // }

  // const actualMonth = day.getMonth()

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

  const dayNumbers = getDaysInMonthView(viewDate.getFullYear(), viewDate.getMonth())
  console.log({ events })

  return <section className="h-full">
    <ul className="h-full grid grid-cols-7 grid-rows-5 p-1">
      {
        dayNumbers.map(({ day }, idx) => {
          const matchingItems = events.filter(({ startTime }) => startTime.getDate() === day && startTime.getMonth() === viewDate.getMonth() && startTime.getFullYear() === viewDate.getFullYear())
          return (
            <li key={idx}
              className="border border-primary flex items-center justify-start py-4 flex-col"
            >
              {day}
              <ul className='flex-1 w-full bg-blue-500 flex-grow-0'>
                {
                  matchingItems.map(({ id, name }) => <li key={id} className="text-xs">
                      {name}
                    </li>
                  )
                }
              </ul>
            </li>
          )
        })
      }
    </ul>
  </section>
}
