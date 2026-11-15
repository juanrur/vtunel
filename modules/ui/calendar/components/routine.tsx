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
    >
      <RepeatIcon className='size-3.5 shrink-0 mt-1 opacity-70' />
      {/* The title goes on the label and not on the <article>, because the dialog inside would inherit the tooltip */}
      <span className='truncate' title='Routine'>{occurrence.name}</span>
      {routine &&
        <AddDialog
          ref={dialogRef}
          type={DialogType.Routine}
          item={routine}
          onSubmit={newRoutine => updateRoutine(routine.id, newRoutine as Omit<RoutineType, 'id'>)}
          onDelete={() => deleteRoutine(routine.id)}
        >
          Edit Routine
        </AddDialog>
      }
    </article>
  )
}
