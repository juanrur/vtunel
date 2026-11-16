// State helpers for the sample week shown on the login page.
// Everything here is local demo data: nothing is read from or saved to the database.

export interface Block {
  id: string
  title: string
  kind: 'event' | 'task'
  duration: number
  day: number | null
  start: number | null
  done: boolean
  suggestion: { day: number, start: number }
}

export interface Routine {
  id: string
  title: string
  days: number[]
  start: number
  duration: number
}

export const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
export const FIRST_HOUR = 9
export const HOURS = 9

export const ROUTINES: Routine[] = [
  { id: 'class', title: 'Class', days: [0, 2, 4], start: 9, duration: 2 },
  { id: 'gym', title: 'Gym', days: [1, 3], start: 17, duration: 1 }
]

export const INITIAL_BLOCKS: Block[] = [
  { id: 'sync', title: 'Team sync', kind: 'event', duration: 1, day: 0, start: 12, done: false, suggestion: { day: 0, start: 12 } },
  { id: 'dentist', title: 'Dentist', kind: 'event', duration: 1, day: 2, start: 15, done: false, suggestion: { day: 2, start: 15 } },
  { id: 'report', title: 'Send report', kind: 'task', duration: 1, day: 3, start: 11, done: false, suggestion: { day: 3, start: 11 } },
  { id: 'study', title: 'Study session', kind: 'event', duration: 2, day: null, start: null, done: false, suggestion: { day: 1, start: 10 } },
  { id: 'lunch', title: 'Lunch with Ana', kind: 'event', duration: 1, day: null, start: null, done: false, suggestion: { day: 3, start: 13 } },
  { id: 'notes', title: 'Review notes', kind: 'task', duration: 1, day: null, start: null, done: false, suggestion: { day: 4, start: 12 } }
]

export function formatHour (hour: number) {
  return `${hour}:00`
}

function overlaps (aStart: number, aDuration: number, bStart: number, bDuration: number) {
  return aStart < bStart + bDuration && bStart < aStart + aDuration
}

function isFree (blocks: Block[], id: string, day: number, start: number, duration: number) {
  if (start < FIRST_HOUR || start + duration > FIRST_HOUR + HOURS) return false

  const hitsRoutine = ROUTINES.some(routine =>
    routine.days.includes(day) && overlaps(start, duration, routine.start, routine.duration)
  )
  const hitsBlock = blocks.some(block =>
    block.id !== id && block.day === day && block.start !== null &&
    overlaps(start, duration, block.start, block.duration)
  )

  return !hitsRoutine && !hitsBlock
}

// Closest free start hour to the one asked for, or null when the day is full.
export function findSlot (blocks: Block[], id: string, day: number, start: number, duration: number) {
  for (let offset = 0; offset < HOURS; offset++) {
    for (const candidate of [start + offset, start - offset]) {
      if (isFree(blocks, id, day, candidate, duration)) return candidate
    }
  }
  return null
}
