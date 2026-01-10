<script setup lang="ts">
import { defaultSpells, type SpellModel } from '@/models/SpellModel'
import { useSpellListStore } from '@/stores/spellList'
import { computed, ref, shallowRef, watchEffect } from 'vue'
import LoadSave from './LoadSave.vue'
import type { SupportedType } from '@/utils/FileUtils'
import { paginateSpells, type PaginationResult } from '@/services/Pagination'

interface IEmits {
  'update-spell': [newSpell: SpellModel]
  'print-spells': []
}

const spellListStore = useSpellListStore()
spellListStore.spellList = defaultSpells

const emit = defineEmits<IEmits>()

const paginationResult = shallowRef<PaginationResult | null>(null)

const selectedId = ref<number>(0)

const selectedSpell = computed<SpellModel>(() => {
  const newSpell =
    paginationResult.value?.pagesList[selectedId.value].card ?? spellListStore.spellList[0]
  emit('update-spell', newSpell)
  return newSpell
})

const saveFileType = ref<SupportedType>('application/json')

const loadSpellsFromFile = (file: File) => {
  const fileReader = new FileReader()
  fileReader.onload = (_ev: ProgressEvent<FileReader>) => {
    try {
      const results = fileReader.result?.toString()
      if (results != null && results != '') {
        switch (file.type) {
          case 'application/json':
            spellListStore.loadSpellsFromJson(results)
            break
          case 'text/csv':
            spellListStore.loadSpellsFromCsv(results)
            break
          default:
            throw new Error('Unsupported file type: ' + file.type)
        }

        console.log('Finished loading spell list:', spellListStore.spellList)
        selectedId.value = 0
      }
    } catch (error) {
      console.error('Error while reading spell list file:', error)
    }
  }
  fileReader.onerror = (ev: ProgressEvent<FileReader>) => {
    console.error('Error while reading spell list file:', ev.target?.error)
  }
  fileReader.readAsText(file)
}

watchEffect(async () => {
  paginationResult.value = await paginateSpells(spellListStore.spellList)
})
</script>

<template>
  <h3>Spell List</h3>
  <div
    style="
      display: flex;
      flex-flow: row wrap;
      justify-content: space-between;
      align-items: flex-start;
    "
  >
    <div
      style="
        display: flex;
        flex-flow: column wrap;
        justify-items: space-evenly;
        align-items: flex-start;
      "
    >
      <LoadSave
        supported-mimes="text/csv application/json"
        @file-loaded="(file: File) => loadSpellsFromFile(file)"
        @save="() => spellListStore.downloadSpellList(saveFileType)"
      >
        <div>
          <input
            id="saveJson"
            v-model="saveFileType"
            type="radio"
            name="JSON"
            value="application/json"
          />
          <label for="saveJson">JSON</label>
        </div>
        <div>
          <input id="saveCsv" v-model="saveFileType" type="radio" name="CSV" value="text/csv" />
          <label for="saveCsv">CSV</label>
        </div>
        <button @click="emit('print-spells')">Print</button>
      </LoadSave>
    </div>
    <select
      v-model="selectedId"
      class="spell-list-container"
      :title="`Spell List (${selectedSpell.name})`"
      size="10"
    >
      <option
        v-for="(spell, index) in paginationResult?.pagesList"
        :key="index"
        :value="index"
        :title="spell.label"
      >
        {{ spell.card.level + ': ' + spell.card.name }}
      </option>
    </select>
  </div>
</template>

<style scoped>
.spell-list-container {
  max-width: 20rem;
}

button {
  margin: 0.25rem;
}
</style>
