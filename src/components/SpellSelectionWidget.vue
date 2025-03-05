<script setup lang="ts">
import { type CardModel } from '@/models/CardModel'
import { defaultSpells, type SpellModel } from '@/models/SpellModel'
import { useSpellListStore } from '@/stores/spellList'
import { computed, nextTick, ref, toRaw } from 'vue'
import LoadSave from './LoadSave.vue'
import SpellCard from './SpellCard.vue'
import type { SupportedType } from '@/utils/FileUtils'

interface IEmits {
  'update-spell': [newSpell: SpellModel]
  'print-spells': []
}

const spellListStore = useSpellListStore()
spellListStore.spellList = defaultSpells

const emit = defineEmits<IEmits>()

const selectedId = ref<number>(0)

const selectedSpell = computed<SpellModel>(() => {
  const newSpell = spellListStore.spellList[selectedId.value]
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

const emptySpellDesign: CardModel = {
  name: '',
  color: '#000000',
  topIcon: '',
  midIcon: '',
  botIcon: '',
}

const emptySpell: SpellModel = {
  name: '',
  level: '',
  castingTime: '',
  range: '',
  components: '',
  duration: '',
  neededMaterials: '',
  description: '',
  source: '',
  type: '',
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
  spellListStore.spellList = newSpellList
}

function paginateText(text: string) {
  const paginatedText = []
  const pageContainer = testSpellCardElement.value?.getElementsByClassName(
    'text-container',
  )[0] as HTMLElement
  const currentPage = testSpellCardElement.value?.getElementsByClassName('text')[0] as HTMLElement

  if (currentPage == undefined) {
    return [text]
  }

  currentPage.innerHTML = ''

  const textArray = text
    .replace(new RegExp('([^ ])<', 'g'), '$1 <')
    .replace(new RegExp('>([^ ])', 'g'), '> $1')
    .split(' ')
  const formatStack: string[] = []
  textArray.forEach((word) => {
    if (word.startsWith('</')) {
      formatStack.pop()
      return
    }
    if (word.startsWith('<') && !['<br>', '<wbr>'].includes(word)) {
      formatStack.push(word)
      return
    }
    if (!appendToPage(formatStack.join('') + word)) {
      paginatedText.push(currentPage.innerHTML)
      currentPage.innerHTML = ''
      appendToPage(word)
    }
  })

  if (currentPage.innerHTML != '') {
    paginatedText.push(currentPage.innerHTML)
  }

  function appendToPage(word: string) {
    let itFits = true
    const pageText = currentPage!.innerHTML
    currentPage!.innerHTML += word + ' '

    if (pageContainer!.offsetHeight < pageContainer!.scrollHeight) {
      currentPage!.innerHTML = pageText
      itFits = false
    }
    return itFits
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
        v-for="(spell, index) in spellListStore.spellList"
        :key="index"
        :value="index"
        :title="spell.name"
      >
        {{ spell.level + ': ' + spell.name }}
      </option>
    </select>
  </div>
  <div v-if="testingMode" ref="testSpellCardElement">
    <SpellCard :card-design="emptySpellDesign" :spell-info="testSpell" :two-sided="false" />
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
