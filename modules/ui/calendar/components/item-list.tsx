import { useEventsStore } from '@events/store'
import TrashIcon from '@icons/trash'
import { useTasksStore } from 'modules/tasks/store'
import { useRef } from 'react'
import type { Event } from '@events/types'
import { Task } from '@tasks/types'

export default function ItemList ({ items }: { items: (Event | Task)[] }) {
  const { deleteEvent, updateEvent } = useEventsStore()
  const { deleteTask, updateTask } = useTasksStore()

  const EventEditDialog = useRef<HTMLDialogElement>(null)

  const showEditDialog = () => {
    if (EventEditDialog.current) {
      EventEditDialog.current.showModal()
    }
  }

  return <ul className='flex flex-col gap-4'>
    {items.map((item) => {
      const isATask = 'done' in item
      return (
          <li draggable onDragStart={(event) => event.dataTransfer?.setData('text/plain', (isATask ? 'task:' : 'event:') + item.id)} onDragEnd={event => event.preventDefault()} className='border rounded-lg flex p-3 bg-secondary items-center gap-4 border-primary' key={item.id} onClick={showEditDialog}>

          {/* <EventDialog
            key={event.id + event.startTime.getTime() + event.endTime.getTime()} // fuerza remount si cambian los datos
            ref={EventEditDialog}
            onSubmit={(newEvent) => updateEvent(event.id, newEvent)}
            event={event}>
            Edit Event
          </EventDialog> */}

          <div className='flex justify-between items-center flex-1'>
            <div>
              <header className='flex items-center gap-2'>
                <label className="flex items-center gap-2 cursor-pointer">
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
                <span>{item.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                -
                <span>{item.endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                <br />
                <span>{item.startTime.toLocaleDateString('es-ES', { day: 'numeric', month: 'numeric' })}</span>
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
