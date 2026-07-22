import Day from '@ui/calendar/components/views/day'
import { getWeekStartEndDates } from '@/utils'
import { type Event } from '@events/types'
import type { Week as WeekType } from '@ui/calendar/types'
import { useViewStore } from '../../store'
import { Task } from '@tasks/types'

export default function Week ({ items }: { items: (Event | Task)[] }) {
  const {
    viewDate
  } = useViewStore()

  const { startOfWeek, endOfWeek } = getWeekStartEndDates(viewDate)

  const weekItems : WeekType = Array.from({ length: 7 }, () => [])

  items.filter((item) => {
    if (!item.startTime) return false
    const itemDate = new Date(item.startTime)
    return itemDate >= startOfWeek && itemDate <= endOfWeek
  }).forEach((item) => {
    if (!item.startTime) return
    const day = (item.startTime.getDay() || 7) - 1
    weekItems[day].push(item)
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

  const weekDayNumbers = getWeekDays(viewDate)

  return (
    <div className='flex flex-col'>
      <header className='text-center grid grid-cols-7 pb-3 flex-shrink-0'>
        {
          weekdays.map((dayNumber, idx) => {
            const today = new Date()
            const className =
              weekDayNumbers[idx] === today.getDate() &&
              viewDate.getMonth() === today.getMonth() &&
              viewDate.getFullYear() === today.getFullYear()
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
        {weekItems.map((day, idx) =>
          <Day key={idx} dayIndex={idx} items={day} />
        )}
      </section>
    </div>
  )
}
