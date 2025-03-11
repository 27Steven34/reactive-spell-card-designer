import defaultSpells from '../../data/spells/spells_en.json'
import { testSpells, type SpellModel } from '@/models/SpellModel'
import { saveToCsvFile, saveToJsonFile, type SupportedType } from '@/utils/FileUtils'
import Papa from 'papaparse'
import { defineStore } from 'pinia'
import { ref } from 'vue'

const spellHeaders: string[] = [
  'level',
  'name',
  'type',
  'castingTime',
  'range',
  'components',
  'duration',
  'neededMaterials',
  'description',
  'source',
]

function createSpell(spellData: string[]) {
  const spellRecord: SpellModel = spellData.reduce((carry, item, index) => {
    carry = { ...carry, [spellHeaders[index]]: item }
    return carry
  }, {}) as SpellModel
  return spellRecord
}

export const useSpellListStore = defineStore('spellList', () => {
  const spellList = ref<SpellModel[]>([])

  async function downloadSpellList(type: SupportedType) {
    switch (type) {
      case 'application/json':
        await saveToJsonFile(spellList.value, 'spell-list')
        break
      case 'text/csv':
        await saveToCsvFile(spellList.value, 'spell-list', spellHeaders)
        break
      default:
        console.warn(`Unsupported save file type in spellList store: ${type}`)
    }
  }

  async function loadSpellsFromCsv(spellCsv: string) {
    const parsedList: SpellModel[] = []
    Papa.parse<string[]>(spellCsv, {
      skipEmptyLines: 'greedy',
      step: (results, _parser) => {
        parsedList.push(createSpell(results.data))
      },
    })
    spellList.value = parsedList
  }

  async function loadSpellsFromJson(spellJson: string) {
    spellList.value = JSON.parse(spellJson)
  }

  async function loadDefaultSpells() {
    try {
      spellList.value = defaultSpells
    } catch (error) {
      console.error('Error loading default spells: ', error)
      console.error('Using test spells instead')
      spellList.value = testSpells
    }
  }

  return { spellList, downloadSpellList, loadSpellsFromCsv, loadSpellsFromJson, loadDefaultSpells }
})
