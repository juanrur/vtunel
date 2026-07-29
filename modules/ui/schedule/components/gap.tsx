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
      <aside className='flex items-center justify-end relative'>
        <time className='text-zinc-500 mr-[4.5rem] text-sm'>
          {startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </time>

        <div className='bg-zinc-600 h-[200%] w-0.5 absolute top-0 left-3/4 -translate-x-1/2' />
      </aside>

      <article className='p-4 border border-dashed border-primary min-h-[82px] rounded-xl bg-secondary/50 flex flex-col justify-center'>
        <time className='text-zinc-500 text-sm'>
          {hours > 0 ? `${hours}h ` : ''}{minutes > 0 ? `${minutes}m` : ''} free
        </time>
      </article>
    </article>
  )
}
