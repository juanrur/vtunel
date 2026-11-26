import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const MIN_PIXELS_PER_MINUTE = 0.5

interface SettingsStore {
  pixelsPerMinute: number
  setPixelsPerMinute: (number: number) => void
  minutesPerDivision: number
  setMinutesPerDivision: (number: number) => void
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      pixelsPerMinute: MIN_PIXELS_PER_MINUTE,
      setPixelsPerMinute: (number: number) => set(() => ({ pixelsPerMinute: Math.max(MIN_PIXELS_PER_MINUTE, number || MIN_PIXELS_PER_MINUTE) })),
      minutesPerDivision: 60,
      setMinutesPerDivision: (number: number) => set(() => ({ minutesPerDivision: number }))
    }),
    {
      name: 'vtunel-calendar-config',
      partialize: (state) => ({
        pixelsPerMinute: state.pixelsPerMinute,
        minutesPerDivision: state.minutesPerDivision
      })
    }
  )
)
