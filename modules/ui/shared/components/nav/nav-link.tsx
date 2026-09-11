'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

export default function NavLink ({ href, children, icon, expanded }: { href: string, children: React.ReactNode, icon: React.ReactNode, expanded: boolean }) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link
      href={href}
      className={`
        flex items-center gap-3 rounded-lg px-3 py-2 font-medium transition-colors text-sm
        ${expanded ? 'md:justify-start' : 'md:justify-center'}
        ${isActive ? 'bg-secondary border' : 'hover:bg-secondary'}
      `}
      title={expanded ? undefined : String(children)}
    >
      {icon}
      <span className={expanded ? '' : 'md:hidden'}>{children}</span>
    </Link>
  )
}
