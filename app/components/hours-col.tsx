import { pad } from '@/utils'

export default function HoursCol () {
  const FifteenMinutePX = 60

  function getHours (splitPerMinutes: number) {
    const hours = []
    let currentHour = 0
    let currentMinutes = 0

    while (currentHour < 24) {
      hours[hours.length] = pad(currentHour) + ':' + pad(currentMinutes)

      if (currentMinutes + splitPerMinutes >= 60) {
        currentMinutes = currentMinutes + splitPerMinutes - 60
        currentHour++
      } else {
        currentMinutes += splitPerMinutes
      }
    }

    return hours
  }

  return <ul className='tabular-nums text-right pr-4'>
    {getHours(15).map(v =>
      <li style={{ height: FifteenMinutePX + 'px' }} key={v}>
        {v}
      </li>
    )}
  </ul>
}
