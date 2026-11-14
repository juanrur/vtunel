'use client'
import '@/remove-scrollbar.module.css'
import ItemsList from './items-list'

export type { Filter } from './items-list'

export default function Aside () {
  return <aside className='h-full flex flex-col gap-6 p-6 pr-0 overflow-hidden size-100'>
    <ItemsList />
  </aside>
}
