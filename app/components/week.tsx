'use client'
import Day from '@/components/day'
import { getEventsWeek } from '@/db/client'
import { Week as WeekType, Event } from '@/types'
import { useEffect, useState } from 'react'
import RemoveScrollbar from '@/remove-scrollbar.module.css'
import Arrow from '@icons/arrow'
import HoursCol from './hours-col'

export default function Week () {
  const [week, setWeek] = useState(new Date())
  const [events, setEvents] = useState<Event[]>([])

  useEffect(() => {
    

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
    <section className='flex-1'>
      <h2>{week.toDateString()}</h2>
      <article className='flex h-full'>
        <button
          className='border-white border-2 rounded-full size-fit p-2 self-center'
          onClick={() => handleWeekChange(-1)}
        >
          <Arrow />
        </button>

          <div className='grid flex-1'>
            <header className='grid text-center grid-cols-8'>
              <h2>hours</h2>
              {weekdays.map((day, idx) =>
                <h2 key={idx}>{day}</h2>
              )}
            </header>

            <div className={`${RemoveScrollbar.remove} grid grid-cols-8 overflow-auto`}>
              <HoursCol />

              {weekEvents.map((day, idx) =>
                <Day key={idx} events={day} />
              )}
            </div>

          </div>

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
