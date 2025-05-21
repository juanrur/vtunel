/* eslint-disable camelcase */
'use server'
import { Day, Event } from '@/types'
import { revalidatePath } from 'next/cache'
import { createClient } from '@supabase/supabase-js'

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
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        userId: user_id
      }
    ))
  } else return []
}

export async function fetchEvents (token: string, week: Date = new Date()): Promise<Event[]> {
  const user = await supabase.auth.getUser(token)
  // Calcular el inicio de la semana (lunes) y el final de la semana (domingo)
  const dayOfWeek = week.getDay() // 0 (domingo) a 6 (sábado)
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek // Ajustar para que lunes sea el primer día
  const startOfWeek = new Date(week)
  startOfWeek.setDate(week.getDate() + diffToMonday) // Mover al lunes

  const endOfWeek = new Date(startOfWeek)
  endOfWeek.setDate(startOfWeek.getDate() + 6) // Mover al domingo

  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('user_id', user.data.user?.id)
    .gte('startTime', startOfWeek.toISOString()) // Mayor o igual al lunes
    .lte('startTime', endOfWeek.toISOString()) // Menor o igual al domingo

  if (error) console.error('Error fetching events:', error)

  console.log('Fetched events:', data)

  if (data) {
    return data.map<Event>(({ id, startTime, endTime, name, user_id }) => (
      {
        id,
        name,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
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
