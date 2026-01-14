'use client'
import { useEventsStore } from '@/store'
import { Event } from '@/types'
import DayInput from '@/components/day-input'
import TimeInput from '@/components/time-input'
import { useRef } from 'react'

export default function AddEvent () {
  const { insertEvent, token } = useEventsStore()
  const formRef = useRef<HTMLFormElement>(null)

  async function addEventInDB (formData: FormData) {
    const startDay = formData.get('start day')
    const startHour = formData.get('start hour')
    const endDay = formData.get('end day')
    const endHour = formData.get('end hour')

    const name = formData.get('name')?.toString()

    if (!name) return
    if (!startDay && !startDay && !startHour && !endDay && !endHour) return

    // TODO: convert to proper Event type
    const event : any = {
      startTime: new Date(`${startDay}T${startHour}`),
      endTime: new Date(`${endDay}T${endHour}`),
      name
    }

    if (token) insertEvent(event, token)
    formRef.current?.reset()
  }

  return (
    <form className='w-72 text-black' ref={formRef} action={addEventInDB}>
      <input type='text' name='name' />
      <div>
        <div>
          <DayInput name={'Start Day'} />
          <TimeInput name='start hour' />
        </div>
        <div>
          <DayInput name={'End Day'} />
          <TimeInput name='end hour' delay={15}/>
        </div>
      </div>

      <button>Guardar</button>
    </form>
  )
}
