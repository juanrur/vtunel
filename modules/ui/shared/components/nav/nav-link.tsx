'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

export default function NavLink ({ href, children, className = '', onClick }: { href: string, children: React.ReactNode, className?: string, onClick?: () => void }) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link
      onClick={onClick}
      href={href}
      className={`
        px-4 py-2 rounded-lg font-medium transition-colors text-sm
        ${isActive ? 'bg-secondary border' : 'hover:bg-secondary'}
        ${className}
      `}
    >
      {children}
    </Link>
  )
}
