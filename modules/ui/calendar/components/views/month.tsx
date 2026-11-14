'use client'
import { useViewStore } from '../../store'
import { type Event as EventType } from '@events/types'
import { useTemplatesStore } from 'modules/templates/store'
import { useEventsStore } from '@events/store'
import { updateDroppedItem } from '@ui/calendar/utils'
import { useTasksStore } from '@tasks/store'
import { occursOnDay } from '@shared/utils'

export default function Month ({ events }: {events: EventType[]}) {
  const { viewDate } = useViewStore()
  const { templates } = useTemplatesStore()
  const { insertEvent, changeEventStartTime } = useEventsStore()
  const { changeTaskStartTime } = useTasksStore()

  const handleDrop = (event: any) => {
    // The cell under the pointer, found by position because the drop can land on a bar of several days,
    // which is on top of the cells and not inside them
    event.target = document.elementsFromPoint(event.clientX, event.clientY).find(element => element.matches('li[data-day]'))
    event.preventDefault()
    if (!event.target) return
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

  // Needed to draw events of several days as one continuous bar per week row instead of one box per day.
  // Each bar spans from the first to the last day it covers in that row and goes in the first free lane,
  // so bars don't overlap. Cells leave empty space on top for the lanes of their row
  const dates = dayNumbers.map(({ day, month }) => new Date(viewDate.getFullYear(), month, day))
  const isMultiDay = (event: EventType) =>
    event.endTime > event.startTime && event.startTime.toDateString() !== new Date(event.endTime.getTime() - 1).toDateString()
  const multiDayEvents = events.filter(isMultiDay).sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
  const rowLanes: number[] = []
  const bars = Array.from({ length: Math.ceil(dates.length / 7) }, (_, row) => {
    const rowDates = dates.slice(row * 7, row * 7 + 7)
    const laneEnds: number[] = []
    const rowBars = multiDayEvents.flatMap(event => {
      const first = rowDates.findIndex(date => occursOnDay(event, date))
      if (first === -1) return []
      const last = rowDates.findLastIndex(date => occursOnDay(event, date))
      let lane = laneEnds.findIndex(laneEnd => laneEnd < first)
      if (lane === -1) lane = laneEnds.length
      laneEnds[lane] = last
      return [{
        event,
        row,
        first,
        last,
        lane,
        // Rounded ends only where the event really starts / ends, not where it continues from or to another row
        startsHere: event.startTime >= rowDates[first],
        endsHere: !occursOnDay(event, new Date(rowDates[last].getFullYear(), rowDates[last].getMonth(), rowDates[last].getDate() + 1))
      }]
    })
    rowLanes[row] = laneEnds.length
    return rowBars
  }).flat()
  const LANE_HEIGHT = 26
  // Space taken by the day number on top of each cell (pt-2 + h1 + pb-1)
  const DAY_NUMBER_HEIGHT = 36

  return <section className="h-full">
    <ul className="h-full grid grid-cols-7 grid-rows-5 p-1">
      {
        dayNumbers.map(({ day, month }, idx) => {
          // occursOnDay instead of comparing the start day, so events of several days show on every day they cover
          const matchingItems = events.filter(event => !isMultiDay(event) && occursOnDay(event, new Date(viewDate.getFullYear(), month, day)))
          return (
            <li key={idx}
              // Explicit position so the bars, placed over the cells with the same grid, don't move them
              style={{ gridColumn: idx % 7 + 1, gridRow: Math.floor(idx / 7) + 1 }}
              className="border border-primary flex items-center justify-start pt-2 pb-4 overflow-hidden flex-col"
              onDrop={handleDrop}
              onDragOver={(event) => event.preventDefault()}
              onDragLeave={(event) => event.preventDefault()}
              data-day={day} data-month={month}
            >
              <h1 className='pb-1'>{day}</h1>
              <ul className='flex-1 w-full flex-grow-0 px-2 space-y-2' style={{ paddingTop: rowLanes[Math.floor(idx / 7)] * LANE_HEIGHT }}>
                {
                  matchingItems.map(({ id, name }) => <li draggable onDragStart={(event) => event.dataTransfer?.setData('text/plain', 'event:' + id)} key={id} className="text-xs bg-secondary border p-0.5 px-1 rounded">
                      {name}
                    </li>
                  )
                }
              </ul>
            </li>
          )
        })
      }
      {
        bars.map(({ event, row, first, last, lane, startsHere, endsHere }) => (
          <li
            key={event.id + ':' + row}
            draggable
            onDragStart={(dragEvent) => dragEvent.dataTransfer?.setData('text/plain', 'event:' + event.id)}
            onDrop={handleDrop}
            onDragOver={(dragEvent) => dragEvent.preventDefault()}
            className={`z-10 self-start h-[22px] text-xs bg-secondary border p-0.5 px-1 truncate ${startsHere ? 'ml-2 rounded-l' : ''} ${endsHere ? 'mr-2 rounded-r' : ''}`}
            style={{ gridColumn: `${first + 1} / ${last + 2}`, gridRow: row + 1, marginTop: DAY_NUMBER_HEIGHT + lane * LANE_HEIGHT }}
          >
            {event.name}
          </li>
        ))
      }
    </ul>
  </section>
}
