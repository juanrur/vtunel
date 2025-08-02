import { create } from 'zustand'
import { deleteEvent, getAllEvents, insertEvent as insertEventDB } from './db/client'
import { Event } from './types'

interface EventsStore {
  events: Event[]
  week: Date
  divisionsPerDay: number
  token: string | null
  pixelsPerMinute: number
  minutesPerDivided: number
  changeDivisionsPerDay: (number: number) => void
  changeEventStartTime: (newStartTime: Date, eventID: string) => void
  increaseWeek: () => void
  decreaseWeek: () => void
  getAllEvents: (token: string) => void
  insertEvent: (event: Omit<Event, 'id' | 'userId'>, token: string) => void
  deleteEvent: (eventID: string) => void,
  setToken: (token: string) => void
}

export const useEventsStore = create<EventsStore>((set) => ({
  events: [],
  week: new Date(),
  divisionsPerDay: 0,
  token: null,
  pixelsPerMinute: 4,
  minutesPerDivided: 15,

  changeDivisionsPerDay: (number: number) => set(() => ({ divisionsPerDay: number })),

  changeEventStartTime: (newStartTime: Date, eventID: string) => set(({ events }) => {
    return {
      events: events.map((event) => {
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

  getAllEvents: async (token) => {
    const eventsResponse = await getAllEvents(token)
    set(() => ({ events: eventsResponse }))
  },

  insertEvent: async (event, token) => {
    await insertEventDB(event, token)
    const updatedEvents = await getAllEvents(token)
    set(() => ({ events: updatedEvents }))
  },

  deleteEvent: async (eventID) => {
    set(({ events }) => {
      const updatedEvents = events.filter((event) => event.id !== eventID)
      return { events: updatedEvents }
    })

    await deleteEvent(eventID)
  },

  setToken: (token: any) => set(() => ({ token }))
}))
