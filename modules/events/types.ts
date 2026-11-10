export interface Event {
  startTime: Date
  endTime: Date
  allDay: boolean
  name: string
  id: string
  userId: string
  recurrenceType: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly' | null
  recurrenceInterval: number | null
  recurrenceDays: string | null
  recurrenceEnd: string | null
  exceptionDates: string | null
}
