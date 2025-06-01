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
    console.log(event.target)
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
    const deference = dayIndex - week.getDay()
    const day = week.getDate() + deference + 1

    console.log(deference, week.getDate())

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
          // find the event that starts at this hour
          const event = events.find(({ startTime }) => idx === (startTime.getHours() * 4) + Math.floor(startTime.getMinutes() / 60 * 4))
          let height, margin
          if (event) {
            height = (event?.endTime.getTime() - event?.startTime.getTime()) / 1000 / 60
            margin = event?.startTime.getMinutes() % MinutesPerDivided
          }

          return <li
            data-index={idx}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className='border-b first:border-t border-black dark:border-white'
            style={{ height: PXMinute * MinutesPerDivided }}
            key={idx}>

            {event && <Event name={event.name} id={event.id} height={PXMinute * height!} margin={PXMinute * margin!}/>}
          </li>
        }

        )
      }
    </ul>
}
