export function convertToLocalTime (dateString?: string | null): Date {
  if (!dateString) return new Date()
  return new Date(dateString)
}

// Needed because the calendar used to only compare the start day: an item lasting several days
// (a trip from the 10th to the 12th) has to show up on every day it covers, not only on the first one.
export function occursOnDay (item: { startTime: Date | null, endTime: Date | null }, date: Date): boolean {
  if (!item.startTime || !item.endTime) return false
  const dayStart = new Date(date)
  dayStart.setHours(0, 0, 0, 0)
  const dayEnd = new Date(date)
  dayEnd.setHours(23, 59, 59, 999)
  if (item.startTime > dayEnd) return false
  return item.endTime > dayStart || item.startTime >= dayStart
}
