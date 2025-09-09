'use client'
import Event from '@/components/event'
import { useEventsStore } from '@/store'
import { type Day as DayType } from '@/types'

export default function Day ({ events, dayIndex }: { events: DayType, dayIndex: number }) {
  const { week, changeEventStartTime, pixelsPerMinute, minutesPerDivided } = useEventsStore()

  const handleDrop = (event: any) => {
    event.target = event.target.closest('li')
    event.preventDefault()
    const eventID = event.dataTransfer.getData('text/plain')

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

    const [hour, minutes] = getHours(minutesPerDivided)[event.target.dataset.index].split(':')
    // Here you have to take into account that the first day of the week is Monday,
    // should have some function to change between Monday and Sunday
    const deference = dayIndex - (week.getDay() === 0 ? 7 : week.getDay())
    const day = week.getDate() + deference + 1

    const newDate = new Date(Date.UTC(week.getFullYear(), week.getMonth(), day, Number(hour), Number(minutes)))
    newDate.setMinutes(newDate.getMinutes() + newDate.getTimezoneOffset())

    changeEventStartTime(newDate, eventID)
  }

  const handleDragOver = (event: any) => {
    event.preventDefault()
  }

  const handleDragLeave = (event: any) => {
    event.preventDefault()
  }

  return <ul className='border-r first:border-l border-primary'>
    {
      // make a list of 24 hours with 4 divisions each
      Array.from({ length: 24 * (60 / minutesPerDivided) }).map((_, idx) => {
        // find all events that start at this hour
        const matchingEvents = events.filter(({ startTime }) =>
          idx === (startTime.getHours() * (60 / minutesPerDivided)) + Math.floor(startTime.getMinutes() / 60 * (60 / minutesPerDivided))
        )

        const sortedMatchingEvents = matchingEvents.sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
        return <li
          data-index={idx}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className='border-b first:border-t border-primary'
          style={{ height: pixelsPerMinute * minutesPerDivided }}
          key={idx}>

          {sortedMatchingEvents?.map((event, idx) => (
            <div key={event.id} style={{ marginLeft: idx * 30 + 'px', zIndex: idx, width: idx > 0 ? '60%' : '' }} className='relative'>
              <Event
                name={event.name}
                id={event.id}
                height={pixelsPerMinute * ((event.endTime.getTime() - event.startTime.getTime()) / 1000 / 60)}
                margin={pixelsPerMinute * (event.startTime.getMinutes() % minutesPerDivided)}
                startTime={event.startTime}
                endTime={event.endTime}
              />
            </div>
          ))}
        </li>
      })
    }
    <li
  className='border-b border-primary'
  style={{ height: pixelsPerMinute * minutesPerDivided + 4 }}
/>
  </ul>
}
