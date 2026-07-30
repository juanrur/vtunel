interface TimeLabelProps {
  time: Date
}

export default function TimeLabel ({ time }: TimeLabelProps) {
  return (
    <aside className='flex items-start -translate-y-3 justify-end'>
      <time className='text-zinc-400 text-sm'>
        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
      </time>
    </aside>
  )
}
