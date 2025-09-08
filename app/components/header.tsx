'use client'
import AddEventButton from './add-event-button'
import ChangeWeekButton from './change-week-button'
import { useEventsStore } from '@/store'
import SingOutButton from './sing-out-button'

export default function Header () {
  const { decreaseWeek, increaseWeek, week } = useEventsStore()

  const month = week.toLocaleString('default', { month: 'long' }).toUpperCase()
  const year = week.getFullYear()

  return (
    <header className='flex items-center justify-between gap-2 p-2 pb-4'>
      <div className='space-x-2'>
        <ChangeWeekButton action={decreaseWeek} />
        <ChangeWeekButton action={increaseWeek} rotate />
      </div>
      <h1 className='font-semibold text-2xl'>{month + ' ' + year}</h1>
      <div className='flex gap-3'>
        <AddEventButton />
        <SingOutButton />
      </div>
    </header>
  )
}
