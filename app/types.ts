export interface Event {
  startTime: Date
  endTime: Date
  name: string
  id: string
}

export type Day = Event[]

export type Week = Day[]
