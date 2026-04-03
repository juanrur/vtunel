'use client'
import { useViewStore } from '../store'

export default function ChangeView () {
  const { setView } = useViewStore()

  function handleChangeView (event: any) {
    const selectedView = event.target.value
    setView(selectedView)
  }

  return <select className="bg-secondary rounded border p-1" onChange={handleChangeView} name="" id="">
    <option value="month">month</option>
    <option value="week">week</option>
    <option value="day">day</option>
  </select>
}
