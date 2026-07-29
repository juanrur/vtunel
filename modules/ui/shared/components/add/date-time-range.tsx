'use client'

import TimePicker from '@ui/shared/components/add/time-picker'

interface DateTimeRangeProps {
  dayName?: string
  startName?: string
  endName?: string
  startDate?: Date
  endDate?: Date
  className?: string
}

const toDateValue = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export default function DateTimeRange ({
  dayName = 'day',
  startName = 'startTime',
  endName = 'endTime',
  startDate,
  endDate,
  className = ''
}: DateTimeRangeProps) {
  const now = new Date()

  const defaultStart = startDate ?? now
  const defaultEnd = endDate ?? (() => {
    const d = new Date(now)
    d.setHours(d.getHours() + 1)
    return d
  })()

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <label>
        Day:
        <input
          type='date'
          name={dayName}
          className='border rounded p-1 w-full text-black'
          defaultValue={toDateValue(defaultStart)}
        />
      </label>
      <label>
        Start Time:
        <TimePicker name={startName} defaultValue={defaultStart} step={5} />
      </label>
      <label>
        End Time:
        <TimePicker name={endName} defaultValue={defaultEnd} step={5} />
      </label>
    </div>
  )
}
