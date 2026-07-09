import TaskList from '@ui/tasks/components/task-list'
import React from 'react'

export default function TasksPage () {
  return (
    <section className='h-full flex flex-col max-w-3xl mx-auto w-full'>
      <h1 className='text-2xl font-bold px-4 pt-4'>Tasks</h1>
      <TaskList />
    </section>
  )
}
