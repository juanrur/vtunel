'use client'
import { useState } from 'react'

export default function Event ({ name, height, margin, id }: { name: string, height: number, margin: number, id: string }) {
  const [eventHeight, setEventHeight] = useState(height)

  const handleDragStart = (event: any) => {
    event.dataTransfer?.setData('text/plain', id)
  }

  const handleDragEnd = () => {
  }

  return (
    <button
      draggable
      className='bg-blue-500'
      style={{ marginTop: margin + 'px', width: '100%', height: eventHeight }}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {name}
    </button>
  )
}
