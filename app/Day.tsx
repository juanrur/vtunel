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


  return <ul>
    {dayEvents.map(({ startTime, endTime, name, id }) => {
     const time = startTime - endTime
      return <li key={id} className='bg-blue-400 ' style={{ height:  }}>
        <button>
          {name}
        </button>
      </li>
    })}
  </ul>
}
