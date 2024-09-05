'use client'
import Day from '@/components/day'
import { useEventsStore } from '@/store'
import { Week as WeekType } from '@/types'
import { useEffect } from 'react'
import RemoveScrollbar from '@/remove-scrollbar.module.css'
import Arrow from '@icons/arrow'
import HoursCol from './hours-col'

export default function Week () {
  const {
    currentWeekEvents,
    week,
    decreaseWeek,
    increaseWeek,
    getWeeklyEvents
  } = useEventsStore()

  useEffect(() => { getWeeklyEvents(week) }, [week, getWeeklyEvents])

  const weekEvents : WeekType = Array.from({ length: 7 }, () => [])
  currentWeekEvents.forEach((event) => {
    const day = (event.startTime.getDay() || 7) - 1
    weekEvents[day].push(event)
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
          onClick={decreaseWeek}
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
                <Day key={idx} dayIndex={idx} events={day} />
              )}
            </div>

          </div>

        <button
          className='border-white border-2 rounded-full size-fit p-2 self-center'
          onClick={increaseWeek}
        >
          <Arrow className='rotate-180'/>
        </button>
      </article>
    </section>
  )
}
