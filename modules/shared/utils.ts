export function convertToLocalTime (dateString?: string | null): Date {
  if (!dateString) return new Date()
  const utcDate = new Date(dateString)
  const localOffset = utcDate.getTimezoneOffset() * 60000
  return new Date(utcDate.getTime() - localOffset)
}
