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
}

export const useRoutinesStore = create<RoutinesStore>((set) => ({
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
  }
}))
