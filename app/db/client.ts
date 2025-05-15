'use server'
import { Day, Event } from '@/types'
import { revalidatePath } from 'next/cache'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL ?? '', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '')

export async function getAllEvents (): Promise<Day> {
  const { data, error } = await supabase
    .from('events')
    .select('*')

  if (error) console.error('Error fetching events:', error)

  if (data) {
    return data.map<Event>(({ id, startTime, endTime, name }) => (
      {
        id,
        name,
        startTime: new Date(startTime),
        endTime: new Date(endTime)
      }
    ))
  } else return []
}

export async function fetchEvents (token: string, week: string | Date = 'now'): Promise<Event[]> {
  const user = await supabase.auth.getUser(token)
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('user_id', user.data.user?.id)

  if (error) console.error('Error fetching events:', error)

  if (data) {
    return data.map<Event>(({ id, startTime, endTime, name }) => (
      {
        id,
        name,
        startTime: new Date(startTime),
        endTime: new Date(endTime)
      }
    ))
  } else return []
}

export async function insertEvent ({ startTime, endTime, name } : Omit<Event, 'id'>) {
  const { data, error } = await supabase
    .from('events')
    .insert([
      {
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        name
      }
    ])
    .select()

  if (error) {
    console.error('Error inserting event:', error)
  } else {
    console.log('Inserted event:', data)
  }

  revalidatePath('/')
}
