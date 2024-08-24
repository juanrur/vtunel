'use client'
import Event from '@/components/event'
import { type Day as DayType } from '@/types'

export default function Day ({ events }: {events: DayType}) {
  const FifteenMinutePX = 50
  return <ul className='bg-blue-500 grid border size-full'>
      {
        Array.from({ length: 24 * 4 }).map((_, idx) => {
          const event = events.find(({ startTime }) => idx === (startTime.getHours() * 4) + Math.floor(startTime.getMinutes() / 60 * 4))
          const height = event?.endTime - event?.startTime
          return <li style={{ height: FifteenMinutePX }} key={idx}>
            {event && <Event name={event.name} height={height}/>}
          </li>
        }

        )
      }
    </ul>
}
