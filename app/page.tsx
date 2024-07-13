import Day from '@/components/day'
import AddEvent from '@/components/add-event-form'

export const fetchCache = 'force-no-store'

export default function Home () {
  return (
    <div>
      <AddEvent />
      <Day />
    </div>
  )
}
