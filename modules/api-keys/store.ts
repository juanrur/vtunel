import { create } from 'zustand'
import { PocketbaseApiKeysRepository } from './pocketbase-api-keys-repository'
import type { ApiKey, CreatedApiKey } from './types'

interface ApiKeysStore {
  keys: ApiKey[]
  keysAreLoading: boolean
  getAllKeys: () => Promise<void>
  // Returns the created key with its plain value, that is shown only once
  createKey: (name: string) => Promise<CreatedApiKey>
  revokeKey: (id: string) => Promise<void>
}

export const useApiKeysStore = create<ApiKeysStore>((set) => ({
  keys: [],
  keysAreLoading: true,

  getAllKeys: async () => {
    set({ keysAreLoading: true })
    const keys = await PocketbaseApiKeysRepository.getAll()
    set({ keys, keysAreLoading: false })
  },

  createKey: async (name) => {
    const created = await PocketbaseApiKeysRepository.create(name)
    const { key, ...apiKey } = created
    set(({ keys }) => ({ keys: [apiKey, ...keys] }))
    return created
  },

  revokeKey: async (id) => {
    set(({ keys }) => ({ keys: keys.filter(key => key.id !== id) }))
    await PocketbaseApiKeysRepository.delete(id)
  }
}))
