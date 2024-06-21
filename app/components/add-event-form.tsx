export default function AddEvent () {
  async function addEventInDB (formData: FormData) {
    'use server'
  };

  const dateNow = new Date().toLocaleDateString('en-us', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <form action={addEventInDB}>
      <input type='text' />

      <label className='text-white' htmlFor='start'>Start</label>
      <input type='date' id='start' min='2018-1-1' max='2018-12-31' />

      <label className='text-white' htmlFor='end'>End</label>
      <input type='date' id='end' min='2018-12-31' max='2018-12-31' />

      <button>Guardar</button>
    </form>
  )
}
