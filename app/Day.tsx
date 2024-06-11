import { useId } from 'react'
import type { Day as DayType } from '../types/EventTypes'

export default function Day () {
  const dayEvents : DayType = [
    {
      startTime: new Date(),
      endTime: new Date(Date.now() + 15 * 60 * 1000),
      name: 'ejemplo',
      id: useId()
    }
  ]

  console.log()
  return <ul>
    {dayEvents.map(({ startTime, endTime, name, id }) => (
      <li key={id}>

      </li>
    ))}
  </ul>
}
