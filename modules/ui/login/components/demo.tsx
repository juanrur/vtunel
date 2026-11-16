'use client'

import { useState } from 'react'
import RepeatIcon from '@icons/repeat'
import { DAYS, FIRST_HOUR, HOURS, INITIAL_BLOCKS, ROUTINES, findSlot, formatHour, type Block } from '../state'

const hourLines = {
  backgroundImage: 'linear-gradient(to bottom, color-mix(in srgb, var(--border-color) 45%, transparent) 1px, transparent 1px)',
  backgroundSize: `100% ${100 / HOURS}%`
}

function position (start: number, duration: number) {
  return {
    top: `${(start - FIRST_HOUR) / HOURS * 100}%`,
    height: `${duration / HOURS * 100}%`
  }
}

export default function Demo () {
  const [blocks, setBlocks] = useState<Block[]>(INITIAL_BLOCKS)
  const [overDay, setOverDay] = useState<number | null>(null)
  const [status, setStatus] = useState('Drag something from the list onto the week, or tap it.')

  const unscheduled = blocks.filter(block => block.day === null)

  function move (id: string, day: number, start: number) {
    const block = blocks.find(item => item.id === id)
    if (!block) return

    const slot = findSlot(blocks, id, day, start, block.duration)
    if (slot === null) {
      setStatus(`${DAYS[day]} has no room for ${block.title}.`)
      return
    }

    setBlocks(blocks.map(item => item.id === id ? { ...item, day, start: slot } : item))
    setStatus(`${block.title} is on ${DAYS[day]} at ${formatHour(slot)}.`)
  }

  function toggleDone (id: string) {
    setBlocks(blocks.map(item => item.id === id ? { ...item, done: !item.done } : item))
  }

  function reset () {
    setBlocks(INITIAL_BLOCKS)
    setStatus('Drag something from the list onto the week, or tap it.')
  }

  function handleDragStart (event: React.DragEvent, id: string) {
    event.dataTransfer.setData('text/plain', id)
    event.dataTransfer.effectAllowed = 'move'
  }

  function handleDragOver (event: React.DragEvent, day: number) {
    event.preventDefault()
    if (overDay !== day) setOverDay(day)
  }

  function handleDragLeave (event: React.DragEvent<HTMLDivElement>) {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOverDay(null)
  }

  function handleDrop (event: React.DragEvent<HTMLDivElement>, day: number) {
    event.preventDefault()
    setOverDay(null)

    const id = event.dataTransfer.getData('text/plain')
    const rect = event.currentTarget.getBoundingClientRect()
    const hour = FIRST_HOUR + Math.floor((event.clientY - rect.top) / rect.height * HOURS)
    move(id, day, Math.min(Math.max(hour, FIRST_HOUR), FIRST_HOUR + HOURS - 1))
  }

  function handleKeyDown (event: React.KeyboardEvent, block: Block) {
    if (event.key !== 'Enter' && event.key !== ' ') return
    event.preventDefault()
    move(block.id, block.suggestion.day, block.suggestion.start)
  }

  return (
    <div className='rounded-2xl border border-primary bg-secondary p-3 shadow-xl shadow-black/5 dark:shadow-black/40 sm:p-4'>
      <div className='grid gap-4 sm:grid-cols-[9.5rem_minmax(0,1fr)]'>
        <div>
          <h2 className='text-sm font-semibold'>Unscheduled</h2>
          <ul className='mt-2 flex flex-wrap gap-2 sm:flex-col'>
            {unscheduled.map(block => (
              <li key={block.id}>
                <div
                  role='button'
                  tabIndex={0}
                  draggable
                  onDragStart={event => handleDragStart(event, block.id)}
                  onClick={() => move(block.id, block.suggestion.day, block.suggestion.start)}
                  onKeyDown={event => handleKeyDown(event, block)}
                  aria-label={`Put ${block.title} on the calendar`}
                  className='cursor-grab select-none rounded-lg border border-primary bg-primary px-3 py-2 text-sm transition-colors hover:border-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500 active:cursor-grabbing dark:hover:border-indigo-400'
                >
                  <span className='block font-medium leading-tight'>{block.title}</span>
                  <span className='block text-xs opacity-60'>{block.kind === 'task' ? 'Task' : 'Event'}, {block.duration}h</span>
                </div>
              </li>
            ))}
          </ul>
          {unscheduled.length === 0 && (
            <div className='mt-2 text-sm'>
              <p className='opacity-70'>Everything has a time now.</p>
              <button type='button' onClick={reset} className='mt-2 rounded-md px-2.5 py-1 text-xs'>
                Start over
              </button>
            </div>
          )}
        </div>

        <div>
          <div className='grid grid-cols-[2rem_repeat(5,minmax(0,1fr))] text-xs sm:grid-cols-[2.5rem_repeat(5,minmax(0,1fr))]'>
            <span />
            {DAYS.map(day => (
              <span key={day} className='pb-1.5 text-center font-medium opacity-70'>{day}</span>
            ))}
          </div>

          <div className='grid h-[324px] grid-cols-[2rem_repeat(5,minmax(0,1fr))] sm:h-[378px] sm:grid-cols-[2.5rem_repeat(5,minmax(0,1fr))]'>
            <div className='flex flex-col' aria-hidden='true'>
              {Array.from({ length: HOURS }, (_, index) => (
                <span key={index} className='flex-1 pr-1.5 text-right text-[10px] leading-none opacity-50'>
                  {formatHour(FIRST_HOUR + index)}
                </span>
              ))}
            </div>

            {DAYS.map((day, dayIndex) => (
              <div
                key={day}
                onDragOver={event => handleDragOver(event, dayIndex)}
                onDragLeave={handleDragLeave}
                onDrop={event => handleDrop(event, dayIndex)}
                style={hourLines}
                className={`relative border-l border-primary last:rounded-r-lg last:border-r ${overDay === dayIndex ? 'bg-indigo-500/15' : 'bg-primary'} ${dayIndex === 0 ? 'rounded-l-lg' : ''}`}
              >
                {ROUTINES.filter(routine => routine.days.includes(dayIndex)).map(routine => (
                  <div
                    key={routine.id}
                    style={position(routine.start, routine.duration)}
                    className='absolute inset-x-0.5 flex items-start gap-1 overflow-hidden rounded-md border border-dashed border-primary px-1 py-1 text-[11px] leading-tight opacity-70 sm:px-1.5 sm:text-xs'
                  >
                    <RepeatIcon className='mt-px size-3 shrink-0 max-xl:hidden' />
                    <span className='truncate'>{routine.title}</span>
                  </div>
                ))}

                {blocks.filter(block => block.day === dayIndex && block.start !== null).map(block => (
                  <div
                    key={block.id}
                    draggable
                    onDragStart={event => handleDragStart(event, block.id)}
                    style={position(block.start as number, block.duration)}
                    className={`absolute inset-x-0.5 flex cursor-grab items-start gap-1 overflow-hidden rounded-md px-1 py-1 text-[11px] font-medium leading-tight active:cursor-grabbing sm:px-1.5 sm:text-xs ${block.kind === 'task' ? 'border border-primary bg-secondary' : 'bg-indigo-600 text-white dark:bg-indigo-400 dark:text-[#18171c]'}`}
                  >
                    {block.kind === 'task' && (
                      <input
                        type='checkbox'
                        checked={block.done}
                        onChange={() => toggleDone(block.id)}
                        aria-label={`Mark ${block.title} as done`}
                        className='mt-px size-3 shrink-0 accent-indigo-500'
                      />
                    )}
                    <span className={block.done ? 'line-through opacity-50' : ''}>{block.title}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <p aria-live='polite' className='mt-3 text-xs opacity-60'>{status}</p>
    </div>
  )
}
