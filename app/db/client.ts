/* eslint-disable camelcase */
'use server'
import { Day, Event } from '@/types'
import { revalidatePath } from 'next/cache'
import { createClient } from '@supabase/supabase-js'
import { getWeekStartEndDates } from '@/utils'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL ?? '', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '')

export async function getAllEvents (token: string): Promise<Day> {
  const user = await supabase.auth.getUser(token)
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('user_id', user.data.user?.id)

  if (error) console.error('Error fetching all events:', error)

  if (data) {
    return data.map<Event>(({ id, startTime, endTime, name, user_id }) => (
      {
        id,
        name,
        startTime: convertToLocalTime(startTime),
        endTime: convertToLocalTime(endTime),
        userId: user_id
      }
    ))
  } else return []
}

export async function fetchEvents (token: string, week: Date = new Date()): Promise<Event[]> {
  const user = await supabase.auth.getUser(token)
  const { startOfWeek, endOfWeek } = getWeekStartEndDates(week)

  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('user_id', user.data.user?.id)
    .gte('startTime', startOfWeek.toISOString())
    .lte('startTime', endOfWeek.toISOString())

  if (error) console.error('Error fetching events:', error)

  console.log('Fetched events:', data)

  if (data) {
    return data.map<Event>(({ id, startTime, endTime, name, user_id }) => (
      {
        id,
        name,
        startTime: convertToLocalTime(startTime),
        endTime: convertToLocalTime(endTime),
        userId: user_id
      }
    ))
  } else return []
}

export async function insertEvent ({ startTime, endTime, name } : Omit<Event, 'id' | 'userId'>, token: string) {
  const user = await supabase.auth.getUser(token)
  const { data, error } = await supabase
    .from('events')
    .insert([
      {
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        name,
        user_id: user.data.user?.id
      }
    ])
    .select()

  console.log(startTime.toISOString(), endTime.toISOString(), endTime.toString())

  if (error) {
    console.error('Error inserting event:', error)
  } else {
    console.log('Inserted event:', data)
  }

  revalidatePath('/')
}

export async function deleteEvent (eventID: string) {
  console.log('Deleting event with ID:', eventID)
  const { data, error } = await supabase
    .from('events')
    .delete()
    .eq('id', eventID)
    .select()

  if (error) {
    console.error('Error deleting event:', error)
  }

  console.log('Deleted event:', data)

  revalidatePath('/')
}

export async function updateEvent (eventID: string, updatedData: Partial<Omit<Event, 'id' | 'userId'>>) {
  const { data, error } = await supabase
    .from('events')
    .update({
      ...updatedData,
      startTime: updatedData.startTime?.toISOString(),
      endTime: updatedData.endTime?.toISOString()
    })
    .eq('id', eventID)
    .select()
  console.log('Updated data:', updatedData)
  console.log('Event ID:', eventID)
  if (error) {
    console.error('Error updating event:', error)
  } else {
    console.log('Updated event:', data)
  }

  revalidatePath('/')
}

function convertToLocalTime (dateString: string): Date {
  const utcDate = new Date(dateString)
  const localOffset = utcDate.getTimezoneOffset() * 60000
  return new Date(utcDate.getTime() - localOffset)
}
