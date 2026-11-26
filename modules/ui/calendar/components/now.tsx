'use client'
import { useEffect, useState } from 'react'
import { useSettingsStore } from '@ui/calendar/settings/store'

// Line that marks the current time inside the column of today
export default function Now () {
  const { pixelsPerMinute } = useSettingsStore()
  const [now, setNow] = useState(() => new Date())

  // Moves the line every minute, waiting first for the next minute to start so it stays exact
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>
    const timeout = setTimeout(() => {
      setNow(new Date())
      interval = setInterval(() => setNow(new Date()), 60 * 1000)
    }, (60 - new Date().getSeconds()) * 1000)

    return () => {
      clearTimeout(timeout)
      clearInterval(interval)
    }
  }, [])

  const minutes = now.getHours() * 60 + now.getMinutes()

  return <div
    aria-label={`Now, ${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`}
    className='pointer-events-none absolute inset-x-0 z-50 h-0.5 -translate-y-1/2 bg-red-500/70'
    style={{ top: minutes * pixelsPerMinute }}>
    <span className='absolute -left-1.5 top-1/2 size-3 -translate-y-1/2 rounded-full bg-red-500/70' />
  </div>
}
