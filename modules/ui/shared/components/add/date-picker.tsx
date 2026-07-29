'use client'

import { useRef, useState } from 'react'

interface DatePickerProps {
  name: string
  defaultValue?: Date
  className?: string
}

const toDateValue = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const formatDate = (value: string) => {
  if (!value) return ''
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

export default function DatePicker ({
  name,
  defaultValue,
  className = ''
}: DatePickerProps) {
  const [date, setDate] = useState(() => defaultValue ? toDateValue(defaultValue) : toDateValue(new Date()))
  const inputRef = useRef<HTMLInputElement>(null)

  const handleClick = () => {
    inputRef.current?.showPicker()
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDate(event.target.value)
  }

  return (
    <div className={`relative ${className}`}>
      <input
        type='date'
        ref={inputRef}
        name={name}
        value={date}
        onChange={handleChange}
        className='hidden'
      />
      <input
        type='text'
        readOnly
        value={formatDate(date)}
        onClick={handleClick}
        className='border rounded p-1 w-full text-black bg-white cursor-pointer'
      />
    </div>
  )
}
