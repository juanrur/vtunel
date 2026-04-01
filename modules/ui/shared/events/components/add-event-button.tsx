'use client'
import { useRef, useState } from 'react'
import PlusIcon from '@ui/shared/icons/plus'
import { useEventsStore } from '@events/store'
import EventDialog from '@ui/shared/events/components/event-dialog'

export default function AddEventButton () {
  const { insertEvent } = useEventsStore()
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
      <EventDialog ref={dialogRef} onSubmit={(newEvent) => insertEvent(newEvent)}>
        Add Event
      </EventDialog>
    </>
  )
}
