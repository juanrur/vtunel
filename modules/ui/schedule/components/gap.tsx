import TimeLabel from './time-label'

interface GapProps {
  startTime: Date
  endTime: Date
}

export default function Gap ({ startTime, endTime }: GapProps) {
  const diffMs = endTime.getTime() - startTime.getTime()
  const diffMinutes = Math.floor(diffMs / 60000)
  const hours = Math.floor(diffMinutes / 60)
  const minutes = diffMinutes % 60

  return (
    <article className='grid grid-cols-[25%_1fr] gap-4 opacity-60'>
      <TimeLabel time={startTime} />

      <article className='p-4 border border-dashed border-primary min-h-[82px] rounded-xl bg-secondary/50 flex flex-col justify-center'>
        <time className='text-zinc-500 text-sm'>
          {hours > 0 ? `${hours}h ` : ''}{minutes > 0 ? `${minutes}m` : ''} free
        </time>
      </article>
    </article>
  )
}
