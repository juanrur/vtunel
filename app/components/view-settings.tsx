import { useEventsStore } from '@/store'

export default function ViewSettings () {
  const { pixelsPerMinute, minutesPerDivided, setMinutesPerDivision, setPixelsPerMinute } = useEventsStore()
  return <div className="text-black [&>div>label]:text-white flex text-sm [&_input]:w-12 [&_input]:font-bold [&_input]:text-center gap-4 *:space-x-1">
    <div>
      <label htmlFor="pixelsPerMinute">Pixels per minute:</label>
      <input type='number' name='pixelsPerMinute' value={pixelsPerMinute} min={0.1} step={0.5} onChange={(e) => setPixelsPerMinute(Number(e.target.value))} />
    </div>
    <div>
      <label htmlFor="minutesPerDivided">Minutes per division:</label>
      <input type='number' name='minutesPerDivided' value={minutesPerDivided} min={5} onChange={(e) => setMinutesPerDivision(Number(e.target.value))} />
    </div>
  </div>
}
