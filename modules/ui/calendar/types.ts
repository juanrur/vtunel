import { Event } from '@events/types'
import { Task } from '@tasks/types'

export type Day = (Event | Task)[]

export type Week = Day[]
