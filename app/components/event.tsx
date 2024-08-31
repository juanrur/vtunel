'use client'
export default function Event ({ name, height, margin }: { name: string, height: number, margin: number }) {
  return (
    <button
    className='bg-blue-500'
    style={{ height: height + 'px', marginTop: margin + 'px' }}
    >
      {name}
    </button>
  )
}
