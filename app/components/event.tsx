'use client'

export default function Event ({ name, height, margin, id }: { name: string, height: number, margin: number, id: string }) {
  const handleDragStart = (event: any) => {
    event.dataTransfer?.setData('text/plain', id)
  }

  const handleDragEnd = (event: any) => {
  }

  return (
    <button draggable onDragStart={handleDragStart} onDragEnd={handleDragEnd}
    className='bg-blue-500 w-2/3 inline-flex'
    style={{ height: height + 'px', marginTop: margin + 'px' }}
    >
      {name}
    </button>
  )
}
