'use client'
import { useState } from 'react'
import Week from '@/components/week'
import Day from './day'
import { useEventsStore } from '@/store'
import HoursCol from '@/components/hours-col'

export default function Calendar () {
  const [view, setView] = useState<'day' | 'week' | 'month'>('week')
  const { day, events } = useEventsStore()

  const weekdays = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ] as const

  return <main className='h-full max-md:w-[700px] max-md:overflow-x-auto grid grid-cols-[70px,1fr]'>
    <div>
      <h2 className='text-end px-4 h-[60px] grid pt-3'>Hours</h2>
      <HoursCol />
    </div>
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

  </main>
}
