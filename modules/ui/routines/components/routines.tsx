'use client'

import { useEffect, useRef, useState } from 'react'
import { useRoutinesStore } from '@routines/store'
import type { Routine } from '@routines/types'
import { minutesOfDay } from '@routines/utils'
import AddDialog from '@ui/shared/components/add/add-dialog'
import { DialogType } from '@ui/shared/components/add/add-button'
import PlusIcon from '@icons/plus'
import Item from './item'

export default function Routines () {
  const { routines, routinesAreLoading, getAllRoutines, createRoutine, updateRoutine, deleteRoutine } = useRoutinesStore()
  const [selectedRoutine, setSelectedRoutine] = useState<Routine | undefined>()
  const createDialogRef = useRef<HTMLDialogElement>(null)
  const editDialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    getAllRoutines()
  }, [getAllRoutines])

  const handleEdit = (routine: Routine) => {
    setSelectedRoutine(routine)
    editDialogRef.current?.showModal()
  }

  const sortedRoutines = [...routines].sort((a, b) => minutesOfDay(a.startTime) - minutesOfDay(b.startTime))

  return (
    <section className='flex flex-col gap-4 p-4 h-full min-h-0'>
      <div className='flex items-center justify-between'>
        <h2 className='text-lg font-semibold opacity-80'>Events that repeat every week</h2>
        <button
          onClick={() => createDialogRef.current?.showModal()}
          className='rounded-full bg-secondary p-2 flex justify-center items-center size-10 border hover:bg-primary transition-colors'
          aria-label='Add routine'
        >
          <PlusIcon />
        </button>
      </div>

      <ul className='flex flex-col gap-2 overflow-y-auto pr-1'>
        {sortedRoutines.map(routine => (
          <Item key={routine.id} routine={routine} onEdit={handleEdit} onDelete={() => deleteRoutine(routine.id)} />
        ))}
        {!routinesAreLoading && routines.length === 0 && (
          <li className='text-center opacity-60 py-8 border rounded-lg border-dashed'>
            No routines yet. Add your classes, work or gym hours and they&apos;ll show up every week in the calendar.
          </li>
        )}
      </ul>

      <AddDialog
        ref={createDialogRef}
        type={DialogType.Routine}
        onSubmit={newRoutine => createRoutine(newRoutine as Omit<Routine, 'id'>)}
      >
        Add Routine
      </AddDialog>

      <AddDialog
        ref={editDialogRef}
        type={DialogType.Routine}
        item={selectedRoutine}
        onSubmit={updated => {
          if (selectedRoutine) updateRoutine(selectedRoutine.id, updated as Omit<Routine, 'id'>)
        }}
        onDelete={() => {
          if (selectedRoutine) deleteRoutine(selectedRoutine.id)
        }}
      >
        Edit Routine
      </AddDialog>
    </section>
  )
}
