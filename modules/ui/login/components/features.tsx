import RepeatIcon from '@icons/repeat'

const row = 'grid gap-6 border-t border-primary py-10 md:grid-cols-12 md:gap-10 md:py-14'
const copy = 'md:col-span-5'
const visual = 'md:col-span-7'
const title = 'text-2xl font-semibold tracking-tight'
const text = 'mt-3 max-w-[46ch] leading-relaxed opacity-70'

function Thumbnail ({ label, children }: { label: string, children: React.ReactNode }) {
  return (
    <figure className='flex-1'>
      <div className='h-28 rounded-lg border border-primary bg-secondary p-2'>{children}</div>
      <figcaption className='mt-2 text-sm opacity-70'>{label}</figcaption>
    </figure>
  )
}

function Views () {
  const weekBlocks = ['mt-2 h-6', 'mt-8 h-4', 'mt-4 h-8', 'mt-10 h-5', 'mt-1 h-5']
  const busyDays = [3, 9, 10, 17, 22, 26]

  return (
    <div className='flex gap-3' aria-hidden='true'>
      <Thumbnail label='Day'>
        <div className='flex h-full flex-col gap-1.5'>
          <span className='h-7 rounded bg-indigo-500/80' />
          <span className='h-4 rounded border border-dashed border-primary' />
          <span className='h-9 rounded bg-indigo-500/40' />
        </div>
      </Thumbnail>
      <Thumbnail label='Week'>
        <div className='grid h-full grid-cols-5 gap-1'>
          {weekBlocks.map((block, index) => (
            <span key={index} className='border-l border-primary pl-0.5'>
              <span className={`block rounded-sm bg-indigo-500/70 ${block}`} />
            </span>
          ))}
        </div>
      </Thumbnail>
      <Thumbnail label='Month'>
        <div className='grid h-full grid-cols-7 grid-rows-4 gap-1'>
          {Array.from({ length: 28 }, (_, index) => (
            <span key={index} className={`rounded-sm ${busyDays.includes(index) ? 'bg-indigo-500/70' : 'bg-primary'}`} />
          ))}
        </div>
      </Thumbnail>
    </div>
  )
}

function Agenda () {
  const item = 'rounded-xl border border-primary px-4 py-3'

  return (
    <ul className='flex max-w-md flex-col gap-2 text-sm' aria-hidden='true'>
      <li className='grid grid-cols-[3.5rem_1fr] items-center gap-3'>
        <span className='opacity-60'>9:00</span>
        <div className={`${item} bg-secondary`}><p className='font-medium'>Class</p><p className='opacity-60'>2h</p></div>
      </li>
      <li className='grid grid-cols-[3.5rem_1fr] items-center gap-3 opacity-70'>
        <span className='opacity-60'>11:00</span>
        <div className={`${item} border-dashed`}><p className='opacity-70'>1h 30m free</p></div>
      </li>
      <li className='grid grid-cols-[3.5rem_1fr] items-center gap-3'>
        <span className='opacity-60'>12:30</span>
        <div className={`${item} bg-secondary`}><p className='font-medium'>Lunch with Ana</p><p className='opacity-60'>1h</p></div>
      </li>
    </ul>
  )
}

function Checklist () {
  const tasks = [
    { name: 'Send report', done: true },
    { name: 'Review notes', done: false },
    { name: 'Book train tickets', done: false }
  ]

  return (
    <ul className='flex max-w-md flex-col gap-2 text-sm' aria-hidden='true'>
      {tasks.map(task => (
        <li key={task.name} className='flex items-center gap-3 rounded-xl border border-primary bg-secondary px-4 py-3'>
          <span className={`grid size-5 shrink-0 place-content-center rounded border border-primary ${task.done ? 'bg-indigo-600 dark:bg-indigo-500' : ''}`}>
            {task.done && (
              <svg viewBox='0 0 24 24' className='size-4 fill-white'>
                <path d='M20.285 6.709a1 1 0 0 0-1.414-1.418l-9.192 9.205-4.192-4.205a1 1 0 0 0-1.414 1.418l5 5a1 1 0 0 0 1.414 0l10-10z' />
              </svg>
            )}
          </span>
          <span className={task.done ? 'line-through opacity-50' : 'font-medium'}>{task.name}</span>
        </li>
      ))}
    </ul>
  )
}

function Weekly () {
  const letters = ['M', 'T', 'W', 'T', 'F']
  const routines = [
    { name: 'Class', time: '9:00 to 11:00', days: [0, 2, 4] },
    { name: 'Gym', time: '17:00 to 18:00', days: [1, 3] }
  ]

  return (
    <ul className='flex max-w-md flex-col gap-2 text-sm' aria-hidden='true'>
      {routines.map(routine => (
        <li key={routine.name} className='flex items-center gap-3 rounded-xl border border-dashed border-primary px-4 py-3'>
          <RepeatIcon className='size-4 shrink-0 opacity-60' />
          <div className='min-w-0 flex-1'>
            <p className='font-medium'>{routine.name}</p>
            <p className='opacity-60'>{routine.time}</p>
          </div>
          <div className='flex gap-1'>
            {letters.map((letter, index) => (
              <span
                key={index}
                className={`grid size-6 place-content-center rounded-full text-[11px] ${routine.days.includes(index) ? 'bg-indigo-600 text-white dark:bg-indigo-400 dark:text-[#18171c]' : 'border border-primary opacity-50'}`}
              >
                {letter}
              </span>
            ))}
          </div>
        </li>
      ))}
    </ul>
  )
}

export default function Features () {
  return (
    <section aria-labelledby='features-title' className='mx-auto w-full max-w-6xl px-4 pt-16 sm:px-6 md:pt-24'>
      <h2 id='features-title' className='max-w-[18ch] pb-10 text-3xl font-semibold tracking-tight text-balance sm:text-4xl md:pb-14'>
        Four pages that all look at the same week
      </h2>

      <div className={row}>
        <div className={copy}>
          <h3 className={title}>Calendar</h3>
          <p className={text}>
            See one day, the whole week or the month. Drag an event to another hour or another day and it moves there.
          </p>
        </div>
        <div className={visual}><Views /></div>
      </div>

      <div className={row}>
        <div className={copy}>
          <h3 className={title}>Schedule</h3>
          <p className={text}>
            Today as a list, in order, with the free time between things spelled out. Double-click a gap to put something in it.
          </p>
        </div>
        <div className={visual}><Agenda /></div>
      </div>

      <div className={row}>
        <div className={copy}>
          <h3 className={title}>Tasks</h3>
          <p className={text}>
            Things to do, with a box to tick. Give a task a time and it sits on the calendar next to your events.
          </p>
        </div>
        <div className={visual}><Checklist /></div>
      </div>

      <div className={row}>
        <div className={copy}>
          <h3 className={title}>Routines</h3>
          <p className={text}>
            Add your classes, work or gym hours once. They show up every week, so you only plan what changes.
          </p>
        </div>
        <div className={visual}><Weekly /></div>
      </div>
    </section>
  )
}
