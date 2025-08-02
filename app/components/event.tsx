'use client'

export default function Event ({ name, height, margin, id }: { name: string, height: number, margin: number, id: string }) {
  const handleDragStart = (event: any) => {
    event.dataTransfer?.setData('text/plain', id)
  }

  const handleDragEnd = (event: any) => {
  }

  console.log('Event rendered', name, height, margin)

  return (
    <button draggable onDragStart={handleDragStart} onDragEnd={handleDragEnd}
    className='bg-blue-500 w-3/4 inline-flex overflow-hidden py-1 px-1.5 rounded-r absolute'
    style={{ height: height + 'px', marginTop: margin + 'px' }}
    >
      {name}
    </button>
  )
}
