import type { ApiKey } from '@api-keys/types'
import TrashIcon from '@icons/trash'

const formatDate = (date: Date) => date.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })

export default function Item ({ apiKey, onRevoke }: { apiKey: ApiKey, onRevoke: () => void }) {
  const handleRevoke = () => {
    if (window.confirm(`Revoke "${apiKey.name}"? Apps using it will stop working.`)) onRevoke()
  }

  return (
    <li>
      <article className='bg-secondary flex items-center gap-3 rounded-lg border p-3 transition-colors hover:border-primary'>
        <div className='flex-1 min-w-0'>
          <h3 className='truncate'>{apiKey.name}</h3>
          <p className='text-sm text-zinc-400 tabular-nums'>
            <code>{apiKey.prefix}…</code> · Created {formatDate(apiKey.created)} · {apiKey.lastUsedAt ? `Last used ${formatDate(apiKey.lastUsedAt)}` : 'Never used'}
          </p>
        </div>
        <button
          onClick={handleRevoke}
          className='size-8 p-1 rounded text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-colors'
          aria-label={`Revoke ${apiKey.name}`}
          title='Revoke'
        >
          <TrashIcon />
        </button>
      </article>
    </li>
  )
}
