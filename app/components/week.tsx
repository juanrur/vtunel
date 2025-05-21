'use client'
import Day from '@/components/day'
import { useEventsStore } from '@/store'
import { Week as WeekType } from '@/types'
import { useEffect } from 'react'
import RemoveScrollbar from '@/remove-scrollbar.module.css'
import HoursCol from './hours-col'
import ChangeWeekButton from './change-week-button'

export default function Week () {
  const {
    currentWeekEvents,
    week,
    token,
    decreaseWeek,
    increaseWeek,
    getWeeklyEvents
  } = useEventsStore()

  useEffect(() => { if (token) getWeeklyEvents(token, week) }, [week, getWeeklyEvents, token])

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

  function getWeekDays (dateInput: Date | string) {
    const date = new Date(dateInput)
    const day = date.getDay() // 0 (domingo) a 6 (sábado)

    // Ajustar para que el lunes sea el primer día
    const diffToMonday = (day === 0 ? -6 : 1) - day

    const monday = new Date(date)
    monday.setDate(date.getDate() + diffToMonday)

    const daysOfWeek = []
    for (let i = 0; i < 7; i++) {
      const current = new Date(monday)
      current.setDate(monday.getDate() + i)
      daysOfWeek.push(current.getDate())
    }

    return daysOfWeek
  }

  const weekDayNumbers = getWeekDays(week)

  return (
    <section className='flex h-full overflow-auto'>
      <ChangeWeekButton action={decreaseWeek} />

      <article className='grid flex-1 pt-5'>
        <div className='text-center grid grid-cols-[70px,repeat(7,1fr)] pb-3'>
          <h2 className='text-end px-4'>Hours</h2>
          {weekdays.map((day, idx) => <div key={idx}>
              <h2>{weekDayNumbers[idx]}</h2>
              <p>{day}</p>
            </div>
          )}
        </div>

        <div className={`${RemoveScrollbar.remove} grid grid-cols-[70px,repeat(7,1fr)] overflow-auto`}>
          <HoursCol />
          {weekEvents.map((day, idx) =>
            <Day key={idx} dayIndex={idx} events={day} />
          )}
        </div>

      </article>

      <ChangeWeekButton action={increaseWeek} rotate />
    </section>
  )
}
