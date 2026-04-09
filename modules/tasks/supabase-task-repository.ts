import { CrudRepository } from '@shared/domain/crud-repository'
import { Task } from './types'
import { supabase } from '@shared/supabase/client'
import { convertToLocalTime } from '@shared/utils'

type TaskRow = {
  id: string
  title: string
  user_id: string
  start_time: string
  end_time: string
  done: boolean
}

export const SupabaseTaskRepository : CrudRepository<Task> = {
  async getAll (): Promise<Task[]> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user.id) as { data: TaskRow[], error: Error | null }

    if (error) throw new Error(error.message)

    return data.map(TaskMapper.toDomain)
  },
  async create (task: Omit<Task, 'id'>): Promise<Task> {
    const taskRow = await TaskMapper.toRow(task)
    const { data, error } = await supabase
      .from('tasks')
      .insert(taskRow)
      .select('*')
      .single() as { data: TaskRow, error: Error | null }
    if (error) throw new Error(error.message)
    return TaskMapper.toDomain(data)
  },
  async update (id: string, newTask: Partial<Omit<Task, 'id'>>): Promise<Task> {
    const taskRow = await TaskMapper.toRow(newTask)
    const { data, error } = await supabase
      .from('tasks')
      .update(taskRow)
      .eq('id', id)
      .select('*')
      .single() as { data: TaskRow, error: Error | null }
    if (error) throw new Error(error.message)
    return TaskMapper.toDomain(data)
  },
  async delete (id: string): Promise<void> {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)
    if (error) throw new Error(error.message)
  }
}

const TaskMapper = {
  toDomain (row: TaskRow): Task {
    return {
      id: row.id,
      title: row.title,
      startTime: convertToLocalTime(row.start_time),
      endTime: convertToLocalTime(row.end_time),
      done: row.done
    }
  },
  async toRow (task: Partial<Task>): Promise<TaskRow> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')
    const userId = user.id
    return {
      ...task,
      end_time: task.endTime?.toISOString(),
      start_time: task.startTime?.toISOString(),
      user_id: userId
    } as TaskRow
  }
}
