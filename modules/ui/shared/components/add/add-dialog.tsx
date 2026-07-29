import React, { forwardRef } from 'react'
import type { Event } from '@events/types'
import EventForm from '@ui/shared/components/add/event-form'
import { Task } from '@tasks/types'
import { Template } from 'modules/templates/types'
import TemplateForm from '@ui/shared/components/add/template-form'
import TaskForm from './task-form'
import { DialogType } from './add-button'

interface AddDialogProps {
  children: React.ReactNode
  item?: Task | Event | Template
  type: DialogType
  onSubmit: (data: Omit<Task, 'id'> | Omit<Event, 'id'> | Omit<Template, 'id'>) => void
}

const AddDialog = forwardRef<HTMLDialogElement, AddDialogProps>(
  function AddDialog ({ children, item, type, onSubmit }, ref) {
    return (
      <dialog
        className='bg-primary border-2 rounded-lg p-4 shadow-lg top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 relative'
        ref={ref}
      >
        <h2 className='text-2xl font-bold mb-4 text-white capitalize'>{children}</h2>
        {
          type === DialogType.Event &&
          <EventForm
          close={() => (ref as React.RefObject<HTMLDialogElement>)?.current?.close()}
          onSubmit={onSubmit}
          event={item as Event} />
        }
        {
          type === DialogType.Task &&
          <TaskForm
            close={() => (ref as React.RefObject<HTMLDialogElement>)?.current?.close()}
            onSubmit={onSubmit}
            task={item as Task}
          />
        }
        {
          type === DialogType.Template &&
          <TemplateForm
            close={() => (ref as React.RefObject<HTMLDialogElement>)?.current?.close()}
            onSubmit={onSubmit}
            template={item as Template}
          />
        }
      </dialog>
    )
  }
)

export default AddDialog
