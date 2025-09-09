'use client'
import Day from '@/components/day'
import { useEventsStore } from '@/store'
import { type Week as WeekType } from '@/types'
import RemoveScrollbar from '@/remove-scrollbar.module.css'
import HoursCol from './hours-col'
import { getWeekStartEndDates } from '@/utils'
import { useEffect } from 'react'

export default function Week () {
  const {
    events,
    week,
    token,
    getAllEvents
  } = useEventsStore()

  useEffect(() => { if (token) getAllEvents(token) }, [getAllEvents, token])

  const { startOfWeek, endOfWeek } = getWeekStartEndDates(week)

  const weekEvents : WeekType = Array.from({ length: 7 }, () => [])

  events.filter((event) => {
    const eventDate = new Date(event.startTime)
    return eventDate >= startOfWeek && eventDate <= endOfWeek
  }).forEach((event) => {
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
    <article className='h-full flex flex-col'>
      <div className='text-center grid grid-cols-[70px,repeat(7,1fr)] pb-3 flex-shrink-0'>
        <h2 className='text-end px-4'>Hours</h2>
        {
          weekdays.map((day, idx) => {
            const today = new Date()
            if (weekDayNumbers[idx] === today.getDate() && week.getMonth() === today.getMonth() && week.getFullYear() === today.getFullYear()) {
              return (
              <div className='rounded-full bg-secondary flex flex-col mx-auto px-4' key={idx}>
                <h2>{weekDayNumbers[idx]}</h2>
                <p>{day}</p>
              </div>
              )
            }
            return (
              <div key={idx}>
                <h2>{weekDayNumbers[idx]}</h2>
                <p>{day}</p>
              </div>
            )
          })
        }
      </div>

      <div className={`${RemoveScrollbar.remove} grid grid-cols-[70px,repeat(7,1fr)] overflow-auto flex-1 min-h-0`}>
        <HoursCol />
        {weekEvents.map((day, idx) =>
          <Day key={idx} dayIndex={idx} events={day} />
        )}
      </div>
    </article>
  )
}
