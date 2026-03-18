import { create } from 'zustand'
import { deleteEvent, getAllEvents, insertEvent as insertEventDB, updateEvent } from './db/client'
import { Event } from './types'

interface EventsStore {
  events: Event[]
  eventsAreLoading: boolean
  day: Date
  view: 'day' | 'week' | 'month'
  divisionsPerDay: number
  token: string | null
  pixelsPerMinute: number
  minutesPerDivided: number
  setView: (view: 'day' | 'week' | 'month') => void
  changeDivisionsPerDay: (number: number) => void
  changeEventStartTime: (newStartTime: Date, eventID: string) => void
  increaseView: () => void
  decreaseView: () => void
  getAllEvents: (token: string) => void
  insertEvent: (event: Omit<Event, 'id' | 'userId'>, token: string) => void
  deleteEvent: (eventID: string) => void,
  setToken: (token: string) => void
  updateEvent: (eventID: string, updatedData: Partial<Event>) => void
}

export const useEventsStore = create<EventsStore>((set) => ({
  events: [],
  eventsAreLoading: true,
  day: new Date(),
  divisionsPerDay: 0,
  token: null,
  pixelsPerMinute: 1,
  minutesPerDivided: 60,
  view: 'week',

  setView: (view: 'day' | 'week' | 'month') => set(() => ({ view })),

  changeDivisionsPerDay: (number: number) => set(() => ({ divisionsPerDay: number })),

  changeEventStartTime: async (newStartTime: Date, eventID: string) => {
    let newEndTime

    set(({ events }) => {
      return {
        events: events.map((event) => {
          if (event.id === eventID) {
            newEndTime = new Date(event.endTime.getTime() + (newStartTime.getTime() - event.startTime.getTime()))
            return { ...event, startTime: newStartTime, endTime: newEndTime }
          }
          return event
        }
        )
      }
    })

    await updateEvent(eventID, { startTime: newStartTime, endTime: newEndTime })
  },

  increaseView: () => set((state) => {
    const newDate = new Date(state.day)
    const views = {
      month: () => {
        newDate.setMonth(state.day.getMonth() + 1)
      },
      week: () => {
        newDate.setDate(state.day.getDate() + 7)
      },
      day: () => {
        newDate.setDate(state.day.getDate() + 1)
      }
    }
    views[state.view]()
    return { day: newDate }
  }),

  decreaseView: () => set((state) => {
    const newDate = new Date(state.day)
    const views = {
      month: () => {
        newDate.setMonth(state.day.getMonth() - 1)
      },
      week: () => {
        newDate.setDate(state.day.getDate() - 7)
      },
      day: () => {
        newDate.setDate(state.day.getDate() - 1)
      }
    }
    views[state.view]()
    return { day: newDate }
  }),

  getAllEvents: async (token) => {
    set(() => ({ eventsAreLoading: true }))
    const eventsResponse = await getAllEvents(token)
    set(() => ({ events: eventsResponse }))
    set(() => ({ eventsAreLoading: false }))
  },

  insertEvent: async (event, token) => {
    await insertEventDB(event, token)
    const updatedEvents = await getAllEvents(token)
    set(() => ({ events: updatedEvents }))
  },

  updateEvent: async (eventID: string, updatedData: Partial<Event>) => {
    await updateEvent(eventID, updatedData)
    set(({ events }) => {
      return {
        events: events.map((event) => {
          if (event.id === eventID) {
            return { ...event, ...updatedData }
          }
          return event
        })
      }
    })
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
