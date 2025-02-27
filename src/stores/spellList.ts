import { type SpellModel } from '@/models/SpellModel'
import Papa from 'papaparse'
import { defineStore } from "pinia"
import { ref } from 'vue'

const spellHeaders: string[] =
  ['level', 'name', 'type', 'castingTime', 'range', 'components', 'duration', 'neededMaterials', 'description', 'source']

function createSpell(spellData: string[]) {
  const spellRecord: SpellModel = spellData.reduce((carry, item, index) => {
    carry = { ...carry, [spellHeaders[index]]: item }
    return carry
  }, {}) as SpellModel
  return spellRecord
}

async function saveToFile(spellList: SpellModel[]) {
  const spellFileContents = Papa.unparse(
    spellList,
    {
      quotes: true,
      delimiter: ';',
      header: false,
      skipEmptyLines: 'greedy',
      columns: spellHeaders,
      escapeFormulae: true
    }
  );
  const blobURL = URL.createObjectURL(
    new Blob([spellFileContents],
      { type: "text/csv" })
  )
  try {
    const link = document.createElement('a')
    link.href = blobURL
    link.download = 'spell-list.csv'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } finally {
    URL.revokeObjectURL(blobURL)
  }
}

export const useSpellListStore = defineStore('spellList', () => {
  const spellList = ref<SpellModel[]>([])

  async function downloadSpellList() {
    await saveToFile(spellList.value)
  }

  async function loadSpellsFromCSV(spellCSV: string) {
    spellList.value = []
    Papa.parse<string[]>(spellCSV, {
      skipEmptyLines: 'greedy',
      step: (results, _parser) => {
        spellList.value.push(createSpell(results.data))
      },
    })
  }

  return { spellList, downloadSpellList, loadSpellsFromCSV }
})
