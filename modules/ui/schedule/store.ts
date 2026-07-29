import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ScheduleState {
  selectedDate: string
  daysCount: number
  setDaysCount: (daysCount: number) => void
  goPrevDay: () => void
  goNextDay: () => void
  goToday: () => void
}

export const useScheduleStore = create<ScheduleState>()(
  persist(
    (set) => ({
      selectedDate: new Date().toISOString(),
      daysCount: 1,
      setDaysCount: (daysCount) => set({ daysCount }),
      goPrevDay: () => set(({ selectedDate }) => {
        const date = new Date(selectedDate)
        date.setDate(date.getDate() - 1)
        return { selectedDate: date.toISOString() }
      }),
      goNextDay: () => set(({ selectedDate }) => {
        const date = new Date(selectedDate)
        date.setDate(date.getDate() + 1)
        return { selectedDate: date.toISOString() }
      }),
      goToday: () => set({ selectedDate: new Date().toISOString() })
    }),
    {
      name: 'vtunel-schedule-config',
      partialize: (state) => ({
        selectedDate: state.selectedDate,
        daysCount: state.daysCount
      })
    }
  )
)
