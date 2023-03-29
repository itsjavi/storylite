export type CollectionItem = { id: string }
export type Collection = CollectionItem[]

export interface SearchEngine {
  buildIndex(collection: Collection, properties: string[]): SearchEngine

  searchIndex(text: string): Set<string>

  search<T extends Collection>(collection: T, text: string): T
}
