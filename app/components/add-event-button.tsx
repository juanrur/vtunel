'use client'
import { useRef, useState } from 'react'
import PlusIcon from './icons/plus'
import EventForm from './event-form'
import { useEventsStore } from '@/store'

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
      <dialog className='bg-primary border-2 rounded-lg p-4 shadow-lg top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 relative' ref={dialogRef}>
        <h2 className='text-2xl font-bold mb-4 text-white'>Add Event</h2>
        <EventForm close={() => dialogRef.current?.close()} onSubmit={(newEvent) => token && insertEvent(newEvent, token)} />
      </dialog>
    </>
  )
}
