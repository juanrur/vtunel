export interface Event {
  startTime: Date
  endTime: Date
  name: string
  id: number
}

export type Day = Event[]
