/* eslint-disable camelcase */
import { pb, getCurrentUser } from '@shared/pocketbase/client'
import type { Event } from '@events/types'
import { CrudRepository } from '@shared/domain/crud-repository'
import { convertToLocalTime } from '@shared/utils'

const getField = (row: any, name1: string, name2: string) => row?.[name1] ?? row?.[name2] ?? null

const EventMapper = {
  toDomain (row: any): Event {
    return {
      id: row.id,
      name: getField(row, 'name', 'title'),
      startTime: convertToLocalTime(getField(row, 'startTime', 'start_time')),
      endTime: convertToLocalTime(getField(row, 'endTime', 'end_time')),
      userId: getField(row, 'user_id', 'user'),
      recurrenceType: getField(row, 'recurrenceType', 'recurrence_type') ?? 'none',
      recurrenceInterval: getField(row, 'recurrenceInterval', 'recurrence_interval') ?? 1,
      recurrenceDays: getField(row, 'recurrenceDays', 'recurrence_days') ?? null,
      recurrenceEnd: getField(row, 'recurrenceEnd', 'recurrence_end') ?? null,
      exceptionDates: getField(row, 'exceptionDates', 'exception_dates') ?? null
    }
  },
  async toRow (event: Partial<Event>): Promise<any> {
    const user = getCurrentUser()
    if (!user) throw new Error('Not authenticated')
    const row: any = { user_id: user.id }
    if (event.name !== undefined) row.name = event.name
    if (event.startTime !== undefined) row.startTime = event.startTime.toISOString()
    if (event.endTime !== undefined) row.endTime = event.endTime.toISOString()
    if (event.recurrenceType !== undefined) row.recurrence_type = event.recurrenceType
    if (event.recurrenceInterval !== undefined) row.recurrence_interval = event.recurrenceInterval
    if (event.recurrenceDays !== undefined) row.recurrence_days = event.recurrenceDays
    if (event.recurrenceEnd !== undefined) row.recurrence_end = event.recurrenceEnd
    if (event.exceptionDates !== undefined) row.exception_dates = event.exceptionDates
    return row
  }
}

export const PocketbaseEventsRepository: CrudRepository<Event> = {
  async getAll (): Promise<Event[]> {
    const user = getCurrentUser()
    if (!user) throw new Error('Not authenticated')
    const records = await pb.collection('events').getFullList({ filter: `user_id = \"${user.id}\"` })
    return records.map((r: any) => EventMapper.toDomain(r))
  },

  async create (eventData: Omit<Event, 'id'>): Promise<Event> {
    const row = await EventMapper.toRow(eventData)
    const record = await pb.collection('events').create(row)
    return EventMapper.toDomain(record)
  },

  async update (id: string, updatedData: Partial<Omit<Event, 'id' | 'userId'>>): Promise<Event> {
    const row = await EventMapper.toRow(updatedData)
    const record = await pb.collection('events').update(id, row)
    return EventMapper.toDomain(record)
  },

  async delete (id: string): Promise<void> {
    await pb.collection('events').delete(id)
  }
}
