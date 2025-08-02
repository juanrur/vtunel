import { useEventsStore } from '@/store'

export default function HoursCol () {
  const { pixelsPerMinute, minutesPerDivided } = useEventsStore()

  function getHours (splitPerMinutes: number) {
    const hours = []
    let currentHour = 0
    let currentMinutes = 0

    while (currentHour < 24) {
      hours[hours.length] = currentHour + ':' + currentMinutes.toString().padStart(2, '0')

      if (currentMinutes + splitPerMinutes >= 60) {
        currentMinutes = currentMinutes + splitPerMinutes - 60
        currentHour++
      } else {
        currentMinutes += splitPerMinutes
      }
    }

    return hours
  }

  return <ul className='tabular-nums text-right pr-4 -translate-y-2'>
    {getHours(minutesPerDivided).map(v =>
      <li className="text-zinc-500 font-semibold text-sm" style={{ height: pixelsPerMinute * minutesPerDivided + 'px' }} key={v}>
        {v}
      </li>
    )}
  </ul>
}
