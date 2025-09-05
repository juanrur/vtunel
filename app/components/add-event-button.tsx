'use client'
import { useRef, useState } from 'react'
import PlusIcon from './icons/plus'
import { useEventsStore } from '@/store'
import EventDialog from './event-dialog'

export default function AddEventButton () {
  const { insertEvent, token } = useEventsStore()
  const [isOpen, setIsOpen] = useState(false)
  const dialogRef = useRef<HTMLDialogElement>(null)

  const handleClick = () => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (isOpen) {
      dialog.close()
      setIsOpen(false)
    } else {
      dialog.showModal()
      setIsOpen(true)
    }
  }

  dialogRef.current?.addEventListener('close', () => {
    setIsOpen(false)
  })

  return (
    <>
      <button
        onClick={handleClick}
        className="text-3xl rounded-full text-white p-1 flex justify-center items-center size-10"
      >
        {isOpen ? '-' : <PlusIcon />}
      </button>
      <EventDialog ref={dialogRef} onSubmit={(newEvent) => token && insertEvent(newEvent, token)}>
        Add Event
      </EventDialog>
    </>
  )
}
