import TrashIcon from '@icons/trash'
import { useTasksStore } from '@tasks/store'
import { Task as TaskType } from '@tasks/types'

export default function Task ({ task, handleEditClick }: { task: TaskType, handleEditClick: (task: TaskType) => void }) {
  const { updateTask, deleteTask } = useTasksStore()

  return (
    <li>
      <article className='bg-zinc-600 flex items-center gap-2 overflow-hidden py-1 px-1.5 rounded-r border-2 border-[var(--background-color)] text-white'>
        <label
          className='mt-0.5 h-fit cursor-pointer'
          onClick={event => event.stopPropagation()}
        >
          <input
            type='checkbox'
            checked={task.done}
            onChange={(event) => updateTask(task.id, { done: event.target.checked })}
            className='peer hidden'
          />
          <div className='w-5 h-5 border rounded peer-checked:bg-indigo-900 grid place-content-center peer-checked:*:opacity-100 transition-all'>
            <svg viewBox='0 0 24 24' className='w-4 h-4 fill-white opacity-20 peer-checked:opacity-100'>
              <path d='M20.285 6.709a1 1 0 0 0-1.414-1.418l-9.192 9.205-4.192-4.205a1 1 0 0 0-1.414 1.418l5 5a1 1 0 0 0 1.414 0l10-10z' />
            </svg>
          </div>
        </label>
        <h2 className={`flex-1 ${task.done ? 'line-through opacity-60' : ''}`}>{task.title}</h2>
        <button
          onClick={() => handleEditClick(task)}
          className='px-2 py-1 text-sm bg-primary rounded border hover:bg-zinc-700'
        >
          Edit
        </button>
        <button
          onClick={() => deleteTask(task.id)}
          className='size-8 p-1 text-red-400 hover:text-red-300'
          aria-label='Delete task'
        >
          <TrashIcon />
        </button>
      </article>
    </li>
  )
}
