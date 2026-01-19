<script setup lang="ts">
import { useSpellListStore } from '@/stores/spellList'
import { computed, ref, watch } from 'vue'
import LoadSave from './LoadSave.vue'
import type { SupportedType } from '@/utils/FileUtils'
import { useSpellPageStore } from '@/stores/spellPages'
import { spellHash } from '@/services/Pagination'

interface IEmits {
  'update-spell': [newSpell: string]
  'print-spells': []
}

const spellListStore = useSpellListStore()
const spellPageStore = useSpellPageStore()

spellListStore.loadDefaultSpells()

const emit = defineEmits<IEmits>()

const selectedId = ref<string>('')

const selectedSpell = computed<string>(() => {
  const newSpell = selectedId.value
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
        selectedId.value = spellHash(spellListStore.spellList[0])
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

watch(
  () => spellListStore.spellList,
  async () => {
    await spellPageStore.loadSpellPages(spellListStore.spellList)
  },
  { immediate: true },
)
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
      :title="`Spell List (${spellPageStore.pagesBySpell.get(selectedSpell)?.at(0)?.spell.name})`"
      size="10"
    >
      <option
        v-for="spell in spellListStore.spellList"
        :key="spellHash(spell)"
        :value="spellHash(spell)"
        :title="spell.name"
      >
        {{ spell.level + ': ' + spell.name }}
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
