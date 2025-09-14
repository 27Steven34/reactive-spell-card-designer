import { describe, it, expect } from 'vitest'
import { createFilters, applyFilters, type FilterOptions } from '../Filters'

type Person = {
  name: string
  age: number
  filterFields: { age: number; role: string }
}

describe('createFilters', () => {
  it('should create filters from data', () => {
    const alice: Person = { name: 'Alice', age: 30, filterFields: { age: 30, role: 'admin' } }
    const bob: Person = { name: 'Bob', age: 25, filterFields: { age: 25, role: 'user' } }
    const charlie: Person = { name: 'Charlie', age: 35, filterFields: { age: 35, role: 'admin' } }
    const data: Person[] = [alice, bob, charlie]

    const expectedFilters: FilterOptions = {
      age: { values: new Set([30, 25, 35]), multiple: false },
      role: { values: new Set(['admin', 'user']), multiple: false },
    }

    const filters = createFilters(data)
    expect(filters).toEqual(expectedFilters)
  })

  it('should exclude keys specified to be excluded', () => {
    const alice: Person = { name: 'Alice', age: 30, filterFields: { age: 30, role: 'admin' } }
    const bob: Person = { name: 'Bob', age: 25, filterFields: { age: 25, role: 'user' } }
    const charlie: Person = { name: 'Charlie', age: 35, filterFields: { age: 35, role: 'admin' } }
    const data: Person[] = [alice, bob, charlie]

    const expectedFilters: FilterOptions = {
      age: { values: new Set([30, 25, 35]), multiple: false },
    }

    const filters = createFilters(data, ['name', 'role'])
    expect(filters).toEqual(expectedFilters)
  })
})

describe('applyFilters', () => {
  it('should filter data based on filters', () => {
    const alice: Person = { name: 'Alice', age: 30, filterFields: { age: 30, role: 'admin' } }
    const bob: Person = { name: 'Bob', age: 25, filterFields: { age: 25, role: 'user' } }
    const charlie: Person = { name: 'Charlie', age: 35, filterFields: { age: 35, role: 'admin' } }
    const data: Person[] = [alice, bob, charlie]

    const filters: FilterOptions = {
      role: { values: new Set(['admin']), multiple: false },
    }

    const expectedFilteredData: Person[] = [alice, charlie]

    const filteredData = applyFilters(data, filters)
    expect(filteredData).toEqual(expectedFilteredData)
  })

  it('should only apply non-empty filters', () => {
    const alice: Person = { name: 'Alice', age: 30, filterFields: { age: 30, role: 'admin' } }
    const bob: Person = { name: 'Bob', age: 25, filterFields: { age: 25, role: 'user' } }
    const charlie: Person = { name: 'Charlie', age: 35, filterFields: { age: 35, role: 'admin' } }
    const data: Person[] = [alice, bob, charlie]

    const filters: FilterOptions = {
      age: { values: new Set([]), multiple: false },
      role: { values: new Set(['admin']), multiple: false },
    }

    const expectedFilteredData: Person[] = [alice, charlie]

    const filteredData = applyFilters(data, filters)
    expect(filteredData).toEqual(expectedFilteredData)
  })

  it('should return all data if no filters are applied', () => {
    const alice: Person = { name: 'Alice', age: 30, filterFields: { age: 30, role: 'admin' } }
    const bob: Person = { name: 'Bob', age: 25, filterFields: { age: 25, role: 'user' } }
    const charlie: Person = { name: 'Charlie', age: 35, filterFields: { age: 35, role: 'admin' } }
    const data: Person[] = [alice, bob, charlie]

    const filters: FilterOptions = {}

    const filteredData = applyFilters(data, filters)
    expect(filteredData).toEqual(data)
  })

  it('should handle empty data', () => {
    const data: Person[] = []

    const filters: FilterOptions = {
      role: { values: new Set(['admin']), multiple: false },
    }

    const filteredData = applyFilters(data, filters)
    expect(filteredData).toEqual([])
  })

  it('should handle items with multiple selections', () => {
    type Person = {
      name: string
      age: number
      filterFields: { age: number; role: string; preferredPizzaFlavors: string[] }
    }

    const alice: Person = {
      name: 'Alice',
      age: 30,
      filterFields: { age: 30, role: 'admin', preferredPizzaFlavors: ['Blue, Green'] },
    }
    const bob: Person = {
      name: 'Bob',
      age: 25,
      filterFields: { age: 25, role: 'user', preferredPizzaFlavors: ['Green', 'Red'] },
    }
    const charlie: Person = {
      name: 'Charlie',
      age: 35,
      filterFields: { age: 35, role: 'admin', preferredPizzaFlavors: ['Blue', 'Green', 'Red'] },
    }

    const data: Person[] = [alice, bob, charlie]

    const filters: FilterOptions = {
      preferredPizzaFlavors: { values: new Set(['Green', 'Red']), multiple: true },
    }

    const expectedFilteredData: Person[] = [bob, charlie]

    const filteredData = applyFilters(data, filters)
    expect(filteredData).toEqual(expectedFilteredData)
  })
})
