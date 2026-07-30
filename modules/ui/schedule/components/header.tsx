'use client'

import Arrow from '@ui/shared/icons/arrow'
import Config from './config'
import { useScheduleStore } from '../store'

export default function Header () {
  const { goPrevDay, goNextDay, goToday } = useScheduleStore()

  return (
    <header className='flex items-center justify-between gap-4 p-4 border-b border-primary shrink-0'>
      <div className='flex items-center gap-2'>
        <button className='px-2 py-2 rounded' onClick={goPrevDay} aria-label='Previous day'>
          <Arrow />
        </button>
        <button className='px-3 py-1 rounded' onClick={goToday}>Today</button>
        <button className='px-2 py-2 rounded' onClick={goNextDay} aria-label='Next day'>
          <Arrow className='rotate-180' />
        </button>
      </div>
      <h1 className='text-xl font-semibold'>Schedule</h1>
      <Config />
    </header>
  )
}
