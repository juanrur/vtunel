'use client'

import { FormEvent, useState } from 'react'
import type { Routine } from '@routines/types'
import { WEEKDAYS } from '@routines/utils'
import TimePicker from './time-picker'
import DatePicker from './date-picker'
import DeleteButton from './delete-button'
import CloseButton from './close-button'

const defaultStart = new Date()
defaultStart.setHours(9, 0, 0, 0)
const defaultEnd = new Date(defaultStart)
defaultEnd.setHours(10)

// DatePicker gives 'YYYY-MM-DD'; it's read as local midnight, not UTC
const parseDay = (value: FormDataEntryValue | null) => value ? new Date(`${value}T00:00`) : null

export default function RoutineForm ({ routine, close, onSubmit, onDelete }: { routine?: Routine, close: () => void, onSubmit: (routine: Omit<Routine, 'id'>) => void, onDelete?: () => void }) {
  const [hasEnd, setHasEnd] = useState(Boolean(routine?.repeatUntil))
  const [error, setError] = useState('')

  const handleSubmit = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault()
    const formData = new FormData(evt.currentTarget)
    const name = String(formData.get('name') ?? '').trim()
    const weekdays = formData.getAll('weekdays').map(Number)
    const day = String(formData.get('day') ?? '')
    const start = String(formData.get('startTime') ?? '')
    const end = String(formData.get('endTime') ?? '')
    const repeatUntil = hasEnd ? parseDay(formData.get('repeatUntil')) : null

    if (!name || weekdays.length === 0 || !day || !start || !end) {
      setError('Name, at least one day and the hours are required')
      return
    }

    const startTime = new Date(`${day}T${start}`)
    const endTime = new Date(`${day}T${end}`)
    // An end hour earlier than the start one means the routine ends the next day (e.g. 22:00 → 02:00)
    if (endTime <= startTime) endTime.setDate(endTime.getDate() + 1)

    if (repeatUntil && repeatUntil < parseDay(day)!) {
      setError('The end date can\'t be before the start date')
      return
    }

    setError('')
    close()
    onSubmit({ name, weekdays, startTime, endTime, repeatUntil, userId: routine?.userId ?? '' })
  }

  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-4 dark:text-white text-zinc-800 min-w-[300px]'>
      <div className='absolute top-3 right-4 flex items-center gap-2'>
        {routine?.id && onDelete && <DeleteButton onDelete={onDelete} close={close} />}
        <CloseButton close={close} />
      </div>
      <label>
        Name:
        <input type='text' name='name' className='border rounded p-1 w-full text-black' defaultValue={routine?.name} />
      </label>

      <fieldset>
        <legend className='mb-1'>Repeats on:</legend>
        <div className='flex gap-1'>
          {WEEKDAYS.map(day => (
            <label key={day.value} title={day.name} className='cursor-pointer'>
              <input
                type='checkbox'
                name='weekdays'
                value={day.value}
                defaultChecked={routine?.weekdays.includes(day.value)}
                className='peer hidden'
              />
              <span className='grid place-content-center size-9 rounded-full border text-xs select-none transition-colors peer-checked:bg-indigo-900 peer-checked:border-indigo-400'>
                {day.short.slice(0, 2)}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className='grid grid-cols-2 gap-2'>
        <label>
          From:
          <TimePicker name='startTime' defaultValue={routine?.startTime ?? defaultStart} step={15} />
        </label>
        <label>
          To:
          <TimePicker name='endTime' defaultValue={routine?.endTime ?? defaultEnd} step={15} />
        </label>
      </div>

      <div className='grid grid-cols-2 gap-2'>
        <label>
          Starts on:
          <DatePicker name='day' defaultValue={routine?.startTime ?? new Date()} />
        </label>
        <div>
          <label className='flex items-center gap-2'>
            <input type='checkbox' checked={hasEnd} onChange={event => setHasEnd(event.target.checked)} />
            Ends on:
          </label>
          {hasEnd
            ? <DatePicker name='repeatUntil' defaultValue={routine?.repeatUntil ?? undefined} />
            : <p className='text-sm text-zinc-400 py-1'>Never</p>}
        </div>
      </div>

      {error && <p className='text-sm text-red-400'>{error}</p>}

      <button type='submit' className='bg-secondary text-white rounded px-4 py-2 border'>Save</button>
    </form>
  )
}
