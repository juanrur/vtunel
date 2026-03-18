export interface Event {
  startTime: Date
  endTime: Date
  name: string
  id: string
  userId: string
  recurrenceType: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly'
  recurrenceInterval: number
  recurrenceDays: string | null
  recurrenceEnd: string | null
  exceptionDates: string | null
}

export type Day = Event[]

export type Week = Day[]
