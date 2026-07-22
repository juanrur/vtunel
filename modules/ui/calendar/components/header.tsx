'use client'
import ChangeWeekButton from '@ui/calendar/components/change-view-date-button'
import { useViewStore } from '@ui/calendar/store'
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
      <div className='flex items-center gap-2'>
        <ViewSettings />
        <ChangeView />
      </div>
    </header>
  )
}
