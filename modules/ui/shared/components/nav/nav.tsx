'use client'
import Link from 'next/link'
import { useState } from 'react'
import NavLink from './nav-link'
import Drawer from './drawer'
import AddButton from '@ui/shared/components/add/add-button'
import SingOutButton from '@ui/shared/components/auth/sing-out-button'
import CalendarIcon from '@icons/calendar'
import ScheduleIcon from '@icons/schedule'
import TasksIcon from '@icons/tasks'
import ChevronIcon from '@icons/chevron'

export default function Nav () {
  const [expanded, setExpanded] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const closeDrawer = () => setIsDrawerOpen(false)

  return (
    <>
    <nav className={`flex items-center justify-between px-3 py-2 border-b bg-primary shrink-0 md:h-full md:flex-col md:items-stretch md:border-r md:border-b-0 md:transition-[width] md:duration-200 ${expanded ? 'md:w-60' : 'md:w-16'}`}>
      <div className='flex items-center gap-2 md:flex-col md:items-stretch'>
      <Link
        href='/'
        className='flex h-10 items-center justify-center rounded-lg text-xl font-bold tracking-tight hover:bg-secondary transition-colors'
        aria-label='Vtunel home'
      >
        <span className='md:hidden'>Vtunel</span>
        <span className='max-md:hidden'>{expanded ? 'Vtunel' : 'V'}</span>
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
      <div className='max-md:hidden flex items-center gap-1 md:flex-col md:items-stretch md:gap-2 md:mt-4'>
        <NavLink href='/' expanded={expanded} icon={<CalendarIcon />}>Calendar</NavLink>
        <NavLink href='/schedule' expanded={expanded} icon={<ScheduleIcon />}>Schedule</NavLink>
        <NavLink href='/tasks' expanded={expanded} icon={<TasksIcon />}>Tasks</NavLink>
      </div>
      <div className='flex items-center gap-3 md:mt-auto md:flex-col md:items-stretch'>
        <AddButton expanded={expanded} />
        <div className='max-md:hidden'>
          <SingOutButton expanded={expanded} />
        </div>
        <button
          type='button'
          onClick={() => setIsDrawerOpen(true)}
          className='md:hidden flex flex-col justify-center items-center gap-1.5 p-1 py-1.5 rounded'
          aria-label='Open menu'
        >
          <span className='block w-6 h-[1px] bg-current rounded' />
          <span className='block w-6 h-[1px] bg-current rounded' />
          <span className='block w-6 h-[1px] bg-current rounded' />
        </button>
      </div>
    </nav>

    <Drawer isOpen={isDrawerOpen} onClose={closeDrawer}>
      <NavLink href='/' expanded icon={<CalendarIcon />} onClick={closeDrawer}>Calendar</NavLink>
      <NavLink href='/schedule' expanded icon={<ScheduleIcon />} onClick={closeDrawer}>Schedule</NavLink>
      <NavLink href='/tasks' expanded icon={<TasksIcon />} onClick={closeDrawer}>Tasks</NavLink>
      <SingOutButton expanded />
    </Drawer>
    </>
  )
}
