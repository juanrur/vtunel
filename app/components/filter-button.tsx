import { Filter } from '@/components/aside'

export default function FilterButton ({ value, filterState, onClick }: { value: Filter, filterState: Filter, onClick: (value: Filter) => void }) {
  const isActive = value === filterState

  return (
    <button
      className='text-center items-center rounded p-1 px-2 uppercase font-semibold text-sm'
      style={isActive ? { border: '1px solid var(--border-color)' } : { }}
      onClick={() => onClick(value)}
    >
      {value}
    </button>
  )
}
