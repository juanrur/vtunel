'use client'

interface DrawerProps {
  children: React.ReactNode
  isOpen: boolean
  onClose: () => void
}

export default function Drawer ({ children, isOpen, onClose }: DrawerProps) {
  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-200 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
    >
      <div className='absolute inset-0 bg-black/50' onClick={onClose} />
      <div
        className={`absolute top-0 right-0 h-full w-4/5 bg-primary border-l border-primary p-6 flex flex-col transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className='flex justify-between items-center mb-8'>
          <span className='text-xl font-bold'>Menu</span>
          <button
            onClick={onClose}
            className='text-2xl w-8 h-8 grid place-content-center'
          >
            &times;
          </button>
        </div>
        <div className='flex flex-col gap-4'>
          {children}
        </div>
      </div>
    </div>
  )
}
