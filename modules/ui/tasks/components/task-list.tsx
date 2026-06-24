'use client'

import { useTasksStore } from '@tasks/store'
import { Task } from '@tasks/types'
import AddDialog from '@ui/shared/add/add-dialog'
import { DialogType } from '@ui/shared/add/add-button'
import PlusIcon from '@ui/shared/icons/plus'
import { useEffect, useRef, useState } from 'react'
import TaskComponent from '@ui/tasks/components/task'

export default function TaskList () {
  const { tasks, getAllTasks, createTask, updateTask } = useTasksStore()
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
    <section className='flex flex-col gap-4 p-4'>
      <div className='flex items-end justify-end w-full'>
        <button
          onClick={() => createDialogRef.current?.showModal()}
          className='rounded-full bg-secondary p-2 text-white flex justify-center items-center size-10'
          aria-label='Add task'
        >
          <PlusIcon />
        </button>
      </div>

      <ul className='flex flex-col gap-2'>
        {tasks.map(task => (
          <TaskComponent key={task.id} task={task} handleEditClick={handleEditClick} />
        ))}
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
      >
        Edit Task
      </AddDialog>
    </section>
  )
}
