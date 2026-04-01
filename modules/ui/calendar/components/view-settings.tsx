import { useSettingsStore } from '../settings/store'

export default function ViewSettings () {
  const { pixelsPerMinute, minutesPerDivision, setMinutesPerDivision, setPixelsPerMinute } = useSettingsStore()
  return <div className="text-black [&>div>label]:text-white flex text-sm [&_input]:w-12 [&_input]:font-bold [&_input]:text-center gap-4 *:space-x-1">
    <div>
      <label htmlFor="pixelsPerMinute">Pixels per minute:</label>
      <input type='number' name='pixelsPerMinute' value={pixelsPerMinute} min={0.1} step={0.5} onChange={(e) => setPixelsPerMinute(Number(e.target.value))} />
    </div>
    <div>
      <label htmlFor="minutesPerDivision">Minutes per division:</label>
      <input type='number' name='minutesPerDivision' value={minutesPerDivision} min={5} onChange={(e) => setMinutesPerDivision(Number(e.target.value))} />
    </div>
  </div>
}
