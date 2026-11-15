import Arrow from '@ui/shared/components/icons/arrow'

export default function ChangeViewDateButton ({
  action, rotate = false
}: {
  action: () => void, rotate?: boolean
}) {
  return <button
        className='border rounded-full size-fit p-1 self-center justify-self-center'
        onClick={action}
      >
        <Arrow className={rotate ? 'rotate-180' : ''}/>
      </button>
}
