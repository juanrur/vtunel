export default function DayInput ({ name } : {name: string}) {
  return <>
    <label className='block' htmlFor='date'>{name}</label>
    <input
      type='date'
      id='date'
      name={name.toLowerCase()}
      defaultValue={new Date().toISOString().slice(0, 10)}
    />
  </>
}
