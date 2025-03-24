<script setup lang="ts">
import {
  createFilters,
  applyFilters,
  type FilterOptions,
  type Filterable,
  type FilterType,
} from '@/utils/Filters'
import { computed, ref, watch } from 'vue'

interface IProps {
  allObjects: Filterable[]
}
interface IEmits {
  filtered: [Filterable[]]
}
const props = defineProps<IProps>()
const emit = defineEmits<IEmits>()

const filtersDialog = ref<HTMLDialogElement>()

const allFilters = computed<FilterOptions>(() => {
  return createFilters(props.allObjects)
})

const selectedFilters = ref<FilterOptions>({})

const filteredOptions = computed<Filterable[]>(() => {
  return applyFilters(props.allObjects, selectedFilters.value)
})

watch(filteredOptions, (newValues) => emit('filtered', newValues))

const toggleFilter = (filterName: string, option: FilterType) => {
  if (!selectedFilters.value[filterName]) {
    selectedFilters.value[filterName] = {
      values: new Set<FilterType>(),
      multiple: allFilters.value[filterName].multiple,
    }
  }

  if (selectedFilters.value[filterName].values.has(option)) {
    selectedFilters.value[filterName].values.delete(option)
  } else {
    selectedFilters.value[filterName].values.add(option)
  }
}

const apply = () => {
  filtersDialog.value?.close()
}
</script>

<template>
  <button @click.stop="filtersDialog?.showModal()">Filters...</button>
  <dialog id="filters-dialog" ref="filtersDialog">
    <form v-click-outside="apply" method="dialog" @submit="apply">
      <div class="filters-container">
        <div v-for="(filter, filterName) in allFilters" :key="filterName">
          <label class="filter-category">{{
            filterName
              .toString()
              .toLowerCase()
              .replace(/(?:^|\s|_|-)(\w)/g, (_, char) => ' ' + char.toUpperCase())
              .trim()
          }}</label>
          <div v-for="option in filter.values" :key="option.toString()">
            <input type="checkbox" @change="() => toggleFilter(filterName as string, option)" />
            <label class="filter-option">{{ option }}</label>
          </div>
        </div>
      </div>
      <button>Apply</button>
    </form>
  </dialog>
</template>

<style scoped>
#filters-dialog {
  margin: auto;
}

.filters-container {
  display: flex;
  flex-flow: row wrap;
}

.filters-container .filter-category {
  font-weight: bold;
}
</style>
