import Link from 'next/link'
import NavLink from './nav-link'

export default function Nav () {
  return (
    <nav className='flex items-center justify-between px-4 py-2 border-b bg-primary shrink-0'>
      <Link
        href='/'
        className='text-xl font-bold tracking-tight hover:opacity-80 transition-opacity'
      >
        Vtunel
      </Link>
      <div className='flex items-center gap-2'>
        <NavLink href='/'>Calendar</NavLink>
        <NavLink href='/tasks'>Tasks</NavLink>
      </div>
    </nav>
  )
}
