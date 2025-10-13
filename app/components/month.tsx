'use client'
import { useEventsStore } from '@/store'

export default function Month () {
  const { day } = useEventsStore()

  function getDaysInMonth (year: number, month: number) {
    return new Date(year, month + 1, 0).getDate()
  }

  function getDaysInMonthArray (year: number, month: number) {
    const daysInLastMonth = getDaysInMonth(year, month - 1)
    const daysInMonth = getDaysInMonth(year, month)
    const remainingDays = Math.round((35 - daysInMonth) / 2)
    const daysArray = []
    let daysInMonthCounter = 0
    let remainingDaysCounter = remainingDays
    let daysInNextMonthCounter = 1

    for (let idx = 0; idx <= 35; idx++) {
      if (idx < remainingDays) {
        daysArray.push(daysInLastMonth - remainingDaysCounter + 1)
        remainingDaysCounter--
      } else if (daysInMonthCounter >= daysInMonth) {
        daysArray.push(daysInNextMonthCounter)
        daysInNextMonthCounter++
      } else if (idx > remainingDays) {
        daysArray.push(daysInMonthCounter + 1)
        daysInMonthCounter++
      }
    }

    return daysArray
  }

  const dayNumbers = getDaysInMonthArray(day.getFullYear(), day.getMonth())

  return <section className="h-full">
    <ul className="h-full grid grid-cols-7 grid-rows-5 p-1">
      {dayNumbers.map((day, idx) => (
        <li key={idx}
        className="border border-primary flex items-center justify-center"
        >
          {day}
        </li>
      ))}
    </ul>
  </section>
}
