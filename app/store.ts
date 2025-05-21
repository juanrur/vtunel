import { create } from 'zustand'
import { deleteEvent, fetchEvents, getAllEvents, insertEvent as insertEventDB } from './db/client'
import { Event } from './types'

interface EventsStore {
  currentWeekEvents: Event[],
  allEvents: Event[],
  week: Date,
  divisionsPerDay: number,
  token: string | null,
  changeDivisionsPerDay: (number: number) => void,
  changeEventStartTime: (newStartTime: Date, eventID: string) => void
  increaseWeek: () => void
  decreaseWeek: () => void
  getWeeklyEvents: (token: string, week: Date) => void
  getAllEvents: () => void
  insertEvent: (event: Omit<Event, 'id' | 'userId'>, token: string) => void
  deleteEvent: (eventID: string) => void,
  setAllEvents: (events: Event[]) => void,
  setToken: (token: string) => void
}

export const useEventsStore = create<EventsStore>((set) => ({
  currentWeekEvents: [],
  allEvents: [],
  week: new Date(),
  divisionsPerDay: 0,
  token: null,

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

  getWeeklyEvents: async (token, week) => {
    const eventsResponse = await fetchEvents(token, week)
    set(() => ({ currentWeekEvents: eventsResponse }))
  },

  getAllEvents: async () => {
    const eventsResponse = await getAllEvents()
    set(() => ({ allEvents: eventsResponse }))
  },

  insertEvent: async (event, token) => {
    await insertEventDB(event, token)
    const updatedCurrentWeekEvents = await fetchEvents(token, new Date())
    const updatedAllEvents = await getAllEvents(token)
    set(() => ({ currentWeekEvents: updatedCurrentWeekEvents, allEvents: updatedAllEvents }))
  },

  deleteEvent: async (eventID) => {
    await deleteEvent(eventID)
    set(({ currentWeekEvents, allEvents }) => {
      const updatedCurrentWeekEvents = currentWeekEvents.filter((event) => event.id !== eventID)
      const updatedAllEvents = allEvents.filter((event) => event.id !== eventID)
      return { currentWeekEvents: updatedCurrentWeekEvents, allEvents: updatedAllEvents }
    })
  },

  setAllEvents: (events) => set(() => ({ allEvents: events })),

  setToken: (token: any) => set(() => ({ token }))
}))
