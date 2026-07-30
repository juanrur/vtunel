'use client'

import { useEffect, useMemo } from 'react'
import { useEventsStore } from '@events/store'
import { useTasksStore } from '@tasks/store'
import { useScheduleStore } from '../store'
import Day from './day'

export default function Days () {
  const { selectedDate, daysCount } = useScheduleStore()
  const { events, getAllEvents } = useEventsStore()
  const { tasks, getAllTasks } = useTasksStore()

  const days = useMemo(() => {
    const baseDate = new Date(selectedDate)
    return Array.from({ length: daysCount }, (_, index) => {
      const date = new Date(baseDate)
      date.setDate(baseDate.getDate() + index)
      return date
    })
  }, [selectedDate, daysCount])

  useEffect(() => {
    getAllEvents()
    getAllTasks()
  }, [getAllEvents, getAllTasks])

  return (
    <main className='flex-1 min-h-0 flex overflow-x-auto overflow-y-hidden'>
      {days.map(date => (
        <Day key={date.toISOString()} date={date} items={[...events, ...tasks]} />
      ))}
    </main>
  )
}
