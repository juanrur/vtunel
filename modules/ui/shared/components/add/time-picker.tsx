'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

interface TimePickerProps {
  name: string
  defaultValue?: Date
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

export default function TimePicker ({
  name,
  defaultValue,
  className = '',
  step = 5
}: TimePickerProps) {
  const [value, setValue] = useState(() => defaultValue ? toTimeValue(defaultValue) : '')
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const selectedRef = useRef<HTMLLIElement>(null)
  const skipBlurRef = useRef(false)
  const times = useMemo(() => generateTimes(step), [step])
  const nearestTime = useMemo(() => getNearestTime(value, times), [value, times])

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

  const handleSelect = (time: string) => {
    setValue(time)
    setIsOpen(false)
    skipBlurRef.current = true
    inputRef.current?.blur()
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }

  const handleBlur = () => {
    if (skipBlurRef.current) {
      skipBlurRef.current = false
      setIsOpen(false)
      return
    }
    const parsed = parseTime(value)
    if (parsed) {
      setValue(toTimeValue(parsed))
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
          {times.map((time) => {
            const isSelected = time === value
            const isNearest = time === nearestTime
            return (
              <li
                key={time}
                ref={isNearest ? selectedRef : undefined}
                className={`px-3 py-2 cursor-pointer ${
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
                {time}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
