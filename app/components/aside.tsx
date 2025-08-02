'use client'
import { useEventsStore } from '@/store'
import AddEventButton from './add-event-button'
import AuthButton from './auth-button'
import { useEffect, useState } from 'react'
import EventList from './event-list'
import '@/remove-scrollbar.module.css'
import { getWeekStartEndDates } from '@/utils'
import FilterButton from './filter-button'

const FILTER = {
  ALL: 'all',
  TODAY: 'today',
  WEEK: 'week',
  MONTH: 'month'
} as const

export type Filter = typeof FILTER[keyof typeof FILTER]

export default function Aside () {
  const [filter, setFilter] = useState<Filter>(FILTER.ALL)

  const { events, getAllEvents, token, week } = useEventsStore()

  useEffect(() => { if (token) getAllEvents(token) }, [getAllEvents, token])
  useEffect(() => {}, [filter])

  const eventsFiltered = events.filter((event) => {
    const eventDate = new Date(event.startTime)
    const { startOfWeek, endOfWeek } = getWeekStartEndDates(week)

    if (filter === FILTER.ALL) return true
    if (filter === FILTER.TODAY) return eventDate.toDateString() === week.toDateString()
    if (filter === FILTER.MONTH) return eventDate.getMonth() === week.getMonth() && eventDate.getFullYear() === week.getFullYear()
    if (filter === FILTER.WEEK) return eventDate >= startOfWeek && eventDate <= endOfWeek
    return false
  })

  return <aside className='h-full flex flex-col gap-6 p-6 pr-0 overflow-hidden'>
    <div className='flex-1 min-h-0 overflow-auto space-y-6'>
      <div className='flex justify-around gap-2'>
        <FilterButton onClick={setFilter} filterState={filter} value={FILTER.ALL} />
        <FilterButton onClick={setFilter} filterState={filter} value={FILTER.TODAY} />
        <FilterButton onClick={setFilter} filterState={filter} value={FILTER.WEEK} />
      </div>

      <EventList events={eventsFiltered}/>
    </div>

  </aside>
}
