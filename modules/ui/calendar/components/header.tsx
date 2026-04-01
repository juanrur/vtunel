'use client'
import AddEventButton from '@ui/shared/events/components/add-event-button'
import ChangeWeekButton from '@ui/calendar/components/change-view-date-button'
import { useViewStore } from '@ui/calendar/store'
import SingOutButton from '@ui/shared/auth/components/sing-out-button'
import ChangeView from './change-view'
import ViewSettings from './view-settings'

export default function Header () {
  const { increaseViewDate, decreaseViewDate, viewDate } = useViewStore()

  const month = viewDate.toLocaleString('default', { month: 'long' }).toUpperCase()
  const year = viewDate.getFullYear()

  return (
    <header className='flex items-center justify-between gap-2 p-2 pb-4'>
      <div className='space-x-2'>
        <ChangeWeekButton action={decreaseViewDate} />
        <ChangeWeekButton action={increaseViewDate} rotate />
      </div>
      <h1 className='font-semibold text-2xl'>{month + ' ' + year}</h1>
      <ViewSettings />
      <ChangeView />
      <div className='flex gap-3'>
        <AddEventButton />
        <SingOutButton />
      </div>
    </header>
  )
}
