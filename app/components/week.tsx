'use client'
import Day from '@components/day'
import { getEventsWeek } from '@/db/client'
import { Week as WeekType, Event } from '@/types/event-types'
import { useEffect, useState } from 'react'
import Arrow from '@icons/arrow'

export default function Week () {
  const [week, setWeek] = useState(new Date())
  const [events, setEvents] = useState<Event[]>([])

  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    async function fetchEvents () {
      try {
        const eventsResponse = await getEventsWeek(week)
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
    <section>
      <h2>{week.toDateString()}</h2>
      <article className='flex justify-between h-96'>
        <button
          className='border-white border-2 rounded-full size-fit p-2 self-center'
          onClick={() => handleWeekChange(-1)}
        >
          <Arrow />
        </button>

        {isClient &&
          <article className='grid-cols-7 grid grid-rows-2'>
            <div>
              {weekdays.map((day, idx) => <th key={idx}>{day}</th>)}
            </div>
            <div className='h-10'>
                {weekEvents.map((day, idx) =>
                  <div className='overflow-hidden' key={idx}>
                    <Day events={day} />
                  </div>
                )}
            </div>
          </article>
        }

        <button
          className='border-white border-2 rounded-full size-fit p-2 self-center'
          onClick={() => handleWeekChange(1)}
        >
          <Arrow className='rotate-180'/>
        </button>
      </article>
    </section>
  )
}
