import { useEventsStore } from '@/store'
import Day from '@/components/calendar/day/view'
import { getWeekStartEndDates } from '@/utils'
import { type Week as WeekType, type Event } from '@/types'

export default function Week ({ events }: {events: Event[]}) {
  const {
    day
  } = useEventsStore()

  const { startOfWeek, endOfWeek } = getWeekStartEndDates(day)

  const weekEvents : WeekType = Array.from({ length: 7 }, () => [])

  events.filter((event) => {
    const eventDate = new Date(event.startTime)
    return eventDate >= startOfWeek && eventDate <= endOfWeek
  }).forEach((event) => {
    const day = (event.startTime.getDay() || 7) - 1
    weekEvents[day].push(event)
  })

  const weekdays = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
  ] as const

  function getWeekDays (dateInput: Date | string) {
    const date = new Date(dateInput)
    const day = date.getDay() // 0 (domingo) a 6 (sábado)

    // Ajustar para que el lunes sea el primer día
    const diffToMonday = (day === 0 ? -6 : 1) - day

    const monday = new Date(date)
    monday.setDate(date.getDate() + diffToMonday)

    const daysOfWeek = []
    for (let i = 0; i < 7; i++) {
      const current = new Date(monday)
      current.setDate(monday.getDate() + i)
      daysOfWeek.push(current.getDate())
    }

    return daysOfWeek
  }

  const weekDayNumbers = getWeekDays(day)

  return (
    <div className='flex flex-col'>
      <header className='text-center grid grid-cols-7 pb-3 flex-shrink-0'>
        {
          weekdays.map((dayNumber, idx) => {
            const today = new Date()
            const className =
              weekDayNumbers[idx] === today.getDate() &&
              day.getMonth() === today.getMonth() &&
              day.getFullYear() === today.getFullYear()
                ? 'rounded-full bg-secondary flex flex-col mx-auto px-4'
                : ''

            return (
              <div className={className} key={idx}>
                <h2>{weekDayNumbers[idx]}</h2>
                <p>{dayNumber}</p>
              </div>
            )
          })
        }
      </header>

      <section className={'min-h-0 grid grid-cols-7 overflow-auto flex-1'}>
        {weekEvents.map((day, idx) =>
          <Day key={idx} dayIndex={idx} events={day} />
        )}
      </section>
    </div>
  )
}
