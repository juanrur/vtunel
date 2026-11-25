import { pb } from '@shared/pocketbase/client'
import type { ApiKey, CreatedApiKey } from '@api-keys/types'

// Talks with the routes of db/pb_hooks/api_keys.pb.js. pb.send adds the session token of the user.
// It doesn't implement CrudRepository: keys can't be updated and create returns the plain key

const ApiKeyMapper = {
  toDomain (row: any): ApiKey {
    return {
      id: row.id,
      name: row.name,
      prefix: row.prefix,
      created: new Date(row.created),
      lastUsedAt: row.lastUsedAt ? new Date(row.lastUsedAt) : null
    }
  }
}

export const PocketbaseApiKeysRepository = {
  async getAll (): Promise<ApiKey[]> {
    const rows = await pb.send('/api/v1/keys', { method: 'GET' })
    return rows.map((row: any) => ApiKeyMapper.toDomain(row))
  },

  async create (name: string): Promise<CreatedApiKey> {
    const row = await pb.send('/api/v1/keys', { method: 'POST', body: { name } })
    return { ...ApiKeyMapper.toDomain(row), key: row.key }
  },

  async delete (id: string): Promise<void> {
    await pb.send(`/api/v1/keys/${id}`, { method: 'DELETE' })
  }
}
