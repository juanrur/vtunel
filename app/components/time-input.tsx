export default function TimeInput ({ name } : {name: string}) {
  const date = new Date()
  const pad = (number : number) => (number < 10 ? '0' : '') + number
  const time = `${pad(date.getHours())}:${pad(date.getMinutes())}`

  return <input
      type='time'
      id='hour'
      name={name}
      defaultValue={time}
    />
}
