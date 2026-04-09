import { SupabaseTemplatesRepository } from './supabase-templates-repository'
import { Template } from './types'
import { create } from 'zustand'

interface TemplatesStore {
  templates: Template[]
  templatesAreLoading: boolean
  getAllTemplates(): Promise<Template[]>
  createTemplate(template: Omit<Template, 'id'>): Promise<Template>
  updateTemplate(id: string, newTemplate: Partial<Omit<Template, 'id'>>): Promise<Template>
  deleteTemplate(id: string): Promise<void>
}

export const useTemplatesStore = create<TemplatesStore>((set) => ({
  templates: [],
  templatesAreLoading: false,

  createTemplate: async (template) => {
    set((state) => ({ templates: [...state.templates, createdTemplate] }))
    const createdTemplate = await SupabaseTemplatesRepository.create(template)
    return createdTemplate
  },

  getAllTemplates: async () => {
    set({ templatesAreLoading: true })
    const templates = await SupabaseTemplatesRepository.getAll()
    set({ templates, templatesAreLoading: false })
    return templates
  },

  updateTemplate: async (id, newTemplate) => {
    set((state) => ({
      templates: state.templates.map((template) => (template.id === id ? updatedTemplate : template))
    }))

    const updatedTemplate = await SupabaseTemplatesRepository.update(id, newTemplate)
    return updatedTemplate
  },

  deleteTemplate: async (id) => {
    set((state) => ({ templates: state.templates.filter((template) => template.id !== id) }))
    await SupabaseTemplatesRepository.delete(id)
  }
}))
