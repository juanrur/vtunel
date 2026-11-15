/* eslint-disable camelcase */
import { pb, getCurrentUser } from '@shared/pocketbase/client'
import { CrudRepository } from '@shared/domain/crud-repository'
import { convertToLocalTime } from '@shared/utils'
import type { Routine } from '@routines/types'

const RoutineMapper = {
  toDomain (row: any): Routine {
    return {
      id: row.id,
      name: row.name,
      weekdays: Array.isArray(row.weekdays) ? row.weekdays : [],
      startTime: convertToLocalTime(row.start_time),
      endTime: convertToLocalTime(row.end_time),
      // PocketBase returns '' for empty date fields
      repeatUntil: row.repeat_until ? new Date(row.repeat_until) : null,
      userId: row.user_id
    }
  },
  toRow (routine: Partial<Routine>): any {
    const user = getCurrentUser()
    if (!user) throw new Error('Not authenticated')
    const row: any = { user_id: user.id }
    if (routine.name !== undefined) row.name = routine.name
    if (routine.weekdays !== undefined) row.weekdays = routine.weekdays
    if (routine.startTime !== undefined) row.start_time = routine.startTime.toISOString()
    if (routine.endTime !== undefined) row.end_time = routine.endTime.toISOString()
    if (routine.repeatUntil !== undefined) row.repeat_until = routine.repeatUntil?.toISOString() ?? ''
    return row
  }
}

export const PocketbaseRoutinesRepository: CrudRepository<Routine> = {
  async getAll (): Promise<Routine[]> {
    const user = getCurrentUser()
    if (!user) throw new Error('Not authenticated')
    const records = await pb.collection('routines').getFullList({ filter: `user_id = "${user.id}"` })
    return records.map((r: any) => RoutineMapper.toDomain(r))
  },

  async create (routine: Omit<Routine, 'id'>): Promise<Routine> {
    const record = await pb.collection('routines').create(RoutineMapper.toRow(routine))
    return RoutineMapper.toDomain(record)
  },

  async update (id: string, routine: Partial<Omit<Routine, 'id'>>): Promise<Routine> {
    const record = await pb.collection('routines').update(id, RoutineMapper.toRow(routine))
    return RoutineMapper.toDomain(record)
  },

  async delete (id: string): Promise<void> {
    await pb.collection('routines').delete(id)
  }
}
