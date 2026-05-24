import { CrudRepository } from '@shared/domain/crud-repository'
import type { Template } from './types'
import { pb, getCurrentUser } from '@shared/pocketbase/client'

const TemplateMapper = {
  toDomain (r: any): Template {
    return { id: r.id, duration: r.duration, title: r.title }
  },
  async toRow (template: Partial<Template>): Promise<Partial<any>> {
    const user = getCurrentUser()
    if (!user) throw new Error('Not authenticated')
    return { ...template, user_id: user.id }
  }
}

export const PocketbaseTemplatesRepository: CrudRepository<Template> = {
  async getAll (): Promise<Template[]> {
    const user = getCurrentUser()
    if (!user) throw new Error('Not authenticated')

    const records = await pb.collection('templates').getFullList({ filter: `user_id = \"${user.id}\"` })
    return records.map((r: any) => TemplateMapper.toDomain(r))
  },
  async create (template: Omit<Template, 'id'>): Promise<Template> {
    const row = await TemplateMapper.toRow(template)
    const record = await pb.collection('templates').create(row)
    return TemplateMapper.toDomain(record)
  },
  async update (id: string, newTemplate: Partial<Omit<Template, 'id'>>): Promise<Template> {
    const payload = await TemplateMapper.toRow(newTemplate)
    const record = await pb.collection('templates').update(id, payload)
    return TemplateMapper.toDomain(record)
  },
  async delete (id: string): Promise<void> {
    await pb.collection('templates').delete(id)
  }
}
