'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

interface TimePickerProps {
  name: string
  defaultValue?: Date
  value?: string
  onChange?: (value: string) => void
  min?: string
  referenceTime?: string
  className?: string
  step?: number
}

const toTimeValue = (date: Date) => {
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${hours}:${minutes}`
}

const parseTime = (value: string): Date | null => {
  const match = value.match(/^(\d{1,2}):(\d{2})$/)
  if (!match) return null
  const hours = parseInt(match[1], 10)
  const minutes = parseInt(match[2], 10)
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null
  const date = new Date()
  date.setHours(hours, minutes, 0, 0)
  return date
}

const generateTimes = (step: number) => {
  const times: string[] = []
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += step) {
      times.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`)
    }
  }
  return times
}

const timeToMinutes = (value: string) => {
  const parsed = parseTime(value)
  if (!parsed) return 0
  return parsed.getHours() * 60 + parsed.getMinutes()
}

const getNearestTime = (value: string, times: string[]) => {
  const parsed = parseTime(value)
  if (!parsed) return times[0]
  const totalMinutes = parsed.getHours() * 60 + parsed.getMinutes()
  let nearest = times[0]
  let minDiff = Infinity
  times.forEach((time) => {
    const [hours, minutes] = time.split(':').map(Number)
    const diff = Math.abs(hours * 60 + minutes - totalMinutes)
    if (diff < minDiff) {
      minDiff = diff
      nearest = time
    }
  })
  return nearest
}

const formatDuration = (time: string, reference: string) => {
  const diffMinutes = timeToMinutes(time) - timeToMinutes(reference)
  const absMinutes = Math.abs(diffMinutes)
  const hours = Math.floor(absMinutes / 60)
  const minutes = absMinutes % 60
  const sign = diffMinutes < 0 ? '-' : '+'
  if (hours === 0) return `${sign}${minutes}m`
  if (minutes === 0) return `${sign}${hours}h`
  return `${sign}${hours}h ${minutes}m`
}

export default function TimePicker ({
  name,
  defaultValue,
  value: controlledValue,
  onChange,
  min,
  referenceTime,
  className = '',
  step = 5
}: TimePickerProps) {
  const isControlled = controlledValue !== undefined
  const initialValue = defaultValue ? toTimeValue(defaultValue) : ''
  const [internalValue, setInternalValue] = useState(initialValue)
  const value = isControlled ? controlledValue : internalValue
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const selectedRef = useRef<HTMLLIElement>(null)
  const skipBlurRef = useRef(false)
  const times = useMemo(() => generateTimes(step), [step])
  const validTimes = useMemo(() => {
    if (!min) return times
    const minMinutes = timeToMinutes(min)
    return times.filter((time) => timeToMinutes(time) >= minMinutes)
  }, [times, min])
  const nearestTime = useMemo(() => getNearestTime(value, validTimes), [value, validTimes])

  useEffect(() => {
    if (isOpen && selectedRef.current && listRef.current) {
      selectedRef.current.scrollIntoView({ block: 'center', behavior: 'instant' })
    }
  }, [isOpen])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const updateValue = (nextValue: string) => {
    if (!isControlled) {
      setInternalValue(nextValue)
    }
    onChange?.(nextValue)
  }

  const clampTime = (nextValue: string) => {
    if (!min) return nextValue
    if (timeToMinutes(nextValue) < timeToMinutes(min)) return min
    return nextValue
  }

  const handleSelect = (time: string) => {
    const nextValue = clampTime(time)
    updateValue(nextValue)
    setIsOpen(false)
    skipBlurRef.current = true
    inputRef.current?.blur()
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateValue(event.target.value)
  }

  const handleBlur = () => {
    if (skipBlurRef.current) {
      skipBlurRef.current = false
      setIsOpen(false)
      return
    }
    const parsed = parseTime(value)
    if (parsed) {
      updateValue(clampTime(toTimeValue(parsed)))
    }
    setIsOpen(false)
  }

  return (
    <div className={`relative h-fit ${className}`} ref={containerRef}>
      <input
        ref={inputRef}
        type='text'
        value={value}
        onChange={handleInputChange}
        onFocus={() => setIsOpen(true)}
        onBlur={handleBlur}
        placeholder='HH:mm'
        className='border rounded p-1 w-full text-black bg-white'
      />
      <input type='hidden' name={name} value={value} />
      {isOpen && (
        <ul ref={listRef} className='absolute top-full left-0 z-[100] max-h-40 overflow-y-auto bg-white border rounded shadow-lg w-full mt-1'>
          {validTimes.map((time) => {
            const isSelected = time === value
            const isNearest = time === nearestTime
            return (
              <li
                key={time}
                ref={isNearest ? selectedRef : undefined}
                className={`px-3 py-2 cursor-pointer flex justify-between items-center ${
                  isSelected
                    ? 'bg-secondary text-white'
                    : isNearest
                      ? 'bg-gray-200 text-black'
                      : 'text-black hover:bg-gray-100'
                }`}
                onMouseDown={(event) => {
                  event.preventDefault()
                  handleSelect(time)
                }}
              >
                <span>{time}</span>
                {referenceTime && (
                  <span className='text-xs opacity-70 ml-2'>
                    {formatDuration(time, referenceTime)}
                  </span>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
