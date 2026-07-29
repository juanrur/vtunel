'use client'

import type { Event } from '@events/types'
import type { Task } from '@tasks/types'
import Item from './item'
import Gap from './gap'

interface DayProps {
  date: Date
  items: (Event | Task)[]
}

function isSameDay (a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
}

export default function Day ({ date, items }: DayProps) {
  const dayItems = items
    .filter(item => item.startTime && item.endTime && isSameDay(item.startTime, date))
    .sort((a, b) => a.startTime!.getTime() - b.startTime!.getTime())

  const entries: Array<{ type: 'item', item: Event | Task } | { type: 'gap', startTime: Date, endTime: Date }> = []
  let lastEnd = new Date(date)
  lastEnd.setHours(0, 0, 0, 0)

  dayItems.forEach(item => {
    if (item.startTime! > lastEnd) {
      entries.push({ type: 'gap', startTime: lastEnd, endTime: item.startTime! })
    }
    entries.push({ type: 'item', item })
    lastEnd = item.endTime!
  })

  const weekday = date.toLocaleDateString('es-ES', { weekday: 'long' })
  const dayNumber = date.getDate()

  return (
    <section className='flex flex-col min-w-[320px] flex-1 border-r border-primary last:border-r-0 h-full'>
      <header className='text-center p-4 border-b border-primary shrink-0'>
        <h2 className='text-lg font-semibold capitalize'>{weekday}</h2>
        <p className='text-zinc-400 text-2xl'>{dayNumber}</p>
      </header>

      <div className='flex-1 overflow-y-auto p-4 space-y-4 min-h-0'>
        {entries.length === 0 && (
          <p className='text-center text-zinc-500 py-8'>No items for this day</p>
        )}
        {entries.map((entry, index) => (
          entry.type === 'item'
            ? <Item key={entry.item.id} item={entry.item} />
            : <Gap key={`gap-${index}`} startTime={entry.startTime} endTime={entry.endTime} />
        ))}
      </div>
    </section>
  )
}
