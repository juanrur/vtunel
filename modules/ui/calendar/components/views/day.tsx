'use client'
import Event from '@ui/calendar/components/event'
import { useEventsStore } from '@events/store'
import { useSettingsStore } from '@ui/calendar/settings/store'
import type { Day as DayType } from '@ui/calendar/types'
import { useViewStore } from '../../store'
import { useTemplatesStore } from 'modules/templates/store'

export default function Day ({ events, dayIndex }: { events: DayType, dayIndex?: number }) {
  const { pixelsPerMinute, minutesPerDivision } = useSettingsStore()
  const { viewDate } = useViewStore()
  const { changeEventStartTime, insertEvent } = useEventsStore()
  const { templates } = useTemplatesStore()

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

    if (type === 'event') {
      changeEventStartTime(newDate, id)
    }

    if (type === 'template') {
      const template = templates.find(template => template.id === id)
      if (!template) return
      insertEvent({
        name: template.title,
        startTime: newDate,
        endTime: new Date(newDate.getTime() + template.duration * 60 * 1000),
        recurrenceType: null,
        recurrenceInterval: null,
        recurrenceDays: null,
        recurrenceEnd: null,
        exceptionDates: null
      })
    }
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
        const matchingEvents = events.filter(({ startTime }) =>
          idx === (startTime.getHours() * (60 / minutesPerDivision)) + Math.floor(startTime.getMinutes() / 60 * (60 / minutesPerDivision))
        )

        const sortedMatchingEvents = matchingEvents.sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
        return <li
          data-index={idx}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className='border-b first:border-t border-primary'
          style={{ height: pixelsPerMinute * minutesPerDivision }}
          key={idx}>

          {sortedMatchingEvents?.map((event, idx) => (
            <div key={event.id} style={{ marginLeft: idx * 30 + 'px', zIndex: idx, width: idx > 0 ? '60%' : '' }} className='relative'>
              <Event
                name={event.name}
                id={event.id}
                height={pixelsPerMinute * ((event.endTime.getTime() - event.startTime.getTime()) / 1000 / 60)}
                margin={pixelsPerMinute * (event.startTime.getMinutes() % minutesPerDivision)}
                startTime={event.startTime}
                endTime={event.endTime}
              />
            </div>
          ))}
        </li>
      })
    }
  </ul>
}
