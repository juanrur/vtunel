'use client'
import { useState } from 'react'
import Link from 'next/link'
import NavLink from './nav-link'
import Drawer from './drawer'
import AddButton from '@ui/shared/components/add/add-button'
import SingOutButton from '@ui/shared/components/auth/sing-out-button'

export default function Nav () {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  return (
    <>
      <nav className='flex items-center justify-between px-4 py-2 border-b bg-primary shrink-0'>
        <Link
          href='/'
          className='text-xl font-bold tracking-tight hover:opacity-80 transition-opacity'
        >
          Vtunel
        </Link>
        <div className='hidden md:flex items-center gap-2'>
          <NavLink href='/'>Calendar</NavLink>
          <NavLink href='/schedule'>Schedule</NavLink>
          <NavLink href='/tasks'>Tasks</NavLink>
        </div>
        <div className='flex items-center gap-2 md:gap-3'>
          <AddButton />
          <div className='hidden md:block'>
            <SingOutButton />
          </div>
          <button
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

      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
        <NavLink onClick={() => setIsDrawerOpen(false)} href='/' className='py-3 text-base w-full'>Calendar</NavLink>
        <NavLink onClick={() => setIsDrawerOpen(false)} href='/schedule' className='py-3 text-base w-full'>Schedule</NavLink>
        <NavLink onClick={() => setIsDrawerOpen(false)} href='/tasks' className='py-3 text-base w-full'>Tasks</NavLink>
        <SingOutButton />
      </Drawer>
    </>
  )
}
