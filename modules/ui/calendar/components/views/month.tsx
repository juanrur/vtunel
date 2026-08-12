'use client'
import { useViewStore } from '../../store'
import { type Event as EventType } from '@events/types'
import { useTemplatesStore } from 'modules/templates/store'
import { useEventsStore } from '@events/store'
import { updateDroppedItem } from '@ui/calendar/utils'
import { useTasksStore } from '@tasks/store'

export default function Month ({ events }: {events: EventType[]}) {
  const { viewDate } = useViewStore()
  const { templates } = useTemplatesStore()
  const { insertEvent, changeEventStartTime } = useEventsStore()
  const { changeTaskStartTime } = useTasksStore()

  const handleDrop = (event: any) => {
    event.target = event.target.closest('li')
    event.preventDefault()
    const data = event.dataTransfer.getData('text/plain')
    const [type, id] = data.split(':')
    const day = parseInt(event.target.dataset.day)
    const month = parseInt(event.target.dataset.month)
    const currentItem = events.find(event => event.id === id)

    const newStartTime = new Date(viewDate.getFullYear(), month, day, currentItem?.startTime.getHours() || 0, currentItem?.startTime.getMinutes() || 0, 0)

    updateDroppedItem({ type, id, newDate: newStartTime, template: templates.find(template => template.id === id) ?? undefined, changeEventStartTime, insertEvent, changeTaskStartTime })
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

  const dayNumbers = getDaysInMonthView(viewDate.getFullYear(), viewDate.getMonth())

  return <section className="h-full">
    <ul className="h-full grid grid-cols-7 grid-rows-5 p-1">
      {
        dayNumbers.map(({ day, month }, idx) => {
          const matchingItems = events.filter(({ startTime }) => startTime.getDate() === day && startTime.getMonth() === month && startTime.getFullYear() === viewDate.getFullYear())
          const maxVisible = 2
          const visibleItems = matchingItems.slice(0, maxVisible)
          const hiddenCount = matchingItems.length - maxVisible

          return (
            <li key={idx}
              className="border border-primary flex items-center justify-start pt-1 md:pt-2 pb-2 md:pb-4 overflow-hidden flex-col"
              onDrop={handleDrop}
              onDragOver={(event) => event.preventDefault()}
              onDragLeave={(event) => event.preventDefault()}
              data-day={day} data-month={month}
            >
              <h1 className='pb-1 text-xs md:text-base'>{day}</h1>
              <ul className='flex-1 w-full flex-grow-0 px-1 md:px-2 space-y-1 md:space-y-2'>
                {
                  visibleItems.map(({ id, name }) => <li draggable onDragStart={(event) => event.dataTransfer?.setData('text/plain', 'event:' + id)} key={id} className="text-[10px] md:text-xs bg-secondary border p-0.5 px-1 rounded truncate">
                      {name}
                    </li>
                  )
                }
                {hiddenCount > 0 && (
                  <li className="text-[10px] md:text-xs text-zinc-500">+{hiddenCount}</li>
                )}
              </ul>
            </li>
          )
        })
      }
    </ul>
  </section>
}
