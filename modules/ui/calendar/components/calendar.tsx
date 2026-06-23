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

  const thisDayEvents = useMemo(
    () => [
      ...events.filter(({ startTime }) => startTime.getDate() === viewDate.getDate() && startTime.getMonth() === viewDate.getMonth() && startTime.getFullYear() === viewDate.getFullYear()),
      ...tasks.filter(({ startTime }) => startTime !== null && startTime.getDate() === viewDate.getDate() && startTime.getMonth() === viewDate.getMonth() && startTime.getFullYear() === viewDate.getFullYear())
    ],
    [events, tasks, viewDate]
  )

  return <main className={`${RemoveScrollbar.remove} max-md:w-[700px] flex-1 min-h-0 overflow-auto max-md:overflow-x-auto grid ${view === Views.day || view === Views.week ? 'grid-cols-[70px,1fr]' : ''}`}>
    {view !== Views.month &&
      <div>
        <h2 className='text-end px-4 h-[60px] grid pt-3'>Hours</h2>
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
        <Day items={thisDayEvents}></Day>
      </div>
    }
    {view === 'month' &&
      <Month events={events}/>
    }
  </main>
}
