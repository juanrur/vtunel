'use client'

import { useRef, useState } from 'react'
import TimePicker from '@ui/shared/components/add/time-picker'

const STEP_MINUTES = 15

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

const toTimeValue = (date: Date) => {
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${hours}:${minutes}`
}

const timeToMinutes = (value: string) => {
  const [hours, minutes] = value.split(':').map(Number)
  return hours * 60 + minutes
}

const formatMinutes = (minutes: number) => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`
}

const snapDown = (minutes: number, step: number) => {
  const maxMinutes = 24 * 60 - step
  if (minutes > maxMinutes) return maxMinutes
  return Math.floor(minutes / step) * step
}

export default function DateTimeRange ({
  dayName = 'day',
  startName = 'startTime',
  endName = 'endTime',
  startDate,
  endDate,
  className = ''
}: DateTimeRangeProps) {
  const dayInputRef = useRef<HTMLInputElement>(null)
  const now = new Date()

  const handleDayChange = () => {
    dayInputRef.current?.blur()
  }

  const defaultStart = startDate ?? now
  const defaultEnd = endDate ?? (() => {
    const d = new Date(now)
    d.setHours(d.getHours() + 1)
    return d
  })()

  const [startTime, setStartTime] = useState(toTimeValue(defaultStart))
  const [endTime, setEndTime] = useState(toTimeValue(defaultEnd))
  const durationRef = useRef(Math.max(0, timeToMinutes(toTimeValue(defaultEnd)) - timeToMinutes(toTimeValue(defaultStart))))

  const handleStartChange = (value: string) => {
    const startMinutes = timeToMinutes(value)
    const endMinutes = snapDown(startMinutes + durationRef.current, STEP_MINUTES)
    setStartTime(value)
    setEndTime(formatMinutes(endMinutes))
  }

  const handleEndChange = (value: string) => {
    setEndTime(value)
    durationRef.current = Math.max(0, timeToMinutes(value) - timeToMinutes(startTime))
  }

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <label>
        Day:
        <input
          ref={dayInputRef}
          type='date'
          name={dayName}
          className='border rounded p-1 w-full text-black'
          defaultValue={toDateValue(defaultStart)}
          onChange={handleDayChange}
        />
      </label>
      <label>
        Start Time:
        <TimePicker
          name={startName}
          defaultValue={defaultStart}
          value={startTime}
          onChange={handleStartChange}
          step={15}
        />
      </label>
      <label>
        End Time:
        <TimePicker
          name={endName}
          defaultValue={defaultEnd}
          value={endTime}
          onChange={handleEndChange}
          min={startTime}
          referenceTime={startTime}
          step={15}
        />
      </label>
    </div>
  )
}
