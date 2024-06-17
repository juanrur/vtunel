import { Day } from '@/types/event-types'
import { createClient } from '@libsql/client'

const client = createClient({
  url: process.env.DATABASE_URL ?? '',
  authToken: process.env.DATABASE_TOKEN ?? ''
})

const eventsObject = await client.execute('SELECT * FROM Events;')
export const events : Day = eventsObject.rows.map((
  { id, startTime, endTime, name }) => ({
  id: Number(id),
  name: String(name),
  startTime: new Date(String(startTime)),
  endTime: new Date(String(endTime))
}))
