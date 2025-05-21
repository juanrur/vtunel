'use client'
import { useEventsStore } from '@/store'
import AddEventButton from './add-event-button'
import AuthButton from './auth-button'
import { useEffect, useState } from 'react'
import EventList from './event-list'
import '@/remove-scrollbar.module.css'

const FILTER = {
  ALL: 'all',
  TODAY: 'today',
  WEEK: 'week',
  MONTH: 'month'
} as const

type Filter = typeof FILTER[keyof typeof FILTER]

export default function Aside () {
  const [filter, setFilter] = useState<Filter>(FILTER.ALL)

  const { currentWeekEvents, allEvents, getAllEvents } = useEventsStore()

  useEffect(() => {
    getAllEvents()
  }
  , [getAllEvents])

  const events = filter === FILTER.ALL ? allEvents : currentWeekEvents

  return <aside className='flex flex-col gap-10 p-6 pr-0 h-full overflow-auto'>
    <div className='flex justify-around items-center'>
      <AddEventButton />
      <AuthButton />
    </div>

    <div className='flex justify-around gap-2'>
      <FilterButton onClick={setFilter} filterState={filter} value={FILTER.ALL} />
      <FilterButton onClick={setFilter} filterState={filter} value={FILTER.WEEK} />
    </div>

    <EventList events={events}/>

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
