import { Template } from 'modules/templates/types'

interface UpdateDroppedItemParams {
  type: string,
  id: string,
  newDate: Date,
  template: Template | undefined,
  changeEventStartTime: (newDate: Date, id: string) => void,
  insertEvent: (event: any) => void,
  changeTaskStartTime: (newDate: Date, id: string) => void
}

export function updateDroppedItem ({
  type,
  id,
  newDate,
  template,
  changeEventStartTime,
  insertEvent,
  changeTaskStartTime
}: UpdateDroppedItemParams
) {
  console.log(type)
  if (type === 'event') {
    changeEventStartTime(newDate, id)
  }

  if (type === 'template') {
    if (!template) return
    insertEvent({
      name: template.title,
      startTime: newDate,
      endTime: new Date(newDate.getTime() + template.duration * 60 * 1000),
      recurrenceType: null,
      recurrenceInterval: null,
      recurrenceDays: null,
      recurrenceEnd: null,
      exceptionDates: null
    })
  }

  if (type === 'task') {
    changeTaskStartTime(newDate, id)
  }
}
