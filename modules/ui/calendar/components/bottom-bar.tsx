'use client'

interface BottomBarProps {
  onOpenSheet: () => void
}

export default function BottomBar ({ onOpenSheet }: BottomBarProps) {
  return (
    <nav className='fixed bottom-5 left-20 right-20 bg-secondary rounded-xl border-t border-r border-primary flex items-center justify-around p-2 z-10 md:hidden'>
      <div className='flex-1 py-2 text-center text-sm text-zinc-500'>
        Acción 2
      </div>
      <button
        onClick={onOpenSheet}
        className='flex-1 py-2 text-center text-sm font-medium'
      >
        Items
      </button>
      <div className='flex-1 py-2 text-center text-sm text-zinc-500'>
        Acción 3
      </div>
    </nav>
  )
}
