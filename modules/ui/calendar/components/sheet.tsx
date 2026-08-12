'use client'

interface SheetProps {
  children: React.ReactNode
  isOpen: boolean
  onClose: () => void
}

export default function Sheet ({ children, isOpen, onClose }: SheetProps) {
  return (
    <div
      className={`fixed inset-0 z-50 bg-primary transition-transform duration-300 ease-out ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
    >
      <button
        onClick={onClose}
        className='absolute top-2 right-2 text-2xl w-8 h-8 grid place-content-center'
      >
        &times;
      </button>
      <div className='h-full overflow-y-auto p-4 pt-12'>
        {children}
      </div>
    </div>
  )
}
