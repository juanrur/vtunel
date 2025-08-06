'use client'
import AddEventButton from './add-event-button'
import AuthButton from './auth-button'
import ChangeWeekButton from './change-week-button'
import { useEventsStore } from '@/store'

export default function Header () {
  const { decreaseWeek, increaseWeek, week } = useEventsStore()

  const month = week.toLocaleString('default', { month: 'long' }).toUpperCase()
  const year = week.getFullYear()

  return (
    <header className='flex items-center justify-between gap-2 p-2'>
      <div className='space-x-2'>
        <ChangeWeekButton action={decreaseWeek} />
        <ChangeWeekButton action={increaseWeek} rotate />
      </div>
      <h1>{month + ' ' + year}</h1>
      <div className='flex gap-3'>
        <AddEventButton />
        <AuthButton />
      </div>
    </header>
  )
}
