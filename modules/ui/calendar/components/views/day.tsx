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

export default function Day ({ items, dayIndex }: { items: (EventType | TaskType)[], dayIndex?: number }) {
  const { pixelsPerMinute, minutesPerDivision } = useSettingsStore()
  const { viewDate } = useViewStore()
  const { changeEventStartTime, insertEvent } = useEventsStore()
  const { templates } = useTemplatesStore()
  const { changeTaskStartTime } = useTasksStore()

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
        const matchingItems = items.filter(({ startTime }) =>
          idx === (startTime.getHours() * (60 / minutesPerDivision)) + Math.floor(startTime.getMinutes() / 60 * (60 / minutesPerDivision))
        )

        // sort events by start time and then by duration
        const sortedMatchingItems = matchingItems.sort((a, b) => {
          const startDiff = a.startTime.getTime() - b.startTime.getTime()
          if (startDiff !== 0) return startDiff

          const durationA = a.endTime.getTime() - a.startTime.getTime()
          const durationB = b.endTime.getTime() - b.startTime.getTime()

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

          {sortedMatchingItems?.map((item, idx) => {
            const isATask = 'done' in item
            return (
              <div key={item.id} style={{ marginLeft: idx * 60 + 'px', zIndex: idx, width: idx > 0 ? '60%' : '' }} className='relative'>
                {
                  isATask &&
                  <Task
                  task={item}
                  height={pixelsPerMinute * ((item.endTime.getTime() - item.startTime.getTime()) / 1000 / 60)}
                  margin={pixelsPerMinute * (item.startTime.getMinutes() % minutesPerDivision)} />
                }
                {
                  !isATask &&
                  <Event
                    name={item.name}
                    id={item.id}
                    height={pixelsPerMinute * ((item.endTime.getTime() - item.startTime.getTime()) / 1000 / 60)}
                    margin={pixelsPerMinute * (item.startTime.getMinutes() % minutesPerDivision)}
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
