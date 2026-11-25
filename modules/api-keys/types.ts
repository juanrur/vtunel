// A key that lets an external app use the public API (/api/v1) on behalf of the user
export interface ApiKey {
  id: string
  name: string
  // First characters of the key ("vt_xxxxxxxx"), to recognize it. The full key is never stored
  prefix: string
  created: Date
  lastUsedAt: Date | null
}

// Only returned when the key is created: it's the only moment the full key can be seen
export interface CreatedApiKey extends ApiKey {
  key: string
}
