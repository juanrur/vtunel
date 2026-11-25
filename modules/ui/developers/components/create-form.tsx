'use client'

import { useState, type FormEvent } from 'react'
import { useApiKeysStore } from '@api-keys/store'
import PlusIcon from '@icons/plus'

export default function CreateForm () {
  const createKey = useApiKeysStore(state => state.createKey)
  const [name, setName] = useState('')
  const [newKey, setNewKey] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!name.trim()) return
    setError(null)
    try {
      const created = await createKey(name.trim())
      setNewKey(created.key)
      setCopied(false)
      setName('')
    } catch {
      setError('The key could not be created. Try again.')
    }
  }

  const handleCopy = async () => {
    if (!newKey) return
    await navigator.clipboard.writeText(newKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className='flex flex-col gap-3'>
      <form onSubmit={handleSubmit} className='flex gap-2'>
        <input
          value={name}
          onChange={event => setName(event.target.value)}
          placeholder='App name, e.g. My Android app'
          maxLength={100}
          className='flex-1 min-w-0 rounded-lg border bg-secondary px-3 py-2'
          aria-label='API key name'
        />
        <button
          type='submit'
          className='flex items-center gap-2 rounded-lg border bg-secondary px-3 py-2 text-sm font-medium hover:bg-primary transition-colors'
        >
          <PlusIcon />
          Create key
        </button>
      </form>

      {error && <p className='text-sm text-red-400'>{error}</p>}

      {newKey && (
        <div className='flex flex-col gap-2 rounded-lg border border-l-4 border-l-amber-400 bg-secondary p-3'>
          <p className='text-sm'>Copy your new key now. It won&apos;t be shown again.</p>
          <div className='flex gap-2'>
            <code className='flex-1 min-w-0 truncate rounded border bg-primary px-2 py-1.5 text-sm'>{newKey}</code>
            <button
              type='button'
              onClick={handleCopy}
              className='px-3 py-1.5 text-sm bg-primary rounded border hover:bg-secondary transition-colors'
            >
              {copied ? 'Copied' : 'Copy'}
            </button>
            <button
              type='button'
              onClick={() => setNewKey(null)}
              className='px-3 py-1.5 text-sm rounded border hover:bg-primary transition-colors'
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
