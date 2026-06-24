import TaskList from '@ui/tasks/components/task-list'

export default function TasksPage () {
  return (
    <section className='h-full flex flex-col'>
      <h1 className='text-2xl font-bold px-4 pt-4'>Tasks</h1>
      <TaskList />
    </section>
  )
}
