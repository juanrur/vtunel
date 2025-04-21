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
    <section className='flex-1 flex h-full'>
      <div className='relative grid place-content-center'>
        <h2 className='absolute top-0 left-0'>{week.toDateString()}</h2>

        <button
          className='border-white border-2 rounded-full size-fit p-2 self-center justify-self-center'
          onClick={decreaseWeek}
        >
          <Arrow />
        </button>

      </div>

      <section className='grid flex-1 pt-5'>
        <div className='text-center grid grid-cols-[70px,repeat(7,1fr)] pb-3'>
          <h2 className='text-end px-4'>Hours</h2>
          {weekdays.map((day, idx) =>
            <h2 key={idx}>{day}</h2>
          )}
        </div>

        <div className={`${RemoveScrollbar.remove} grid grid-cols-[70px,repeat(7,1fr)] overflow-auto`}>
          <HoursCol />
          {weekEvents.map((day, idx) =>
            <Day key={idx} dayIndex={idx} events={day} />
          )}
        </div>

      </section>

      <button
        className='border-white border-2 rounded-full size-fit p-2 self-center'
        onClick={increaseWeek}
      >
        <Arrow className='rotate-180'/>
      </button>
    </section>
  )
}
