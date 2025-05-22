'use client'
import { useEventsStore } from '@/store'
import AddEventButton from './add-event-button'
import AuthButton from './auth-button'
import { useEffect, useState } from 'react'
import EventList from './event-list'
import '@/remove-scrollbar.module.css'
import { getWeekStartEndDates } from '@/utils'

const FILTER = {
  ALL: 'all',
  TODAY: 'today',
  WEEK: 'week',
  MONTH: 'month'
} as const

type Filter = typeof FILTER[keyof typeof FILTER]

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

  return <aside className='flex flex-col gap-10 p-6 pr-0 h-full overflow-auto'>
    <div className='flex justify-around items-center'>
      <AddEventButton />
      <AuthButton />
    </div>

    <div className='flex justify-around gap-2'>
      <FilterButton onClick={setFilter} filterState={filter} value={FILTER.ALL} />
      <FilterButton onClick={setFilter} filterState={filter} value={FILTER.TODAY} />
      <FilterButton onClick={setFilter} filterState={filter} value={FILTER.WEEK} />
    </div>

    <EventList events={eventsFiltered}/>

  </aside>
}

function FilterButton ({ value, filterState, onClick }: { value: Filter, filterState: Filter, onClick: (value: Filter) => void }) {
  const isActive = value === filterState

  return (
    <button
      className='text-center items-center rounded px-2'
      style={isActive ? { backgroundColor: 'white', color: 'black' } : {}}
      onClick={() => onClick(value)}
    >
      {value}
    </button>
  )
}
