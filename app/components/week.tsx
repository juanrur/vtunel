import { getEvents } from "@/db/client"
import { Week } from "@/types/event-types"
import Day from "@components/day"

export default async function week () {
  const events = await getEvents()
  const week : Week = Array.from({length:7}, () => [])
  events.forEach((event) => {
    const day = event.startTime.getDay()
    week[day].push(event)
  })

  return <ul className="grid grid-cols-7">
    {week.map((day, idx) => 
      <li key={idx}>
        <Day events={day} />
      </li>
    )}
  </ul>
}