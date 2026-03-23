'use client'
import Week from '@/components/calendar/week/view'
import Day from './day/view'
import { useEventsStore } from '@/store'
import HoursCol from '@/components/calendar/hours-col'
import RemoveScrollbar from '@/remove-scrollbar.module.css'
import { useMemo } from 'react'
// import Month from '@/components/calendar/month/view'

const Views = {
  day: 'day',
  week: 'week',
  month: 'month'
} as const

export default function Calendar () {
  const { day, events, view } = useEventsStore()

  const weekdays = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ] as const

  const thisDayEvents = useMemo(
    () => events.filter(({ startTime }) => startTime.getDate() === day.getDate() && startTime.getMonth() === day.getMonth() && startTime.getFullYear() === day.getFullYear()),
    [events, day]
  )

  return <main className={`${RemoveScrollbar.remove} max-md:w-[700px] flex-1 min-h-0 overflow-auto max-md:overflow-x-auto grid ${view === Views.day || view === Views.week ? 'grid-cols-[70px,1fr]' : ''}`}>
    {view !== Views.month &&
      <div>
        <h2 className='text-end px-4 h-[60px] grid pt-3'>Hours</h2>
        <HoursCol />
      </div>
    }
    {view === Views.week &&
      <Week events={events} />
    }
    {view === Views.day &&
      <div className='flex flex-col'>
        <header className='text-center h-[60px]'>
          <h2>{weekdays[day.getDay()]}</h2>
          <p>{day.getDate()}</p>
        </header>
        <Day events={thisDayEvents}></Day>
      </div>
    }
    {/* {view === 'month' &&
      <Month events={events}/>
    } */}
  </main>
}
