/* eslint-disable camelcase */
import { supabase } from '@shared/supabase/client'
import type { Event } from '@events/types'
import { CrudRepository } from '@shared/domain/crud-repository'
import { convertToLocalTime } from '@shared/utils'

export const SupabaseEventsRepository: CrudRepository<Event> = {
  async getAll (): Promise<Event[]> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('user_id', user?.id)

    if (error) console.error('Error fetching all events:', error)

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
  },

  async create ({ startTime, endTime, name, recurrenceType, recurrenceInterval, recurrenceDays, recurrenceEnd, exceptionDates }: Omit<Event, 'id'>): Promise<Event> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')
    const payload: any = {
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      name,
      user_id: user?.id,
      recurrence_type: recurrenceType ?? 'none',
      recurrence_interval: recurrenceInterval ?? 1,
      recurrence_days: recurrenceDays ?? null,
      recurrence_end: recurrenceEnd ?? null,
      exception_dates: exceptionDates ?? null
    }

    const { data, error } = await supabase
      .from('events')
      .insert([payload])
      .select()

    if (error) {
      console.error('Error inserting event:', error)
      throw new Error('Failed to create event')
    }

    // TODO: esto hay que mapearlo
    return {
      ...data[0]
    }
  },

  async update (id: string, updatedData: Partial<Omit<Event, 'id' | 'userId'>>): Promise<Event> {
    const { data, error } = await supabase
      .from('events')
      .update({
        ...updatedData,
        startTime: updatedData.startTime ? updatedData.startTime.toISOString() : undefined,
        endTime: updatedData.endTime ? updatedData.endTime.toISOString() : undefined
      })
      .eq('id', id)
      .select()

    if (error) {
      console.error('Error updating event:', error)
      throw new Error('Failed to update event')
    }

    // TODO: esto hay que mapearlo
    return {
      ...data[0]
    }
  },

  async delete (id: string): Promise<void> {
    const { data, error } = await supabase
      .from('events')
      .delete()
      .eq('id', id)
      .select()

    if (error) {
      console.error('Error deleting event:', error)
      throw new Error('Failed to delete event')
    }

    return {
      ...data[0]
    }
  }
}
