'use client'
import Week from '@/components/week'
import Day from './day'
import { useEventsStore } from '@/store'
import HoursCol from '@/components/hours-col'
import Month from './month'

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

  return <main className={`h-full max-md:w-[700px] max-md:overflow-x-auto grid ${view === Views.day ? 'grid-cols-[70px,1fr]' : ''}`}>
    {view !== 'month' &&
      <div>
        <h2 className='text-end px-4 h-[60px] grid pt-3'>Hours</h2>
        <HoursCol />
      </div>
    }
    {view === 'week' &&
      <Week events={events} />
    }
    {view === 'day' &&
      <div className='flex flex-col'>
        <header className='text-center h-[60px]'>
          <h2>{weekdays[day.getDay()]}</h2>
          <p>{day.getDate()}</p>
        </header>
        <Day events={events}></Day>
      </div>
    }
    {view === 'month' &&
      <Month />
    }

  </main>
}
