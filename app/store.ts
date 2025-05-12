import { create } from 'zustand'
import { fetchEvents, getAllEvents, insertEvent as insertEventDB } from './db/client'
import { Event } from './types'

interface EventsStore {
  currentWeekEvents: Event[],
  week: Date,
  divisionsPerDay: number,
  changeDivisionsPerDay: (number: number) => void,
  changeEventStartTime: (newStartTime: Date, eventID: string) => void
  increaseWeek: () => void
  decreaseWeek: () => void
  getWeeklyEvents: (week: Date) => void
  getAllEvents: () => void
  insertEvent: (event: Omit<Event, 'id'>) => void
}

export const useEventsStore = create<EventsStore>((set) => ({
  currentWeekEvents: [],
  week: new Date(),
  divisionsPerDay: 0,

  changeDivisionsPerDay: (number: number) => set(() => ({ divisionsPerDay: number })),

  changeEventStartTime: (newStartTime: Date, eventID: string) => set(({ currentWeekEvents }) => {
    return {
      currentWeekEvents: currentWeekEvents.map((event) => {
        if (event.id === eventID) {
          const newEndTime = new Date(event.endTime.getTime() + (newStartTime.getTime() - event.startTime.getTime()))
          return { ...event, startTime: newStartTime, endTime: newEndTime }
        }
        return event
      }
      )
    }
  }),

  increaseWeek: () => set((state) => {
    const newDate = new Date(state.week)
    newDate.setDate(state.week.getDate() + 7)
    return { week: newDate }
  }),

  decreaseWeek: () => set((state) => {
    const newDate = new Date(state.week)
    newDate.setDate(state.week.getDate() - 7)
    return { week: newDate }
  }),

  getWeeklyEvents: async (week) => {
    const eventsResponse = await fetchEvents(week)
    set(() => ({ currentWeekEvents: eventsResponse }))
  },

  getAllEvents: async () => {
    const eventsResponse = await getAllEvents()
    set(() => ({ currentWeekEvents: eventsResponse }))
  },

  insertEvent: async (event) => {
    await insertEventDB(event)
    const updatedEvents = await getAllEvents()
    set(() => ({ currentWeekEvents: updatedEvents }))
  }
}))
