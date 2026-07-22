import { PocketbaseTemplatesRepository } from './pocketbase-templates-repository'
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
    const createdTemplate = await PocketbaseTemplatesRepository.create(template)
    set((state) => ({ templates: [...state.templates, createdTemplate] }))
    return createdTemplate
  },

  getAllTemplates: async () => {
    set({ templatesAreLoading: true })
    const templates = await PocketbaseTemplatesRepository.getAll()
    set({ templates, templatesAreLoading: false })
    return templates
  },

  updateTemplate: async (id, newTemplate) => {
    const updatedTemplate = await PocketbaseTemplatesRepository.update(id, newTemplate)
    set((state) => ({
      templates: state.templates.map((template) => (template.id === id ? updatedTemplate : template))
    }))
    return updatedTemplate
  },

  deleteTemplate: async (id) => {
    set((state) => ({ templates: state.templates.filter((template) => template.id !== id) }))
    await PocketbaseTemplatesRepository.delete(id)
  }
}))
