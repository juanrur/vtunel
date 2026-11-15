import { Event } from '@events/types'
import { Task } from '@tasks/types'
import type { RoutineOccurrence } from '@routines/types'

export type CalendarItem = Event | Task | RoutineOccurrence

export type Day = CalendarItem[]

export type Week = Day[]
