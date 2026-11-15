import type { Routine } from '@routines/types'
import { WEEKDAYS } from '@routines/utils'
import TrashIcon from '@icons/trash'

const formatDate = (date: Date) => date.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })

const formatTime = (date: Date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })

function dateRange ({ startTime, repeatUntil }: Routine) {
  if (repeatUntil) return `${formatDate(startTime)} → ${formatDate(repeatUntil)}`
  return `Since ${formatDate(startTime)}`
}

export default function Item ({ routine, onEdit, onDelete }: { routine: Routine, onEdit: (routine: Routine) => void, onDelete: () => void }) {
  return (
    <li>
      <article className='bg-secondary flex items-center gap-3 rounded-lg border border-l-4 border-l-indigo-400 p-3 transition-colors hover:border-primary max-md:flex-wrap'>
        <div className='flex-1 min-w-0'>
          <h2 className='truncate'>{routine.name}</h2>
          <p className='text-sm text-zinc-400 tabular-nums'>
            {formatTime(routine.startTime)} – {formatTime(routine.endTime)} · {dateRange(routine)}
          </p>
        </div>
        <ul className='flex gap-1' aria-label='Repeats on'>
          {WEEKDAYS.map(day => {
            const active = routine.weekdays.includes(day.value)
            return (
              <li
                key={day.value}
                title={day.name}
                className={`grid place-content-center size-7 rounded-full text-[10px] border ${active ? 'bg-indigo-900 border-indigo-400' : 'opacity-30'}`}
              >
                {day.short.slice(0, 2)}
              </li>
            )
          })}
        </ul>
        <button
          onClick={() => onEdit(routine)}
          className='px-3 py-1.5 text-sm bg-primary rounded border hover:bg-secondary transition-colors'
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          className='size-8 p-1 rounded text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-colors'
          aria-label='Delete routine'
        >
          <TrashIcon />
        </button>
      </article>
    </li>
  )
}
