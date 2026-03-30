export default function ViewSettings () {
  return <div className="text-black [&>div>label]:text-white flex">
    <div>
      <label htmlFor="pixelsPerMinute">Pixels per minute:</label>
      <input type='number' name='pixelsPerMinute'></input>
    </div>
    <div>
      <label htmlFor="minutesPerDivided">Minutes per division:</label>
      <input type='number' name='minutesPerDivided'/>
    </div>
  </div>
}
