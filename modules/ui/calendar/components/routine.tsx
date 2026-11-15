'use client'

import { useRef } from 'react'
import { useRoutinesStore } from '@routines/store'
import type { Routine as RoutineType, RoutineOccurrence } from '@routines/types'
import AddDialog from '@ui/shared/components/add/add-dialog'
import { DialogType } from '@ui/shared/components/add/add-button'
import RepeatIcon from '@icons/repeat'

export default function Routine ({ occurrence, height, margin }: { occurrence: RoutineOccurrence, height: number, margin: number }) {
  const { routines, updateRoutine, deleteRoutine } = useRoutinesStore()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const routine = routines.find(r => r.id === occurrence.routineId)

  return (
    <article
      onClick={() => dialogRef.current?.showModal()}
      className='bg-indigo-950 dark:bg-indigo-950/80 dark:hover:bg-indigo-950 transition-colors w-3/4 inline-flex gap-1 overflow-hidden py-1 px-1.5 rounded-r absolute border-2 border-l-indigo-400 border-[var(--background-color)] cursor-pointer'
      style={{ height: height + 'px', marginTop: margin + 'px' }}
      title='Routine'
    >
      <RepeatIcon className='size-3.5 shrink-0 mt-1 opacity-70' />
      <span className='truncate'>{occurrence.name}</span>
      {routine &&
        <div className='absolute' onClick={event => event.stopPropagation()}>
          <AddDialog
            ref={dialogRef}
            type={DialogType.Routine}
            item={routine}
            onSubmit={newRoutine => updateRoutine(routine.id, newRoutine as Omit<RoutineType, 'id'>)}
            onDelete={() => deleteRoutine(routine.id)}
          >
            Edit Routine
          </AddDialog>
        </div>
      }
    </article>
  )
}
