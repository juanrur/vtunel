import Nav from '@ui/shared/nav/nav'
import React from 'react'

export default function AppLayout ({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='h-full flex flex-col'>
      <Nav />
      <div className='flex-1 min-h-0'>{children}</div>
    </div>
  )
}
