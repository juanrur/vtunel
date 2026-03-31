import type { Event } from './types'
export interface EventsRepository {
  getAll(): Promise<Event[]>
  create(event: Partial<Omit<Event, 'id' | 'userId'>>): Promise<Event>
  update(id: string, newEvent: Partial<Omit<Event, 'id' | 'userId'>>): Promise<Event>
  delete(id: string): Promise<void>
}
