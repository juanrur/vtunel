'use client'
import Link from 'next/link'
import { useState } from 'react'
import NavLink from './nav-link'
import AddButton from '@ui/shared/components/add/add-button'
import SingOutButton from '@ui/shared/components/auth/sing-out-button'
import CalendarIcon from '@icons/calendar'
import ScheduleIcon from '@icons/schedule'
import TasksIcon from '@icons/tasks'
import ChevronIcon from '@icons/chevron'

export default function Nav () {
  const [expanded, setExpanded] = useState(false)

  return (
    <nav className={`flex items-center justify-between px-3 py-2 border-b bg-primary shrink-0 md:h-full md:flex-col md:items-stretch md:border-r md:border-b-0 md:transition-[width] md:duration-200 ${expanded ? 'md:w-60' : 'md:w-16'}`}>
      <div className='flex items-center gap-2 md:flex-col md:items-stretch'>
      <Link
        href='/'
        className='flex h-10 items-center justify-center rounded-lg text-xl font-bold tracking-tight hover:bg-secondary transition-colors'
        aria-label='Vtunel home'
      >
        {expanded ? 'Vtunel' : 'V'}
      </Link>
      <button
        type='button'
        onClick={() => setExpanded(!expanded)}
        className='hidden h-10 items-center justify-center rounded-lg md:flex'
        aria-label={expanded ? 'Collapse navigation' : 'Expand navigation'}
        title={expanded ? 'Collapse navigation' : 'Expand navigation'}
      >
        <ChevronIcon className={`transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </button>
      </div>
      <div className='flex items-center gap-1 md:flex-col md:items-stretch md:gap-2 md:mt-4'>
        <NavLink href='/' expanded={expanded} icon={<CalendarIcon />}>Calendar</NavLink>
        <NavLink href='/schedule' expanded={expanded} icon={<ScheduleIcon />}>Schedule</NavLink>
        <NavLink href='/tasks' expanded={expanded} icon={<TasksIcon />}>Tasks</NavLink>
      </div>
      <div className='flex items-center gap-3 md:mt-auto md:flex-col md:items-stretch'>
        <AddButton expanded={expanded} />
        <SingOutButton expanded={expanded} />
      </div>
    </nav>
  )
}
