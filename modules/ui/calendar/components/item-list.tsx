import { useEventsStore } from '@events/store'
import TrashIcon from '@icons/trash'
import { useTasksStore } from 'modules/tasks/store'
import { useRef, createRef, RefObject } from 'react'
import type { Event } from '@events/types'
import { Task } from '@tasks/types'
import AddDialog from '@ui/shared/add/add-dialog'
import { DialogType } from '@ui/shared/add/add-button'

export default function ItemList ({ items }: { items: (Event | Task)[] }) {
  const { deleteEvent, updateEvent } = useEventsStore()
  const { deleteTask, updateTask } = useTasksStore()

  const dialogRefsMap = useRef<Map<string, RefObject<HTMLDialogElement>>>(new Map())

  const getOrCreateRef = (itemId: string) => {
    if (!dialogRefsMap.current.has(itemId)) {
      dialogRefsMap.current.set(itemId, createRef<HTMLDialogElement>())
    }
    return dialogRefsMap.current.get(itemId)!
  }

  const showEditDialog = (itemId: string) => {
    const ref = dialogRefsMap.current.get(itemId)
    ref?.current?.showModal()
  }

  return <ul className='flex flex-col gap-4'>
    {items.map((item) => {
      const isATask = 'done' in item
      return (
          <li draggable onDragStart={(event) => event.dataTransfer?.setData('text/plain', (isATask ? 'task:' : 'event:') + item.id)} onDragEnd={event => event.preventDefault()} className='border rounded-lg flex p-3 bg-secondary items-center gap-4 border-primary' key={item.id} onClick={() => showEditDialog(item.id)}>

          <AddDialog
            key={item.id + (item.startTime?.getTime() ?? '') + (item.endTime?.getTime() ?? '')}
            ref={getOrCreateRef(item.id)}
            onSubmit={(newItem) => isATask ? updateTask(item.id, newItem as Task) : updateEvent(item.id, newItem as Event)}
            item={item}
            type={isATask ? DialogType.Task : DialogType.Event}
            >
            Edit {isATask ? 'Task' : 'Event'}
          </AddDialog>

          <div className='flex justify-between items-center flex-1'>
            <div>
              <header className='flex items-center gap-2'>
                <label onClick={event => event.stopPropagation()} className="flex items-center gap-2 cursor-pointer">
                  { isATask &&
                    <>
                        <input type="checkbox" defaultChecked={item.done} onChange={(event) => updateTask(item.id, { done: event.target.checked })} className="peer hidden" />
                        <div className="w-5 h-5 border rounded peer-checked:bg-indigo-900 grid place-content-center peer-checked:*:opacity-100 transition-all">
                          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white opacity-20 peer-checked:opacity-100">
                            <path d="M20.285 6.709a1 1 0 0 0-1.414-1.418l-9.192 9.205-4.192-4.205a1 1 0 0 0-1.414 1.418l5 5a1 1 0 0 0 1.414 0l10-10z" />
                          </svg>
                        </div>
                    </>
                  }
                  <h2 className='font-medium peer-checked:line-through peer-checked:text-white/10'>{isATask ? item.title : item.name}</h2>
                </label>
              </header>

              <div className='text-sm text-zinc-500'>
                {item.startTime && item.endTime
                  ? (
                    <>
                      <span>{item.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      -
                      <span>{item.endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <br />
                      <span>{item.startTime.toLocaleDateString('es-ES', { day: 'numeric', month: 'numeric' })}</span>
                    </>
                    )
                  : <span>No date</span>}
              </div>
            </div>

            <button className='border rounded-lg w-8 h-10 grid place-content-center p-1 hover:bg-red-400 shadow' onClick={() => isATask ? deleteTask(item.id) : deleteEvent(item.id)}>
            <TrashIcon></TrashIcon>
            </button>
          </div>
        </li>
      )
    })}
  </ul>
}
