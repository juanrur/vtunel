import { Day, Event } from '@/types/event-types'
import { createClient } from '@libsql/client'

const client = createClient({
  url: 'libsql://vtunel-events-system-juanr-12.turso.io',
  authToken: process.env.DATABASE_TOKEN ?? ''
})

export async function getEvents (): Promise<Day> {
  const eventsResponde = await client.execute('SELECT * FROM Events;')
  return eventsResponde.rows.map<Event>((
    { id, startTime, endTime, name }) => ({
    id: Number(id),
    name: String(name),
    startTime: new Date(String(startTime)),
    endTime: new Date(String(endTime))
  }))
}

export async function insertEvent ({ startTime, endTime, name } : Omit<Event, 'id'>) {
  await client.execute({
    sql: 'INSERT INTO Events (startTime, endTime, name) VALUES ($startTime, $endTime, $name);',
    args: {
      startTime: convertDateToSqlDate(startTime),
      endTime: convertDateToSqlDate(endTime),
      name
    }
  })
  console.log('se ha subido')
}

function convertDateToSqlDate (date : Date) {
  const pad = (number : number) => (number < 10 ? '0' : '') + number

  const year = date.getFullYear()
  const month = pad(date.getMonth() + 1)
  const day = pad(date.getDate())
  const hours = pad(date.getHours())
  const minutes = pad(date.getMinutes())
  const seconds = pad(date.getSeconds())

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}
