import { create } from 'zustand'
import { deleteEvent, getAllEvents, insertEvent as insertEventDB, updateEvent } from './db/client'
import { Event } from './types'

interface EventsStore {
  // events
  events: Event[]
  eventsAreLoading: boolean
  getAllEvents: () => void
  insertEvent: (event: Omit<Event, 'id' | 'userId'>) => void
  deleteEvent: (eventID: string) => void,

  // maybe should be rethink, maybe should be more generic like updateEventTime or something
  changeEventStartTime: (newStartTime: Date, eventID: string) => void
  updateEvent: (eventID: string, updatedData: Partial<Event>) => void

  // bad name
  day: Date
  increaseView: () => void
  decreaseView: () => void

  // view
  view: 'day' | 'week' | 'month'
  setView: (view: 'day' | 'week' | 'month') => void

  // settings
  divisionsPerDay: number
  changeDivisionsPerDay: (number: number) => void
  pixelsPerMinute: number
  setPixelsPerMinute: (number: number) => void
  minutesPerDivided: number // change to minutesPerDivision
  setMinutesPerDivision: (number: number) => void
}

export const useEventsStore = create<EventsStore>((set) => ({
  events: [],
  eventsAreLoading: true,
  day: new Date(),
  divisionsPerDay: 0,
  pixelsPerMinute: 2,
  setPixelsPerMinute: (number: number) => set(() => ({ pixelsPerMinute: number })),
  minutesPerDivided: 60,
  setMinutesPerDivision: (number: number) => set(() => ({ minutesPerDivided: number })),
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

  getAllEvents: async () => {
    set(() => ({ eventsAreLoading: true }))
    const eventsResponse = await getAllEvents()
    set(() => ({ events: eventsResponse }))
    set(() => ({ eventsAreLoading: false }))
  },

  insertEvent: async (event) => {
    await insertEventDB(event)
    const updatedEvents = await getAllEvents()
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
  }
}))
