'use client'

import TrashIcon from '@ui/shared/components/icons/trash'

interface DeleteButtonProps {
  onDelete: () => void
  close: () => void
}

export default function DeleteButton ({ onDelete, close }: DeleteButtonProps) {
  return (
    <button
      type='button'
      className='text-red-500 rounded-full size-10 border-2 border-red-500 hover:bg-red-500/20 transition-colors grid place-content-center'
      onClick={e => {
        e.stopPropagation()
        e.preventDefault()
        onDelete()
        close()
      }}
    >
      <TrashIcon />
    </button>
  )
}
