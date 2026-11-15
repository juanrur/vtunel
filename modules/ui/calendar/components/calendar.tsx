'use client'
import Week from '@ui/calendar/components/views/week'
import Day from '@ui/calendar/components/views/day'
import { useEventsStore } from '@events/store'
import HoursCol from '@ui/calendar/components/hours-col'
import RemoveScrollbar from '@/remove-scrollbar.module.css'
import { useEffect, useMemo } from 'react'
import { useViewStore } from '../store'
import Month from './views/month'
import { useTasksStore } from '@tasks/store'
import AllDay from '@ui/calendar/components/all-day'
import { occursOnDay } from '@shared/utils'
import { useRoutinesStore } from '@routines/store'
import { getRoutineOccurrences } from '@routines/utils'
import { getWeekStartEndDates } from '@/utils'

const Views = {
  day: 'day',
  week: 'week',
  month: 'month'
} as const

export default function Calendar () {
  const { viewDate, view, setView } = useViewStore()
  const { events } = useEventsStore()
  const { tasks } = useTasksStore()
  const { routines, getAllRoutines } = useRoutinesStore()

  useEffect(() => {
    getAllRoutines()
  }, [getAllRoutines])

  // The week and month views don't fit on a phone, so it starts on the day view
  useEffect(() => {
    if (window.innerWidth < 768) setView('day')
  }, [setView])

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

  // Routines are stored once, so their occurrences are built for the days on screen
  const routineOccurrences = useMemo(() => {
    if (view === Views.week) {
      const { startOfWeek, endOfWeek } = getWeekStartEndDates(viewDate)
      return getRoutineOccurrences(routines, startOfWeek, endOfWeek)
    }
    return getRoutineOccurrences(routines, viewDate, viewDate).filter(occurrence => occursOnDay(occurrence, viewDate))
  }, [routines, view, viewDate])

  return <main className={`${RemoveScrollbar.remove} flex-1 min-h-0 overflow-auto grid ${view === Views.day || view === Views.week ? 'grid-cols-[50px,1fr] md:grid-cols-[70px,1fr]' : ''} max-md:pb-24`}>
    {view !== Views.month &&
      <div>
        <h2 className='text-end px-4 h-[60px] grid pt-3 max-md:text-center max-md:px-0 max-md:text-xs'>Hours</h2>
        {/* Same height as the "All day" band (all-day.tsx) so the hours stay aligned with the grid */}
        <p className='text-end px-4 h-[52px] text-xs text-zinc-500 pt-1 max-md:text-center max-md:px-0 max-md:text-[10px]'>All day</p>
        <HoursCol />
      </div>
    }
    {view === Views.week &&
      <Week items={[...events, ...tasks]} routineOccurrences={routineOccurrences} />
    }
    {view === Views.day &&
      <div className='flex flex-col'>
        <header className='text-center h-[60px]'>
          <h2>{weekdays[viewDate.getDay()]}</h2>
          <p>{viewDate.getDate()}</p>
        </header>
        <AllDay days={[viewDate]} items={thisDayEvents} />
        <Day items={[...thisDayEvents, ...routineOccurrences]} date={viewDate}></Day>
      </div>
    }
    {view === 'month' &&
      <Month events={events}/>
    }
  </main>
}
