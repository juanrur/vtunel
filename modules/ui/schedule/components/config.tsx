'use client'

import { useScheduleStore } from '../store'

const OPTIONS = [1, 2, 3, 5, 7]

export default function Config () {
  const { daysCount, setDaysCount } = useScheduleStore()

  return (
    <select
      className='bg-secondary border border-primary rounded p-1 text-sm'
      value={daysCount}
      onChange={(event) => setDaysCount(Number(event.target.value))}
    >
      {OPTIONS.map(count => (
        <option key={count} value={count}>
          {count} día{count > 1 ? 's' : ''}
        </option>
      ))}
    </select>
  )
}
