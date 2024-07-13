import Event from '@/components/event'
import { getEvents } from '@/db/client'

export default async function Day () {
  const events = await getEvents()
  return <ul className='w-56 flex flex-col'>
    {events.map(({ startTime, endTime, name, id }) => {
      const milliseconds = endTime.getTime() - startTime.getTime()
      const minutes = milliseconds / 1000 / 60
      const height = minutes * 0.25
      return <Event key={id} height={height} name={name} ></Event>
    })}
  </ul>
}
