'use client'

interface CloseButtonProps {
  close: () => void
}

export default function CloseButton ({ close }: CloseButtonProps) {
  return (
    <button
      type='button'
      className='text-white rounded-full size-10 border-2'
      onClick={event => {
        event.stopPropagation()
        event.preventDefault()
        close()
      }}
    >
      X
    </button>
  )
}
