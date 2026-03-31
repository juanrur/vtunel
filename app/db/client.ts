
import { Event } from '@/types'
import { getWeekStartEndDates } from '@/utils'
import { supabase } from './supabase-client'

export async function getAllEvents (): Promise<Event[]> {
  
}

export async function fetchEvents (week: Date = new Date()): Promise<Event[]> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  const { startOfWeek, endOfWeek } = getWeekStartEndDates(week)

  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('user_id', user?.id)
    .gte('startTime', startOfWeek.toISOString())
    .lte('startTime', endOfWeek.toISOString())

  if (error) console.error('Error fetching events:', error)

  console.log('Fetched events:', data)

  if (data) {
    return data.map<Event>(({ id, startTime, endTime, name, user_id, recurrenceType, recurrenceInterval, recurrenceDays, recurrenceEnd, exceptionDates }) => (
      {
        id,
        name,
        startTime: convertToLocalTime(startTime),
        endTime: convertToLocalTime(endTime),
        userId: user_id,
        recurrenceType: recurrenceType ?? 'none',
        recurrenceInterval: recurrenceInterval ?? 1,
        recurrenceDays: recurrenceDays ?? null,
        recurrenceEnd: recurrenceEnd ?? null,
        exceptionDates: exceptionDates ?? null
      }
    ))
  } else return []
}

export async function insertEvent ({ startTime, endTime, name, recurrenceType, recurrenceInterval, recurrenceDays, recurrenceEnd, exceptionDates } : Omit<Event, 'id' | 'userId'>) {

  console.log(startTime.toISOString(), endTime.toISOString(), endTime.toString())

  if (error) {
    console.error('Error inserting event:', error)
  } else {
    console.log('Inserted event:', data)
  }
}

export async function deleteEvent (eventID: string) {
  console.log('Deleting event with ID:', eventID)
  
  if (error) {
    console.error('Error deleting event:', error)
  }

  console.log('Deleted event:', data)
}

export async function updateEvent (eventID: string, updatedData: Partial<Omit<Event, 'id' | 'userId'>>) {
  
}


