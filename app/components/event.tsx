'use client'
import { useState, useRef, useCallback } from 'react'
import { Resizable } from 're-resizable'

export default function Event ({ name, height, margin, id }: { name: string, height: number, margin: number, id: string }) {
  const [eventHeight, setEventHeight] = useState(height)
  const resizableRef = useRef<Resizable>(null)

  console.log(eventHeight)

  const handleDragStart = (event: DragEvent) => {
    event.dataTransfer?.setData('text/plain', id)
  }

  const handleDragEnd = (event) => {
  }

  const handleResize = useCallback((e, direction, ref, d) => {
    setEventHeight(height + d.height)
  }, [height])

  return (
    <Resizable
      ref={resizableRef}
      className='bg-blue-500 '
      style={{ marginTop: margin + 'px' }}
      defaultSize={{ width: '100%', height: eventHeight }}
      minHeight={20}
      enable={{ bottom: true }}
      onResizeStop={handleResize}
      handleStyles={{
        bottom: {
          bottom: 0,
          height: 20,
          cursor: 'ns-resize'
        }
      }}
    >
    <button draggable onDragStart={handleDragStart} onDragEnd={handleDragEnd}
    >
      {name}
    </button>
    </Resizable>
  )
}
