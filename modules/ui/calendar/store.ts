import { create } from 'zustand'

interface ViewStore {
  view: 'day' | 'week' | 'month'
  setView: (view: 'day' | 'week' | 'month') => void
  viewDate: Date
  increaseViewDate: () => void
  decreaseViewDate: () => void
}

export const useViewStore = create<ViewStore>((set) => ({
  view: 'week',
  setView: (view: 'day' | 'week' | 'month') => set(() => ({ view })),

  viewDate: new Date(),

  increaseViewDate: () => set((state) => {
    const newDate = new Date(state.viewDate)
    const views = {
      month: () => {
        newDate.setMonth(state.viewDate.getMonth() + 1)
      },
      week: () => {
        newDate.setDate(state.viewDate.getDate() + 7)
      },
      day: () => {
        newDate.setDate(state.viewDate.getDate() + 1)
      }
    }
    views[state.view]()
    return { viewDate: newDate }
  }),

  decreaseViewDate: () => set((state) => {
    const newDate = new Date(state.viewDate)
    const views = {
      month: () => {
        newDate.setMonth(state.viewDate.getMonth() - 1)
      },
      week: () => {
        newDate.setDate(state.viewDate.getDate() - 7)
      },
      day: () => {
        newDate.setDate(state.viewDate.getDate() - 1)
      }
    }
    views[state.view]()
    return { viewDate: newDate }
  })
}))
