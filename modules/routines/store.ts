import { create } from 'zustand'
import { PocketbaseRoutinesRepository } from './pocketbase-routines-repository'
import type { Routine } from './types'

interface RoutinesStore {
  routines: Routine[]
  routinesAreLoading: boolean
  getAllRoutines: () => Promise<void>
  createRoutine: (routine: Omit<Routine, 'id'>) => Promise<void>
  updateRoutine: (id: string, routine: Partial<Omit<Routine, 'id'>>) => Promise<void>
  deleteRoutine: (id: string) => Promise<void>
  changeRoutineStartTime: (newStartTime: Date, routineID: string, occurrenceDay: Date) => Promise<void>
}

export const useRoutinesStore = create<RoutinesStore>((set, get) => ({
  routines: [],
  routinesAreLoading: true,

  getAllRoutines: async () => {
    set({ routinesAreLoading: true })
    const routines = await PocketbaseRoutinesRepository.getAll()
    set({ routines, routinesAreLoading: false })
  },

  createRoutine: async (routine) => {
    try {
      const created = await PocketbaseRoutinesRepository.create(routine)
      set(({ routines }) => ({ routines: [...routines, created] }))
    } catch (error) {
      console.log(error)
    }
  },

  updateRoutine: async (id, routine) => {
    const updated = await PocketbaseRoutinesRepository.update(id, routine)
    set(({ routines }) => ({ routines: routines.map(r => r.id === id ? updated : r) }))
  },

  deleteRoutine: async (id) => {
    set(({ routines }) => ({ routines: routines.filter(r => r.id !== id) }))
    await PocketbaseRoutinesRepository.delete(id)
  },

  changeRoutineStartTime: async (newStartTime, routineID, occurrenceDay) => {
    const routine = get().routines.find(routine => routine.id === routineID)
    if (!routine) return

    const duration = routine.endTime.getTime() - routine.startTime.getTime()
    const startTime = new Date(routine.startTime)
    startTime.setHours(newStartTime.getHours(), newStartTime.getMinutes())
    const endTime = new Date(startTime.getTime() + duration)
    const weekdays = Array.from(new Set(
      routine.weekdays.map(day => day === occurrenceDay.getDay() ? newStartTime.getDay() : day)
    ))

    set(({ routines }) => ({
      routines: routines.map(routine => routine.id === routineID ? { ...routine, startTime, endTime, weekdays } : routine)
    }))

    await PocketbaseRoutinesRepository.update(routineID, { startTime, endTime, weekdays })
  }
}))
