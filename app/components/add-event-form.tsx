import { insertEvent } from '@/db/client'
import { Event } from '@/types/event-types'
import DayInput from './day-input'
import TimeInput from './time-input'

export default function AddEvent () {
  async function addEventInDB (formData: FormData) {
    'use server'
    const startDay = formData.get('start day')
    const startHour = formData.get('start hour')
    const endDay = formData.get('end day')
    const endHour = formData.get('end hour')

    const name = formData.get('name')?.toString()

    if (!name) return
    if (!startDay && !startDay && !startHour && !endDay && !endHour) return

    const event : Omit<Event, 'id'> = {
      startTime: new Date(`${startDay}T${startHour}`),
      endTime: new Date(`${endDay}T${endHour}`),
      name
    }

    insertEvent(event)
  }

  return (
    <form className='w-60' action={addEventInDB}>
      <input type='text' name='name' />
      <div>
        <div>
          <DayInput name={'Start Day'} />
          <TimeInput name='start hour' />
        </div>
        <div>
          <DayInput name={'End Day'} />
          <TimeInput name='end hour'/>
        </div>
      </div>

      <button>Guardar</button>
    </form>
  )
}
