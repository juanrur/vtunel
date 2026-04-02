import type { Template } from './types'
export interface TemplatesRepository {
  getAll(): Promise<Template[]>
  create(template: Omit<Template, 'id'>): Promise<Template>
  update(id: string, newTemplate: Partial<Omit<Template, 'id'>>): Promise<Template>
  delete(id: string): Promise<void>
}
