import type { Routine, RoutineOccurrence } from './types'

// Monday first, as in the week view
export const WEEKDAYS = [
  { value: 1, short: 'Mon', name: 'Monday' },
  { value: 2, short: 'Tue', name: 'Tuesday' },
  { value: 3, short: 'Wed', name: 'Wednesday' },
  { value: 4, short: 'Thu', name: 'Thursday' },
  { value: 5, short: 'Fri', name: 'Friday' },
  { value: 6, short: 'Sat', name: 'Saturday' },
  { value: 0, short: 'Sun', name: 'Sunday' }
] as const

const DAY_MS = 24 * 60 * 60 * 1000

export const minutesOfDay = (date: Date) => date.getHours() * 60 + date.getMinutes()

const startOfDay = (date: Date) => {
  const day = new Date(date)
  day.setHours(0, 0, 0, 0)
  return day
}

export function isRoutineOccurrence (item: object): item is RoutineOccurrence {
  return 'routineId' in item
}

// Needed because routines are stored once but have to be drawn on every day they repeat:
// builds the occurrences of all the routines between two dates (both included)
export function getRoutineOccurrences (routines: Routine[], from: Date, to: Date): RoutineOccurrence[] {
  const occurrences: RoutineOccurrence[] = []
  const last = startOfDay(to)

  for (const routine of routines) {
    const duration = routine.endTime.getTime() - routine.startTime.getTime()
    const firstDay = startOfDay(routine.startTime)
    const lastDay = routine.repeatUntil ? startOfDay(routine.repeatUntil) : null

    // Starts as many days earlier as the routine lasts, so one that crosses midnight
    // also shows its end on the first day of the range
    const day = startOfDay(from)
    day.setDate(day.getDate() - Math.ceil(duration / DAY_MS))

    for (; day <= last; day.setDate(day.getDate() + 1)) {
      if (day < firstDay || (lastDay && day > lastDay)) continue
      if (!routine.weekdays.includes(day.getDay())) continue

      // The hour is copied from startTime instead of adding whole days in ms, so it doesn't move with daylight saving
      const startTime = new Date(day)
      startTime.setHours(routine.startTime.getHours(), routine.startTime.getMinutes(), 0, 0)
      const endTime = new Date(startTime.getTime() + duration)

      occurrences.push({
        id: `${routine.id}:${day.toDateString()}`,
        routineId: routine.id,
        name: routine.name,
        startTime,
        endTime,
        allDay: false
      })
    }
  }

  return occurrences
}
