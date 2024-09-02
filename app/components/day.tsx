'use client'
import Event from '@/components/event'
import { type Day as DayType } from '@/types'

export default function Day ({ events }: {events: DayType}) {
  const PXMinute = 4
  const MinutesPerDivided = 15

  const handleDrop = (event) => {
    event.preventDefault()
    const eventID = event.dataTransfer.getData('text/plain')
    event.target.innerHTML 
  }

  const handleDragOver = (event) => {
    event.preventDefault()
  }

  const handleDragLeave = (event) => {
    event.preventDefault()
  }

  return <ul className='bg-blue-500 border'>
      {
        Array.from({ length: 24 * 4 }).map((_, idx) => {
          const event = events.find(({ startTime }) => idx === (startTime.getHours() * 4) + Math.floor(startTime.getMinutes() / 60 * 4))
          let height, margin
          if (event) {
            height = (event?.endTime.getTime() - event?.startTime.getTime()) / 1000 / 60
            margin = event?.startTime.getMinutes() % MinutesPerDivided
          }

          return <li onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave} className='border border-black bg-orange-500' style={{ height: PXMinute * MinutesPerDivided }} key={idx}>

            {event && <Event name={event.name} id={event.id} height={PXMinute * height!} margin={PXMinute * margin!}/>}
          </li>
        }

        )
      }
    </ul>
}
