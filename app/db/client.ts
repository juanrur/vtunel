'use server'
import { Day, Event } from '@/types'
import { createClient } from '@libsql/client'
import { revalidatePath } from 'next/cache'

const client = createClient({
  url: 'libsql://vtunel-events-system-juanr-12.turso.io',
  authToken: process.env.DATABASE_TOKEN ?? ''
})

export async function getAllEvents (): Promise<Day> {
  const eventsResponse = await client.execute('SELECT * FROM Events;')
  return eventsResponse.rows.map<Event>((
    { id, startTime, endTime, name }) => ({
    id: String(id),
    name: String(name),
    startTime: new Date(String(startTime)),
    endTime: new Date(String(endTime))
  }))
}

export async function fetchEvents (week : string|Date = 'now'): Promise<Event[]> {
  // try {
  //   const eventsResponse = await client.execute({
  //     sql: "SELECT * FROM Events WHERE STRFTIME('%Y', startTime) = '2024' AND STRFTIME('%W', startTime) = STRFTIME('%W', ?);",
  //     args: [typeof week === 'string' ? week : convertDateToSqlDate(week)]
  //   })

  //   return eventsResponse.rows.map<Event>((
  //     { id, startTime, endTime, name }) => ({
  //     id: String(id),
  //     name: String(name),
  //     startTime: new Date(String(startTime)),
  //     endTime: new Date(String(endTime))
  //   }))
  // } catch (error) {
  //   throw new Error('error' + error)
  // }
  console.log('fetchEvnts', week)
  const date = new Date()
  date.setHours(2, 0, 0, 0)

  const endDate = new Date(date)
  endDate.setMinutes(endDate.getMinutes() + 30)

  return [
    {
      id: '123124125',
      name: 'ejemplo sin wifi',
      startTime: date,
      endTime: endDate
    }
  ]
}

export async function insertEvent ({ startTime, endTime, name } : Omit<Event, 'id'>) {
  await client.execute({
    sql: 'INSERT INTO Events (startTime, endTime, name, id) VALUES ($startTime, $endTime, $name, $id);',
    args: {
      startTime: convertDateToSqlDate(startTime),
      endTime: convertDateToSqlDate(endTime),
      name,
      id: '341241235213512'
    }
  })

  revalidatePath('/')
}

const convertDateToSqlDate = (date : Date) => {
  const [dayDate, time] = date.toISOString().split('T')
  const [year, month, day] = dayDate.split('-')
  const [hours, minutes, seconds] = time.split(':')

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}
