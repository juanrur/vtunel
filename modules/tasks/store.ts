import { PocketbaseTaskRepository } from './pocketbase-task-repository'
import { Task } from './types'
import { create } from 'zustand'

interface TasksStore {
  tasks: Task[]
  tasksAreLoading: boolean
  getAllTasks(): Promise<Task[]>
  createTask(task: Omit<Task, 'id'>): Promise<Task>
  updateTask(id: string, newTask: Partial<Omit<Task, 'id'>>): Promise<Task>
  deleteTask(id: string): Promise<void>
  changeTaskStartTime (newStartTime: Date, taskId: string): Promise<void>
}

export const useTasksStore = create<TasksStore>((set) => ({
  tasks: [],
  tasksAreLoading: false,

  createTask: async (task) => {
    const createdTask = await PocketbaseTaskRepository.create(task)
    set((state) => ({ tasks: [...state.tasks, createdTask] }))
    return createdTask
  },

  getAllTasks: async () => {
    set({ tasksAreLoading: true })
    const tasks = await PocketbaseTaskRepository.getAll()
    set({ tasks, tasksAreLoading: false })
    return tasks
  },

  updateTask: async (id, newTask) => {
    const updatedTask = await PocketbaseTaskRepository.update(id, newTask)
    set((state) => ({
      tasks: state.tasks.map((task) => (task.id === id ? updatedTask : task))
    }))
    return updatedTask
  },

  deleteTask: async (id) => {
    await PocketbaseTaskRepository.delete(id)
    set((state) => ({ tasks: state.tasks.filter((task) => task.id !== id) }))
  },

  changeTaskStartTime: async (newStartTime: Date, taskId: string) => {
    let newEndTime

    set(({ tasks }) => {
      return {
        tasks: tasks.map((task) => {
          if (task.id === taskId) {
            newEndTime = new Date(task.endTime.getTime() + (newStartTime.getTime() - task.startTime.getTime()))
            return { ...task, startTime: newStartTime, endTime: newEndTime }
          }
          return task
        }
        )
      }
    })

    await PocketbaseTaskRepository.update(taskId, { startTime: newStartTime, endTime: newEndTime })
  }
}))
