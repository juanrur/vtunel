export default function TimeInput ({ name, delay = 0 } : {name: string, delay?: number}) {
  const date = new Date()
  date.setMinutes(date.getMinutes() + delay)
  const pad = (number : number) => (number < 10 ? '0' : '') + number
  const time = `${pad(date.getHours())}:${pad(Number(date.getMinutes()))}`

  return <input
    type='time'
    id='hour'
    name={name}
    defaultValue={time}
  />
}
