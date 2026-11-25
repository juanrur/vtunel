'use client'

import { useEffect, useState } from 'react'
import { useApiKeysStore } from '@api-keys/store'
import CreateForm from './create-form'
import Item from './item'

export default function Developers () {
  const { keys, keysAreLoading, getAllKeys, revokeKey } = useApiKeysStore()
  const [origin, setOrigin] = useState('https://your-vtunel-url')

  useEffect(() => {
    getAllKeys()
    setOrigin(window.location.origin)
  }, [getAllKeys])

  return (
    <section className='flex flex-col gap-6 p-4 h-full min-h-0 overflow-y-auto'>
      <p className='opacity-80'>
        Create an API key to let other apps read and manage your events, tasks, templates and routines.
        Send it in the <code className='text-sm bg-secondary border rounded px-1'>X-API-Key</code> header of every request.
      </p>

      <CreateForm />

      <div className='flex flex-col gap-2'>
        <h2 className='text-lg font-semibold opacity-80'>Your API keys</h2>
        <ul className='flex flex-col gap-2'>
          {keys.map(apiKey => (
            <Item key={apiKey.id} apiKey={apiKey} onRevoke={() => revokeKey(apiKey.id)} />
          ))}
          {!keysAreLoading && keys.length === 0 && (
            <li className='text-center opacity-60 py-8 border rounded-lg border-dashed'>
              No API keys yet.
            </li>
          )}
        </ul>
      </div>

      <div className='flex flex-col gap-2'>
        <h2 className='text-lg font-semibold opacity-80'>Example</h2>
        <pre className='text-sm bg-secondary border rounded-lg p-3 overflow-x-auto'>
          {`curl -H "X-API-Key: vt_..." ${origin}/api/v1/events

# Resources: events, tasks, templates, routines
# GET /api/v1/{resource}            list (?from=&to= ISO dates)
# GET /api/v1/{resource}/{id}       get one
# POST /api/v1/{resource}           create (JSON body)
# PATCH /api/v1/{resource}/{id}     update
# DELETE /api/v1/{resource}/{id}    delete`}
        </pre>
      </div>
    </section>
  )
}
