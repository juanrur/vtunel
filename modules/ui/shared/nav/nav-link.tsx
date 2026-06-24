'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function NavLink ({ href, children }: { href: string, children: React.ReactNode }) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link
      href={href}
      className={`
        px-4 py-2 rounded-lg font-medium transition-colors text-sm
        ${isActive ? 'bg-secondary border' : 'hover:bg-secondary'}
      `}
    >
      {children}
    </Link>
  )
}
