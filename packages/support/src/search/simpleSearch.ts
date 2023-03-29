import { Collection, SearchEngine } from './types'

export class SimpleSearchIndex implements SearchEngine {
  static TOKEN_SEPARATOR = ':'
  index: Map<string, string> = new Map()

  buildIndex(collection: Collection, properties: string[]): SimpleSearchIndex {
    this.index = new Map()
    const separator = SimpleSearchIndex.TOKEN_SEPARATOR

    for (const item of collection) {
      if (this.index.has(item.id)) {
        throw new Error(`The index already has the item with key: ${item.id}`)
      }

      let fullText = ''

      for (const prop of properties) {
        let propValues: unknown = (item as Record<string, unknown>)[prop]
        if (!propValues) {
          continue
        }
        if (!Array.isArray(propValues)) {
          propValues = [propValues]
        }

        // support many values
        for (let propValue of propValues as Iterable<unknown>) {
          if (typeof propValue === 'number') {
            propValue = String(propValue)
          }
          if (typeof propValue !== 'string' || propValue === '') {
            continue
          }
          const minifiedValue = propValue.replace(/\s/g, '')
          fullText = `${fullText} ${prop}${separator}${propValue}`
          if (propValue !== minifiedValue) {
            fullText = `${fullText} ${prop}${separator}${minifiedValue}`
          }
        }
      }

      fullText = fullText.trim().toLowerCase()

      if (fullText !== '') {
        this.index.set(item.id, fullText)
      }
    }

    return this
  }

  searchIndex(text: string): Set<string> {
    if (!text) {
      return new Set(this.index.keys())
    }
    const hits: Set<string> = new Set()
    const sanitizedText = text.replace(/\s+/g, ' ').trim().toLowerCase()
    if (sanitizedText === '') {
      return hits
    }
    const tokens = sanitizedText.split(' ')

    return new Set(
      Array.from(this.index)
        .filter(entry => {
          return tokens.some(token => entry[1].includes(token))
        })
        .map(entry => entry[0])
    )
  }

  search<T extends Collection>(collection: T, text: string): T {
    if (!text) {
      return collection
    }
    const hits = this.searchIndex(text)

    if (hits.size === 0) {
      return [] as Collection as T
    }

    return collection.filter(item => hits.has(item.id)) as T
  }
}
