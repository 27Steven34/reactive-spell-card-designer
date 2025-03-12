export interface Filterable extends Record<string, unknown> {
  meta?: Record<string, unknown>
}

export type FilterOptions = {
  [key: string]: Set<unknown>
}

export function createFilters<T extends Filterable>(data: T[]): FilterOptions {
  const filters: FilterOptions = {}

  function addOption(optionName: string, optionValue: unknown) {
    if (!filters[optionName]) {
      filters[optionName] = new Set<typeof optionValue>()
    }
    filters[optionName].add(optionValue)
  }

  data.forEach((item) => {
    Object.keys(item).forEach((key) => {
      if (key === 'meta' && typeof item[key] === 'object' && item[key] !== null) {
        Object.keys(item[key]).forEach((metaKey) => {
          addOption(metaKey, item[key]![metaKey] as string)
        })
      } else {
        addOption(key, item[key] as string)
      }
    })
  })

  return filters
}

export function applyFilters<T extends Filterable>(data: T[], filters: FilterOptions): T[] {
  return data.filter((item) => {
    return Object.keys(filters).every((filterName) => {
      if (filters[filterName].size === 0) {
        // No filter applied
        return true
      }

      const metaValue = item.meta && filterName in item.meta ? item.meta[filterName] : ''
      const itemValue = (filterName in item ? item[filterName] : metaValue) as string
      return itemValue && filters[filterName].has(itemValue)
    })
  })
}
