import { describe, it, expect } from 'vitest'
import { createFilters, applyFilters, type FilterOptions } from '../Filters'

type Person = {
  name: string
  age: number
  meta: { role: string }
}

describe('createFilters', () => {
  it('should create filters from data', () => {
    const data: Person[] = [
      { name: 'Alice', age: 30, meta: { role: 'admin' } },
      { name: 'Bob', age: 25, meta: { role: 'user' } },
      { name: 'Charlie', age: 35, meta: { role: 'admin' } },
    ]

    const expectedFilters: FilterOptions = {
      name: new Set(['Alice', 'Bob', 'Charlie']),
      age: new Set([30, 25, 35]),
      role: new Set(['admin', 'user']),
    }

    const filters = createFilters(data)
    expect(filters).toEqual(expectedFilters)
  })

  it('should create filters without meta key', () => {
    // override Person to not have meta attribute
    type Person = {
      name: string
      age: number
    }

    const data: Person[] = [
      { name: 'Alice', age: 30 },
      { name: 'Bob', age: 25 },
      { name: 'Charlie', age: 35 },
    ]

    const expectedFilters: FilterOptions = {
      name: new Set(['Alice', 'Bob', 'Charlie']),
      age: new Set([30, 25, 35]),
    }

    const filters = createFilters(data)
    expect(filters).toEqual(expectedFilters)
  })
})

describe('applyFilters', () => {
  it('should filter data based on filters', () => {
    const data: Person[] = [
      { name: 'Alice', age: 30, meta: { role: 'admin' } },
      { name: 'Bob', age: 25, meta: { role: 'user' } },
      { name: 'Charlie', age: 35, meta: { role: 'admin' } },
    ]

    const filters: FilterOptions = {
      role: new Set(['admin']),
    }

    const expectedFilteredData: Person[] = [
      { name: 'Alice', age: 30, meta: { role: 'admin' } },
      { name: 'Charlie', age: 35, meta: { role: 'admin' } },
    ]

    const filteredData = applyFilters(data, filters)
    expect(filteredData).toEqual(expectedFilteredData)
  })

  it('should only apply non-empty filters', () => {
    const data: Person[] = [
      { name: 'Alice', age: 30, meta: { role: 'admin' } },
      { name: 'Bob', age: 25, meta: { role: 'user' } },
      { name: 'Charlie', age: 35, meta: { role: 'admin' } },
    ]

    const filters: FilterOptions = {
      age: new Set([]),
      role: new Set(['admin']),
    }

    const expectedFilteredData: Person[] = [
      { name: 'Alice', age: 30, meta: { role: 'admin' } },
      { name: 'Charlie', age: 35, meta: { role: 'admin' } },
    ]

    const filteredData = applyFilters(data, filters)
    expect(filteredData).toEqual(expectedFilteredData)
  })

  it('should return all data if no filters are applied', () => {
    const data: Person[] = [
      { name: 'Alice', age: 30, meta: { role: 'admin' } },
      { name: 'Bob', age: 25, meta: { role: 'user' } },
      { name: 'Charlie', age: 35, meta: { role: 'admin' } },
    ]

    const filters: FilterOptions = {}

    const filteredData = applyFilters(data, filters)
    expect(filteredData).toEqual(data)
  })

  it('should handle empty data', () => {
    const data: Person[] = []

    const filters: FilterOptions = {
      role: new Set(['admin']),
    }

    const filteredData = applyFilters(data, filters)
    expect(filteredData).toEqual([])
  })
})
