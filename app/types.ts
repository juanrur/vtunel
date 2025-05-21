export interface Event {
  startTime: Date
  endTime: Date
  name: string
  id: string
  userId: string
}

export type Day = Event[]

export type Week = Day[]
