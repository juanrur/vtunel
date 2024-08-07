'use client'
import Event from '@/components/event'
import { type Day as DayType } from '@/types/event-types'

export default function Day ({ events }: {events: DayType}) {
  return <ul className='flex flex-col'>
      {events.map(({ startTime, endTime, name, id }) => {
        const milliseconds = endTime.getTime() - startTime.getTime()
        const minutes = milliseconds / 1000 / 60
        const height = minutes * 0.25
        return <Event key={id} height={height} name={name} ></Event>
      })}
    </ul>
}
