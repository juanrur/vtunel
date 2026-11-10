'use client'
import Week from '@ui/calendar/components/views/week'
import Day from '@ui/calendar/components/views/day'
import { useEventsStore } from '@events/store'
import HoursCol from '@ui/calendar/components/hours-col'
import RemoveScrollbar from '@/remove-scrollbar.module.css'
import { useMemo } from 'react'
import { useViewStore } from '../store'
import Month from './views/month'
import { useTasksStore } from '@tasks/store'
import AllDay from '@ui/calendar/components/all-day'
import { occursOnDay } from '@shared/utils'

const Views = {
  day: 'day',
  week: 'week',
  month: 'month'
} as const

export default function Calendar () {
  const { viewDate, view } = useViewStore()
  const { events } = useEventsStore()
  const { tasks } = useTasksStore()

  const weekdays = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ] as const

  // occursOnDay instead of comparing the start day, so items of several days also show on the days after the first one
  const thisDayEvents = useMemo(
    () => [
      ...events.filter(event => occursOnDay(event, viewDate)),
      ...tasks.filter(task => occursOnDay(task, viewDate))
    ],
    [events, tasks, viewDate]
  )

  return <main className={`${RemoveScrollbar.remove} max-md:w-[700px] flex-1 min-h-0 overflow-auto max-md:overflow-x-auto grid ${view === Views.day || view === Views.week ? 'grid-cols-[70px,1fr]' : ''}`}>
    {view !== Views.month &&
      <div>
        <h2 className='text-end px-4 h-[60px] grid pt-3'>Hours</h2>
        {/* Same height as the "All day" band (all-day.tsx) so the hours stay aligned with the grid */}
        <p className='text-end px-4 h-[52px] text-xs text-zinc-500 border-b border-primary pt-1'>All day</p>
        <HoursCol />
      </div>
    }
    {view === Views.week &&
      <Week items={[...events, ...tasks]} />
    }
    {view === Views.day &&
      <div className='flex flex-col'>
        <header className='text-center h-[60px]'>
          <h2>{weekdays[viewDate.getDay()]}</h2>
          <p>{viewDate.getDate()}</p>
        </header>
        <AllDay days={[viewDate]} items={thisDayEvents} />
        <Day items={thisDayEvents} date={viewDate}></Day>
      </div>
    }
    {view === 'month' &&
      <Month events={events}/>
    }
  </main>
}
