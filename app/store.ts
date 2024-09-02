import { create } from 'zustand'
import { fetchEvents } from './db/client'

const store = create((set) => {
  events: [],
  getWeeklyEvents: (week) => {
    set(() => )fetchEvents(week)
  }  
})
