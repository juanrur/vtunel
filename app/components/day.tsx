import Event from '@/components/event'
import { events } from '@/db/client'

export default function Day () {
  return <ul className='w-56 flex flex-col'>
    {events.map(({ startTime, endTime, name, id }) => {
      const milliseconds = endTime.getTime() - startTime.getTime()
      const minutes = milliseconds / 1000 / 60
      const height = minutes * 0.25
      return <Event key={id} height={height} name={name} ></Event>
    })}
  </ul>
}
