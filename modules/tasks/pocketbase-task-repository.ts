import { CrudRepository } from '@shared/domain/crud-repository'
import { Task } from './types'
import { pb, getCurrentUser } from '@shared/pocketbase/client'
import { convertToLocalTime } from '@shared/utils'

const TaskMapper = {
  toDomain (r: any): Task {
    return {
      id: r.id,
      title: r.title,
      startTime: convertToLocalTime(r.start_time ?? r.startTime),
      endTime: convertToLocalTime(r.end_time ?? r.endTime),
      done: r.done
    }
  },
  async toRow (task: Partial<Task>): Promise<Partial<any>> {
    const currentUser = getCurrentUser()
    if (!currentUser) throw new Error('Not authenticated')
    const row: any = { user_id: currentUser.id }
    if (task.title !== undefined) row.title = task.title
    if (task.done !== undefined) row.done = task.done
    if (task.startTime !== undefined) row.start_time = task.startTime.toISOString()
    if (task.endTime !== undefined) row.end_time = task.endTime.toISOString()
    return row
  }
}

export const PocketbaseTaskRepository: CrudRepository<Task> = {
  async getAll (): Promise<Task[]> {
    const user = getCurrentUser()
    if (!user) throw new Error('Not authenticated')

    const records = await pb.collection('tasks').getFullList({ filter: `user_id = \"${user.id}\"` })
    return records.map((r: any) => TaskMapper.toDomain(r))
  },
  async create (task: Omit<Task, 'id'>): Promise<Task> {
    const row = await TaskMapper.toRow(task)
    const record = await pb.collection('tasks').create(row)
    return TaskMapper.toDomain(record)
  },
  async update (id: string, newTask: Partial<Omit<Task, 'id'>>): Promise<Task> {
    const row = await TaskMapper.toRow(newTask as Partial<Task>)
    const record = await pb.collection('tasks').update(id, row)
    return TaskMapper.toDomain(record)
  },
  async delete (id: string): Promise<void> {
    await pb.collection('tasks').delete(id)
  }
}
