import { SupabaseTaskRepository } from './supabase-task-repository'
import { Task } from './types'
import { create } from 'zustand'

interface TasksStore {
  tasks: Task[]
  tasksAreLoading: boolean
  getAllTasks(): Promise<Task[]>
  createTask(task: Omit<Task, 'id'>): Promise<Task>
  updateTask(id: string, newTask: Partial<Omit<Task, 'id'>>): Promise<Task>
  deleteTask(id: string): Promise<void>
}

export const useTasksStore = create<TasksStore>((set) => ({
  tasks: [],
  tasksAreLoading: false,

  createTask: async (task) => {
    const createdTask = await SupabaseTaskRepository.create(task)
    set((state) => ({ tasks: [...state.tasks, createdTask] }))
    return createdTask
  },

  getAllTasks: async () => {
    set({ tasksAreLoading: true })
    const tasks = await SupabaseTaskRepository.getAll()
    set({ tasks, tasksAreLoading: false })
    return tasks
  },

  updateTask: async (id, newTask) => {
    const updatedTask = await SupabaseTaskRepository.update(id, newTask)
    set((state) => ({
      tasks: state.tasks.map((task) => (task.id === id ? updatedTask : task))
    }))
    return updatedTask
  },

  deleteTask: async (id) => {
    await SupabaseTaskRepository.delete(id)
    set((state) => ({ tasks: state.tasks.filter((task) => task.id !== id) }))
  }
}))
