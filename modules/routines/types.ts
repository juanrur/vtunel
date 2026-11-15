export interface Routine {
  id: string
  name: string
  weekdays: number[]
  startTime: Date
  endTime: Date
  // Last day the routine repeats (e.g. end of a semester). null means it never ends
  repeatUntil: Date | null
  userId: string
}

// One concrete day of a routine, built on the client to draw it in the calendar. It isn't stored
export interface RoutineOccurrence {
  id: string
  routineId: string
  name: string
  startTime: Date
  endTime: Date
  allDay: false
}
