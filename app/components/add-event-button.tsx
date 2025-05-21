'use client'

import EventAdderForm from '@/components/event-adder-form'
import { useRef, useState } from 'react'

export default function AddEventButton () {
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
        className="font-extrabold text-3xl rounded-full bg-white text-black flex justify-center items-center size-10"
      >
        {isOpen ? '-' : '+'}
      </button>
      <dialog className='rounded top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-10' ref={dialogRef} closedby="any">
        <EventAdderForm />
      </dialog>
    </>
  )
}
