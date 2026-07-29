import TrashIcon from '@ui/shared/components/icons/trash'
import { useTasksStore } from '@tasks/store'
import { Task as TaskType } from '@tasks/types'

export default function Task ({ task, handleEditClick }: { task: TaskType, handleEditClick: (task: TaskType) => void }) {
  const { updateTask, deleteTask } = useTasksStore()

  return (
    <li>
      <article className='bg-secondary flex items-center gap-3 rounded-lg border p-3 transition-colors hover:border-primary'>
        <label
          className='h-fit cursor-pointer'
          onClick={event => event.stopPropagation()}
        >
          <input
            type='checkbox'
            checked={task.done}
            onChange={(event) => updateTask(task.id, { done: event.target.checked })}
            className='peer hidden'
          />
          <div className='w-5 h-5 border rounded grid place-content-center transition-colors peer-checked:bg-green-500'>
            <svg viewBox='0 0 24 24' className='w-3.5 h-3.5 fill-primary opacity-0 peer-checked:opacity-100 transition-opacity'>
              <path d='M20.285 6.709a1 1 0 0 0-1.414-1.418l-9.192 9.205-4.192-4.205a1 1 0 0 0-1.414 1.418l5 5a1 1 0 0 0 1.414 0l10-10z' />
            </svg>
          </div>
        </label>
        <h2 className={`flex-1 ${task.done ? 'line-through opacity-60' : ''}`}>{task.title}</h2>
        <button
          onClick={() => handleEditClick(task)}
          className='px-3 py-1.5 text-sm bg-primary rounded border hover:bg-secondary transition-colors'
        >
          Edit
        </button>
        <button
          onClick={() => deleteTask(task.id)}
          className='size-8 p-1 rounded text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-colors'
          aria-label='Delete task'
        >
          <TrashIcon />
        </button>
      </article>
    </li>
  )
}
