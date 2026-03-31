import { create } from 'zustand'

interface SettingsStore {
  pixelsPerMinute: number
  setPixelsPerMinute: (number: number) => void
  minutesPerDivision: number
  setMinutesPerDivision: (number: number) => void
}

export const useSettingsStore = create<SettingsStore>((set) => ({
  pixelsPerMinute: 1,
  setPixelsPerMinute: (number: number) => set(() => ({ pixelsPerMinute: number })),
  minutesPerDivision: 60,
  setMinutesPerDivision: (number: number) => set(() => ({ minutesPerDivision: number }))
}))
