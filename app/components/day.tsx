'use client'
import Event from '@/components/event'
import { useEventsStore } from '@/store'
import { type Day as DayType } from '@/types'

export default function Day ({ events, dayIndex }: { events: DayType, dayIndex: number }) {
  const { week, changeEventStartTime } = useEventsStore()
  const PXMinute = 4
  const MinutesPerDivided = 15

  const handleDrop = (event: any) => {
    event.target = event.target.closest('li')
    event.preventDefault()
    const eventID = event.dataTransfer.getData('text/plain')

    function getHours (splitPerMinutes: number) {
      const hours = []
      let currentHour = 0
      let currentMinutes = 0

      while (currentHour < 24) {
        hours[hours.length] = currentHour.toString().padStart(2, '0') + ':' + currentMinutes.toString().padStart(2, '0')
        if (currentMinutes + splitPerMinutes >= 60) {
          currentMinutes = currentMinutes + splitPerMinutes - 60
          currentHour++
        } else {
          currentMinutes += splitPerMinutes
        }
      }

      return hours
    }
    const [hour, minutes] = getHours(15)[event.target.dataset.index].split(':')
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

  return <ul className='border-r first:border-l border-black dark:border-white'>
    {
      // make a list of 24 hours with 4 divisions each
      Array.from({ length: 24 * 4 }).map((_, idx) => {
        // find all events that start at this hour
        const matchingEvents = events.filter(({ startTime }) =>
          idx === (startTime.getHours() * 4) + Math.floor(startTime.getMinutes() / 60 * 4)
        )

        const sortedMatchingEvents = matchingEvents.sort((a, b) => a.startTime.getTime() - b.startTime.getTime())

        return <li
          data-index={idx}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className='border-b first:border-t border-black dark:border-white'
          style={{ height: PXMinute * MinutesPerDivided }}
          key={idx}>

          {sortedMatchingEvents.map((event, idx) => (
            <div key={event.id} style={{ marginLeft: idx * 30 + 'px', zIndex: idx, width: idx > 0 ? '60%' : '' }} className='relative'>
              <Event
                name={event.name}
                id={event.id}
                height={PXMinute * ((event.endTime.getTime() - event.startTime.getTime()) / 1000 / 60)}
                margin={PXMinute * (event.startTime.getMinutes() % MinutesPerDivided)}
              />
            </div>
          ))}
        </li>
      })
    }
  </ul>
}
