'use client'
export default function Event ({ name, height }: { name: string, height: number }) {
  return (
    <button className={`bg-blue-500 w-full rounded-md grid content-center h-[${height}px]`}>
      {name}
    </button>
  )
}
