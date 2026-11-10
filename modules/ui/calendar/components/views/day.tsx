'use client'
import Event from '@ui/calendar/components/event'
import { useEventsStore } from '@events/store'
import { useSettingsStore } from '@ui/calendar/settings/store'
import type { Event as EventType } from '@events/types'
import { useViewStore } from '../../store'
import { useTemplatesStore } from 'modules/templates/store'
import { updateDroppedItem } from '@ui/calendar/utils'
import { useTasksStore } from '@tasks/store'
import { Task as TaskType } from '@tasks/types'
import Task from '../task'
import { occursOnDay } from '@shared/utils'

// `date` is needed to know which part of an item of several days falls inside this day
export default function Day ({ items, dayIndex, date }: { items: (EventType | TaskType)[], dayIndex?: number, date: Date }) {
  const { pixelsPerMinute, minutesPerDivision } = useSettingsStore()
  const { viewDate } = useViewStore()
  const { events, changeEventStartTime, insertEvent, updateEvent } = useEventsStore()
  const { templates } = useTemplatesStore()
  const { tasks, changeTaskStartTime, updateTask } = useTasksStore()

  // Needed for items of several days: only the part inside this day is drawn,
  // e.g. 22:00 → 02:00 is drawn 22:00 → 00:00 on the first day and 00:00 → 02:00 on the second one.
  // All-day items are not drawn here, they go in the "All day" band above the hours
  const dayStart = new Date(date)
  dayStart.setHours(0, 0, 0, 0)
  const nextDayStart = new Date(dayStart)
  nextDayStart.setDate(nextDayStart.getDate() + 1)
  const segments = items
    .filter(item => !item.allDay && occursOnDay(item, date))
    .map(item => ({
      item,
      start: item.startTime! < dayStart ? dayStart : item.startTime!,
      end: item.endTime! > nextDayStart ? nextDayStart : item.endTime!
    }))

  const handleDrop = (event: any) => {
    event.target = event.target.closest('li')
    event.preventDefault()
    const data = event.dataTransfer.getData('text/plain')
    const [type, id] = data.split(':')

    function getHours (splitPerMinutes: number) {
      const hours = []
      let currentHour = 0
      let currentMinutes = 0

      while (currentHour < 24) {
        hours[hours.length] = currentHour + ':' + currentMinutes.toString().padStart(2, '0')

        if (currentMinutes + splitPerMinutes >= 60) {
          currentMinutes = currentMinutes + splitPerMinutes - 60
          currentHour++
        } else {
          currentMinutes += splitPerMinutes
        }
      }

      return hours
    }

    const [hour, minutes] = getHours(minutesPerDivision)[event.target.dataset.index].split(':')
    // Here you have to take into account that the first day of the week is Monday,
    // should have some function to change between Monday and Sunday
    let newDay
    if (dayIndex !== undefined) {
      const deference = dayIndex - (viewDate.getDay() === 0 ? 7 : viewDate.getDay())
      newDay = viewDate.getDate() + deference + 1
    } else newDay = viewDate.getDate()

    const newDate = new Date(Date.UTC(viewDate.getFullYear(), viewDate.getMonth(), newDay, Number(hour), Number(minutes)))
    newDate.setMinutes(newDate.getMinutes() + newDate.getTimezoneOffset())

    // Needed because moving an all-day item to an hour would keep it all-day but starting at that hour.
    // It becomes a normal 1h item instead
    const droppedAllDayItem = type === 'event'
      ? events.find(item => item.id === id && item.allDay)
      : type === 'task' ? tasks.find(item => item.id === id && item.allDay) : undefined
    if (droppedAllDayItem) {
      const newRange = { allDay: false, startTime: newDate, endTime: new Date(newDate.getTime() + 60 * 60 * 1000) }
      if (type === 'event') updateEvent(id, newRange)
      else updateTask(id, newRange)
      return
    }

    updateDroppedItem({
      type,
      id,
      newDate,
      changeEventStartTime,
      insertEvent,
      template: templates.find(template => template.id === id) ?? undefined,
      changeTaskStartTime
    })
  }

  const handleDragOver = (event: any) => {
    event.preventDefault()
  }

  const handleDragLeave = (event: any) => {
    event.preventDefault()
  }

  return <ul className='border-r first:border-l border-primary'>
    {
      // make a list of 24 hours with x divisions each
      Array.from({ length: 24 * (60 / minutesPerDivision) }).map((_, idx) => {
        // find all events that start at this hour
        const matchingItems = segments.filter(({ start }) => {
          return idx === (start.getHours() * (60 / minutesPerDivision)) + Math.floor(start.getMinutes() / 60 * (60 / minutesPerDivision))
        })

        // sort events by start time and then by duration
        const sortedMatchingItems = matchingItems.sort((a, b) => {
          const startDiff = a.start.getTime() - b.start.getTime()
          if (startDiff !== 0) return startDiff

          const durationA = a.end.getTime() - a.start.getTime()
          const durationB = b.end.getTime() - b.start.getTime()

          return durationB - durationA
        })

        return <li
          data-index={idx}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className='border-b first:border-t border-primary'
          style={{ height: pixelsPerMinute * minutesPerDivision }}
          key={idx}>

          {sortedMatchingItems.map(({ item, start, end }, idx) => {
            const isATask = 'done' in item
            if (!item.startTime || !item.endTime) return null
            return (
              <div key={item.id} style={{ marginLeft: idx * 60 + 'px', zIndex: idx, width: idx > 0 ? '60%' : '' }} className='relative'>
                {
                  isATask &&
                  <Task
                  task={item}
                  height={pixelsPerMinute * ((end.getTime() - start.getTime()) / 1000 / 60)}
                  margin={pixelsPerMinute * (start.getMinutes() % minutesPerDivision)} />
                }
                {
                  !isATask &&
                  <Event
                    name={item.name}
                    id={item.id}
                    height={pixelsPerMinute * ((end.getTime() - start.getTime()) / 1000 / 60)}
                    margin={pixelsPerMinute * (start.getMinutes() % minutesPerDivision)}
                    startTime={item.startTime}
                    endTime={item.endTime}
                  />
                }
                </div>
            )
          })}
        </li>
      })
    }
  </ul>
}
