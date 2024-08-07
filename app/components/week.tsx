'use client'
import Day from '@components/day'
import { getEventsWeek } from '@/db/client'
import { Week as WeekType, Event } from '@/types/event-types'
import { useEffect, useState } from 'react'
import Arrow from '@icons/arrow'

export default function Week () {
  const [week, setWeek] = useState(new Date())
  const [events, setEvents] = useState<Event[]>([])

  useEffect(() => {
    async function fetchEvents () {
      try {
        const eventsResponse = await getEventsWeek(week)
        console.log(eventsResponse)
        setEvents(eventsResponse)
      } catch (error) {
        throw new Error('error' + error)
      }
    }

    fetchEvents()
  }, [week])

  function handleWeekChange (number: 1 | -1) {
    setWeek((actualDate) => {
      const newDate = new Date(actualDate)
      newDate.setDate(actualDate.getDate() + 7 * number)
      return newDate
    })
  }

  const weekEvents : WeekType = Array.from({ length: 7 }, () => [])
  events.forEach((event) => {
    const day = event.startTime.getDay()
    if (day) weekEvents[day - 1].push(event)
  })

  const weekdays = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
  ] as const

  return (
    <section className='flex h-96'>
      <button
        className='border-white border-2 rounded-full size-fit p-2 self-center'
        onClick={() => handleWeekChange(-1)}
      >
        <Arrow />
      </button>
      <table className='w-full table-fixed'>
        <thead>
          <tr>
            {weekdays.map((day, idx) => <th key={idx}>{day}</th>)}
          </tr>
        </thead>
        <tbody className='align-top'>
          <tr>
            {weekEvents.map((day, idx) =>
              <td key={idx}>
                <Day events={day} />
              </td>
            )}
          </tr>
        </tbody>
      </table>
      <button
        className='border-white border-2 rounded-full size-fit p-2 self-center'
        onClick={() => handleWeekChange(1)}
      >
        <Arrow className='rotate-180'/>
      </button>
    </section>
  )
}
