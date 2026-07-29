'use client'
import { useRef, useState } from 'react'
import PlusIcon from '@ui/shared/components/icons/plus'
import { useEventsStore } from '@events/store'
import AddDialog from '@ui/shared/components/add/add-dialog'
import { useTasksStore } from '@tasks/store'
import { Task } from '@tasks/types'
import { Event } from '@events/types'
import { useTemplatesStore } from '@templates/store'
import { Template } from '@templates/types'

export enum DialogType {
  Task = 'task',
  Event = 'event',
  Template = 'template'
}

export default function AddButton () {
  const [isSelectOpen, setIsSelectOpen] = useState(false)
  const [type, setType] = useState<DialogType>()
  const dialogRef = useRef<HTMLDialogElement>(null)

  const handleClick = () => {
    if (isSelectOpen) {
      setIsSelectOpen(false)
    } else {
      setIsSelectOpen(true)
    }
  }

  dialogRef.current?.addEventListener('close', () => {
    setType(undefined)
  })

  function handleOptionClick (option: DialogType) {
    setType(option)
    dialogRef.current?.showModal()
    setIsSelectOpen(false)
  }

  return (
    <div className='relative'>
      <button
        onClick={handleClick}
        className="text-3xl rounded-full text-white p-1 flex justify-center items-center size-10"
      >
        {isSelectOpen ? '-' : <PlusIcon />}
      </button>

      { isSelectOpen &&
        <ul className='absolute flex flex-col top-full bg-secondary [&_button]:border-none border rounded *:p-2 *:border'>
          <li className='hover:bg-primary *:hover:bg-primary *:transition-none transition-all'><button onClick={() => handleOptionClick(DialogType.Event)}>Add Event</button></li>
          <li className='hover:bg-primary *:hover:bg-primary *:transition-none transition-all'><button onClick={() => handleOptionClick(DialogType.Task)}>Add Task</button></li>
          <li className='hover:bg-primary *:hover:bg-primary *:transition-none transition-all'><button onClick={() => handleOptionClick(DialogType.Template)}>Add Template</button></li>
        </ul>
      }
      <AddDialog
        ref={dialogRef}
        onSubmit={(newItem) => {
          if (type === DialogType.Event) {
            useEventsStore.getState().insertEvent(newItem as Omit<Event, 'id'>)
          } else if (type === DialogType.Task) {
            useTasksStore.getState().createTask(newItem as Omit<Task, 'id'>)
          } else if (type === DialogType.Template) {
            useTemplatesStore.getState().createTemplate(newItem as Omit<Template, 'id'>)
          }
        }}
        type={type!}>
        Add {type}
      </AddDialog>
    </div>
  )
}
