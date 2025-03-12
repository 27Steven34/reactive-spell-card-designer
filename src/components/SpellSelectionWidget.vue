<script setup lang="ts">
import { emptyCard } from '@/models/CardModel'
import { emptySpell, type SpellModel } from '@/models/SpellModel'
import { useSpellListStore } from '@/stores/spellList'
import { computed, nextTick, ref, toRaw } from 'vue'
import LoadSave from './LoadSave.vue'
import SpellCard from './SpellCard.vue'
import type { SupportedType } from '@/utils/FileUtils'
import { createFilters, applyFilters } from '@/utils/Filters'

interface IEmits {
  'update-spell': [newSpell: SpellModel]
  'print-spells': []
}

const spellListStore = useSpellListStore()
spellListStore.loadDefaultSpells()

const emit = defineEmits<IEmits>()

const selectedId = ref<number>(0)

const selectedSpell = computed<SpellModel>(() => {
  const newSpell = visibleSpells.value[selectedId.value]
  emit('update-spell', newSpell)
  return newSpell
})

const filtersDialog = ref<HTMLDialogElement>()

const selectedFilters = ref<Record<string, Set<string>>>({})

const availableFilters = computed<Record<string, Set<string>>>(() => {
  return createFilters(spellListStore.spellList) as Record<string, Set<string>>
})

const visibleSpells = computed<SpellModel[]>(() => {
  return applyFilters(spellListStore.spellList, selectedFilters.value)
})

const toggleFilter = (filterName: string, option: string) => {
  if (selectedFilters.value[filterName] == undefined) {
    selectedFilters.value[filterName] = new Set()
  }
  if (selectedFilters.value[filterName].has(option)) {
    selectedFilters.value[filterName].delete(option)
  } else {
    selectedFilters.value[filterName].add(option)
  }
}

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
        paginateSpells()
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

const testSpellCardElement = ref<HTMLElement>()
const testSpell = ref<SpellModel>(emptySpell)
const testingMode = ref<boolean>(false)

async function paginateSpells() {
  const newSpellList: SpellModel[] = []
  testingMode.value = true
  await nextTick()
  for (const spell of spellListStore.spellList) {
    const spellCopy = structuredClone(toRaw(spell))
    spellCopy.description = ''
    testSpell.value = spellCopy
    await nextTick()
    const paginatedDescription = paginateText(spell.description)
    if (paginatedDescription.length > 1) {
      let pageNum = 1
      paginatedDescription.forEach((textPage: string) => {
        const spellPart = structuredClone(toRaw(spell))
        spellPart.name += ` [${pageNum++}/${paginatedDescription.length}]`
        spellPart.description = textPage
        newSpellList.push(spellPart)
      })
    } else {
      newSpellList.push(spell)
    }
  }
  testingMode.value = false
  testSpell.value = emptySpell
  spellListStore.spellList = newSpellList
}

function paginateText(text: string) {
  const paginatedText = []
  const pageContainer = testSpellCardElement.value?.getElementsByClassName(
    'text-container',
  )[0] as HTMLElement
  const currentPage = testSpellCardElement.value?.getElementsByClassName('text')[0] as HTMLElement

  if (currentPage == undefined || fitsInPage(text)) {
    return [text]
  }

  currentPage.innerHTML = ''

  const textArray: string[] = text.split(' ')
  while (textArray.length > 0) {
    let min = 0
    let max = textArray.length - 1
    let mid = max
    while (min < max) {
      const words = textArray.slice(0, mid + 1).join(' ')
      if (fitsInPage(words)) {
        min = mid
      } else {
        max = mid - 1
      }
      mid = Math.floor((min + max + 1) / 2)
    }
    const textPage = textArray.splice(0, min + 1).join(' ')
    paginatedText.push(addUnopenedTags(textPage))
  }

  function fitsInPage(words: string) {
    currentPage!.innerHTML = words
    return pageContainer!.offsetHeight >= pageContainer!.scrollHeight
  }

  function addUnopenedTags(text: string) {
    const tagPattern: RegExp = /<\/?([a-zA-Z]+)[^>]*>/g
    const openTags: string[] = []
    const closeTags: string[] = []
    let match: RegExpExecArray | null

    while ((match = tagPattern.exec(text)) !== null) {
      if (match[0][1] === '/') {
        // Closing tag
        const lastTag = openTags.pop()
        const newTag = match[1]
        if (lastTag === undefined) {
          closeTags.push(newTag)
        } else if (lastTag !== newTag) {
          // Mismatched tag, add the lastTag back and push new close tag
          openTags.push(lastTag)
          closeTags.push(newTag)
        }
      } else if (!['<br>', '<wbr>'].includes(match[0])) {
        // Opening tag
        openTags.push(match[1])
      }
    }

    // Add the unopened tags at the beginning of the text
    const unopenedTags = closeTags
      .reverse()
      .map((tag) => `<${tag}>`)
      .join('')
    return unopenedTags + text
  }

  return paginatedText
}

paginateSpells()
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
      <button @click.stop="filtersDialog?.showModal()">Filters...</button>
      <dialog ref="filtersDialog">
        <form
          v-click-outside="() => filtersDialog?.close()"
          method="dialog"
          class="filters-container"
        >
          <div v-for="(filter, filterName) in availableFilters" :key="filterName">
            <label>{{ filterName }}</label>
            <div v-for="option in filter" :key="option.toString()">
              <label>{{ option }}</label>
              <input type="checkbox" @change="() => toggleFilter(filterName, option)" />
            </div>
          </div>
          <button>Apply</button>
        </form>
      </dialog>
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
        v-for="(spell, index) in visibleSpells"
        :key="index"
        :value="index"
        :title="spell.name"
      >
        {{ spell.level + ': ' + spell.name }}
      </option>
    </select>
  </div>
  <div v-if="testingMode" ref="testSpellCardElement">
    <SpellCard :card-design="emptyCard" :spell-info="testSpell" :two-sided="false" />
  </div>
</template>

<style scoped>
.spell-list-container {
  max-width: 20rem;
}

dialog {
  margin: auto;
}

button {
  margin: 0.25rem;
}
</style>
