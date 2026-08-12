'use client'
import { useState } from 'react'
import Calendar from '@ui/calendar/components/calendar'
import Header from '@ui/calendar/components/header'
import Sheet from '@ui/calendar/components/sheet'
import ItemsList from '@ui/calendar/components/items-list'
import BottomBar from '@ui/calendar/components/bottom-bar'

export default function CalendarWrapper () {
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  const handleOpenSheet = () => {
    setIsSheetOpen(true)
  }

  const handleCloseSheet = () => {
    setIsSheetOpen(false)
  }

  return (
    <>
      <div className='h-full flex flex-col min-h-0 md:pb-0'>
        <Header />
        <Calendar />
      </div>
      <BottomBar onOpenSheet={handleOpenSheet} />
      <Sheet isOpen={isSheetOpen} onClose={handleCloseSheet}>
        <ItemsList />
      </Sheet>
    </>
  )
}
