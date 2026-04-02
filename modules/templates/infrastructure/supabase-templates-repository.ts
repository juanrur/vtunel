import { TemplatesRepository } from '../domain/template-repository'
import type { Template } from '../domain/types'
import { supabase } from '@shared/supabase/client'

type TemplateRow = {
  id: string
  name: string
  duration: number
  user_id: string
}

export const SupabaseTemplatesRepository: TemplatesRepository = {
  async getAll (): Promise<Template[]> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .eq('user_id', user.id) as { data: TemplateRow[], error: Error | null }

    if (error) throw new Error(error.message)

    return data.map(row => (
      {
        id: row.id,
        duration: row.duration,
        name: row.name
      }
    )) as Template[]
  },
  async create (template: Omit<Template, 'id'>): Promise<Template> {
    const { data, error } = await supabase
      .from('templates')
      .insert(await TemplateMapper.toRow(template))
      .select()
      .single() as { data: TemplateRow, error: Error | null }

    if (error) throw new Error(error.message)
    return TemplateMapper.toDomain(data)
  },
  async update (id: string, newTemplate: Partial<Omit<Template, 'id'>>): Promise<Template> {
    const { data, error } = await supabase
      .from('templates')
      .update(await TemplateMapper.toRow(newTemplate))
      .eq('id', id)
      .select()
      .single() as { data: TemplateRow, error: Error | null }

    if (error) throw new Error(error.message)
    return TemplateMapper.toDomain(data)
  },
  async delete (id: string): Promise<void> {
    const { error } = await supabase
      .from('templates')
      .delete()
      .eq('id', id)
    if (error) throw new Error(error.message)
  }
}

const TemplateMapper = {
  toDomain (row: TemplateRow): Template {
    return {
      id: row.id,
      duration: row.duration,
      name: row.name
    }
  },
  async toRow (template: Partial<Template>): Promise<TemplateRow> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')
    const userId = user.id
    return {
      ...template,
      user_id: userId
    } as TemplateRow
  }
}
