import { SupabaseEventsRepository } from './supabase-events-repository'
import { Event } from './types'
import { create } from 'zustand'

interface EventsStore {
  events: Event[]
  eventsAreLoading: boolean
  getAllEvents: () => void
  insertEvent: (event: Omit<Event, 'id' | 'userId'>) => void
  deleteEvent: (eventID: string) => void
  changeEventStartTime: (newStartTime: Date, eventID: string) => void
  updateEvent: (eventID: string, updatedData: Partial<Event>) => void
}

export const useEventsStore = create<EventsStore>((set) => ({
  events: [],
  eventsAreLoading: true,
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

    await SupabaseEventsRepository.update(eventID, { startTime: newStartTime, endTime: newEndTime })
  },

  getAllEvents: async () => {
    set(() => ({ eventsAreLoading: true }))
    const eventsResponse = await SupabaseEventsRepository.getAll()
    set(() => ({ events: eventsResponse }))
    set(() => ({ eventsAreLoading: false }))
  },

  insertEvent: async (event) => {
    await SupabaseEventsRepository.create(event)
    const updatedEvents = await SupabaseEventsRepository.getAll()
    set(() => ({ events: updatedEvents }))
  },

  updateEvent: async (eventID: string, updatedData: Partial<Omit<Event, 'id' | 'userId'>>) => {
    await SupabaseEventsRepository.update(eventID, updatedData)
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

    await SupabaseEventsRepository.delete(eventID)
  }
}))
