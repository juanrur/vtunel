'use client'

export default function Event ({ name, height, margin, id }: { name: string, height: number, margin: number }) {
  const handleDragStart = (event: DragEvent) => {
    event.dataTransfer?.setData('text/plain', id)
    console.log('drag end', event.target)
  }

  const handleDragEnd = () => {
    console.log('drag end')
  }

  return (
    <button draggable onDragStart={handleDragStart} onDragEnd={handleDragEnd}
    className='bg-blue-500'
    style={{ height: height + 'px', marginTop: margin + 'px' }}
    >
      {name}
    </button>
  )
}
