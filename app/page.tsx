import Week from '@/components/week'
import AddEvent from '@/components/add-event-form'

export const fetchCache = 'force-no-store'

export default function Home () {
  return (
    <div>
      <AddEvent />
      <Week />
    </div>
  )
}
