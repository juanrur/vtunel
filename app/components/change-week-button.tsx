import Arrow from '@icons/arrow'

export default function ChangeWeekButton ({
  action, rotate = false
}: {
  action: () => void, rotate?: boolean
}) {
  return <button
        className='border-2 rounded-full size-fit p-2 self-center justify-self-center'
        onClick={action}
      >
        <Arrow className={rotate ? 'rotate-180' : ''}/>
      </button>
}
