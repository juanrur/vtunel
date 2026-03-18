'use client'
import AddEventButton from './add-event-button'
import ChangeWeekButton from './change-view-date-button'
import { useEventsStore } from '@/store'
import SingOutButton from './sing-out-button'
import ChangeView from './change-view'

export default function Header () {
  const { decreaseView, increaseView, day } = useEventsStore()

  const month = day.toLocaleString('default', { month: 'long' }).toUpperCase()
  const year = day.getFullYear()

  return (
    <header className='flex items-center justify-between gap-2 p-2 pb-4'>
      <div className='space-x-2'>
        <ChangeWeekButton action={decreaseView} />
        <ChangeWeekButton action={increaseView} rotate />
      </div>
      <h1 className='font-semibold text-2xl'>{month + ' ' + year}</h1>
      <ChangeView />
      <div className='flex gap-3'>
        <AddEventButton />
        <SingOutButton />
      </div>
    </header>
  )
}
