'use client'

import { useTasksStore } from '@tasks/store'
import { Task } from '@tasks/types'
import AddDialog from '@ui/shared/components/add/add-dialog'
import { DialogType } from '@ui/shared/components/add/add-button'
import PlusIcon from '@ui/shared/components/icons/plus'
import { useEffect, useRef, useState } from 'react'
import TaskComponent from '@ui/tasks/components/task'

export default function TaskList () {
  const { tasks, getAllTasks, createTask, updateTask, deleteTask } = useTasksStore()
  const [selectedTask, setSelectedTask] = useState<Task | undefined>()
  const createDialogRef = useRef<HTMLDialogElement>(null)
  const editDialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    getAllTasks()
  }, [getAllTasks])

  const handleEditClick = (task: Task) => {
    setSelectedTask(task)
    editDialogRef.current?.showModal()
  }

  return (
    <section className='flex flex-col gap-4 p-4 h-full min-h-0'>
      <div className='flex items-center justify-between'>
        <h2 className='text-lg font-semibold opacity-80'>Your tasks</h2>
        <button
          onClick={() => createDialogRef.current?.showModal()}
          className='rounded-full bg-secondary p-2 flex justify-center items-center size-10 border hover:bg-primary transition-colors'
          aria-label='Add task'
        >
          <PlusIcon />
        </button>
      </div>

      <ul className='flex flex-col gap-2 overflow-y-auto pr-1'>
        {tasks.map(task => (
          <TaskComponent key={task.id} task={task} handleEditClick={handleEditClick} />
        ))}
        {tasks.length === 0 && (
          <li className='text-center opacity-60 py-8 border rounded-lg border-dashed'>
            No tasks yet. Add one to get started.
          </li>
        )}
      </ul>

      <AddDialog
        ref={createDialogRef}
        type={DialogType.Task}
        onSubmit={(newTask) => createTask(newTask as Omit<Task, 'id'>)}
      >
        Add Task
      </AddDialog>

      <AddDialog
        ref={editDialogRef}
        type={DialogType.Task}
        item={selectedTask}
        onSubmit={(updatedTask) => {
          if (selectedTask) {
            updateTask(selectedTask.id, updatedTask as Omit<Task, 'id'>)
          }
        }}
        onDelete={() => {
          if (selectedTask) {
            deleteTask(selectedTask.id)
          }
        }}
      >
        Edit Task
      </AddDialog>
    </section>
  )
}
