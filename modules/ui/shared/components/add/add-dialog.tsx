import React, { forwardRef, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import type { Event } from '@events/types'
import EventForm from '@ui/shared/components/add/event-form'
import { Task } from '@tasks/types'
import { Template } from 'modules/templates/types'
import TemplateForm from '@ui/shared/components/add/template-form'
import TaskForm from './task-form'
import RoutineForm from './routine-form'
import { DialogType } from './add-button'
import type { Routine } from '@routines/types'

export type AddDialogData = Omit<Task, 'id'> | Omit<Event, 'id'> | Omit<Template, 'id'> | Omit<Routine, 'id'>

interface AddDialogProps {
  children: React.ReactNode
  item?: Task | Event | Template | Routine
  type: DialogType
  onSubmit: (data: AddDialogData) => void
  onDelete?: () => void
}

const AddDialog = forwardRef<HTMLDialogElement, AddDialogProps>(
  function AddDialog ({ children, item, type, onSubmit, onDelete }, ref) {
    const closeDialog = () => (ref as React.RefObject<HTMLDialogElement>)?.current?.close()

    // The dialog is usually declared inside the item that opens it. It's rendered in document.body (portal)
    // so in the DOM it isn't a child of that item: it doesn't inherit its styles (cursor, font size, truncate...)
    // and, if the item is draggable, selecting text inside the dialog doesn't start dragging the item.
    // document.body only exists in the browser, so the portal is created after mounting.
    const [container, setContainer] = useState<HTMLElement | null>(null)
    useEffect(() => setContainer(document.body), [])
    if (!container) return null

    return createPortal(
      // React events still bubble through the portal to the item, so they're stopped here
      // to not reach its onClick / onDoubleClick / onDragStart
      <dialog
        onClick={event => event.stopPropagation()}
        onDoubleClick={event => event.stopPropagation()}
        onDragStart={event => event.stopPropagation()}
        className='bg-primary border rounded-xl p-5 shadow-lg top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 relative overflow-visible'
        ref={ref}
      >
        <h2 className='text-2xl font-bold mb-4 text-white capitalize'>{children}</h2>
        {
          type === DialogType.Event &&
          <EventForm
            close={closeDialog}
            onSubmit={onSubmit}
            onDelete={onDelete}
            event={item as Event}
          />
        }
        {
          type === DialogType.Task &&
          <TaskForm
            close={closeDialog}
            onSubmit={onSubmit}
            onDelete={onDelete}
            task={item as Task}
          />
        }
        {
          type === DialogType.Template &&
          <TemplateForm
            close={closeDialog}
            onSubmit={onSubmit}
            onDelete={onDelete}
            template={item as Template}
          />
        }
        {
          type === DialogType.Routine &&
          <RoutineForm
            // Needed so the form fields reset when the same dialog is opened for another routine
            key={item?.id ?? 'new'}
            close={closeDialog}
            onSubmit={onSubmit}
            onDelete={onDelete}
            routine={item as Routine}
          />
        }
      </dialog>,
      container
    )
  }
)

export default AddDialog
