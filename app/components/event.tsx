'use client'
export default function Event ({ name, height }: { name: string, height: number }) {
  return (
    <li className={`bg-blue-500 rounded-md py-4 px-6 h-[${height}em]`}>
      <button>
        {name}
      </button>
    </li>
  )
}
