export interface CrudRepository<T> {
  getAll(): Promise<T[]>
  create(entity: Omit<T, 'id'>): Promise<T>
  update(id: string, newEntity: Partial<Omit<T, 'id'>>): Promise<T>
  delete(id: string): Promise<void>
}
