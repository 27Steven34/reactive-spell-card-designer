export type FilterType = string | number | boolean

export interface Filterable extends Record<string, unknown> {
  filterFields?: Record<string, FilterType | FilterType[]>
}

export type FilterOptions = {
  [key: string]: { values: Set<FilterType>; multiple: boolean }
}

export function createFilters<T extends Filterable>(
  data: T[],
  excludeKeys: string[] = [],
): FilterOptions {
  const filters: FilterOptions = {}

  function addOption(optionName: string, optionValue: FilterType | FilterType[]) {
    if (excludeKeys.includes(optionName)) {
      return
    }

    if (!filters[optionName]) {
      filters[optionName] = { values: new Set<FilterType>(), multiple: false }
    }

    if (optionValue instanceof Array) {
      filters[optionName].multiple = true
      optionValue.map((item) => filters[optionName].values.add(item))
    } else {
      filters[optionName].values.add(optionValue)
    }
  }

  data.forEach((item) => {
    if (item.filterFields !== undefined) {
      Object.keys(item.filterFields).forEach((key) => {
        addOption(key, item.filterFields![key] as string)
      })
    }
  })

  Object.keys(filters).forEach((key) => {
    filters[key].values = new Set(Array.from(filters[key].values).sort())
  })

  return filters
}

export function applyFilters<T extends Filterable>(data: T[], filters: FilterOptions): T[] {
  return data.filter((item) => {
    return Object.keys(filters).every((filterName) => {
      if (filters[filterName].values.size === 0) {
        // No filter applied to this field
        return true
      }

      if (filters[filterName].multiple) {
        const itemValues = (
          item.filterFields && filterName in item.filterFields ? item.filterFields[filterName] : []
        ) as FilterType[]
        return Array.from(filters[filterName].values).every((itemValue) =>
          itemValues.includes(itemValue),
        )
      } else {
        const itemValue = (
          item.filterFields && filterName in item.filterFields ? item.filterFields[filterName] : ''
        ) as string
        return itemValue && filters[filterName].values.has(itemValue)
      }
    })
  })
}
