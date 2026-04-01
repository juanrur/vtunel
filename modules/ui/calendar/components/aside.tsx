'use client'
import { useEventsStore } from '@events/store'
import { useEffect, useState } from 'react'
import EventList from './event-list'
import '@/remove-scrollbar.module.css'
import { getWeekStartEndDates } from '@/utils'
import FilterButton from './filter-button'
import EventListSkeleton from './event-list-skeleton'
import { useViewStore } from '../store'

const FILTER = {
  ALL: 'all',
  TODAY: 'today',
  WEEK: 'week',
  MONTH: 'month'
} as const

export type Filter = typeof FILTER[keyof typeof FILTER]

export default function Aside () {
  const [filter, setFilter] = useState<Filter>(FILTER.ALL)

  const { viewDate } = useViewStore()
  const { events, getAllEvents, eventsAreLoading } = useEventsStore()

  useEffect(() => {
    getAllEvents()
  }, [getAllEvents])

  const eventsFiltered = events.filter((event) => {
    const eventDate = new Date(event.startTime)
    const { startOfWeek, endOfWeek } = getWeekStartEndDates(viewDate)

    if (filter === FILTER.ALL) return true
    if (filter === FILTER.TODAY) return eventDate.toDateString() === viewDate.toDateString()
    if (filter === FILTER.MONTH) return eventDate.getMonth() === viewDate.getMonth() && eventDate.getFullYear() === viewDate.getFullYear()
    if (filter === FILTER.WEEK) return eventDate >= startOfWeek && eventDate <= endOfWeek
    return false
  })

  const eventsFilteredSorted = eventsFiltered.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())

  return <aside className='h-full flex flex-col gap-6 p-6 pr-0 overflow-hidden size-100'>
    <div className='flex-1 min-h-0 overflow-auto space-y-6'>
      <div className='flex justify-around gap-2'>
        <FilterButton onClick={setFilter} filterState={filter} value={FILTER.ALL} />
        <FilterButton onClick={setFilter} filterState={filter} value={FILTER.TODAY} />
        <FilterButton onClick={setFilter} filterState={filter} value={FILTER.WEEK} />
      </div>

      { !eventsAreLoading
        ? <EventList events={eventsFilteredSorted}/>
        : <EventListSkeleton />
      }
    </div>

  </aside>
}
