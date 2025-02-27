import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { CardModel, CardListModel } from '@/models/CardModel'

export const CUSTOM_MIN_ID = 100
export const CUSTOM_MAX_ID = 9999

function getNextClassId(ids: number[]) {
  return Math.min(Math.max(CUSTOM_MIN_ID, Math.max(...ids) + 1), CUSTOM_MAX_ID)
}

async function saveToFile(cardModels: CardListModel) {
  const blobURL = URL.createObjectURL(new Blob([JSON.stringify(cardModels, null, 2)], { type: "application/json" }))
  try {
    const link = document.createElement('a')
    link.href = blobURL
    link.download = 'card-designs-backup.json'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } finally {
    URL.revokeObjectURL(blobURL)
  }
}

async function loadFromJson(jsonString: string) {
  return deGapClassIds(JSON.parse(jsonString))
}

async function loadFromLocalStorage() {
  let customCards: CardListModel = {}
  if (localStorage.getItem('customClasses')) {
    customCards = await loadFromJson(localStorage.getItem('customClasses')!)
  }
  return customCards
}

function deGapClassIds(cardsList: CardListModel) {
  const newCardsList: CardListModel = {}
  let nextId = CUSTOM_MIN_ID
  Object.keys(cardsList).map(Number).forEach(id => {
    if (nextId <= CUSTOM_MAX_ID) {
      newCardsList[nextId++] = cardsList[id]
      delete cardsList[id]
    }
  });
  return newCardsList
}

export const useCustomCardStore = defineStore('customCards', () => {
  const customClasses = ref<CardListModel>({})

  async function resetFromLocalStorage() {
    customClasses.value = await loadFromLocalStorage()
  }

  function persistCustomClasses() {
    localStorage.setItem('customClasses', JSON.stringify(customClasses.value))
  }

  function addCustomClass(cardModel: CardModel) {
    const newClassId = getNextClassId(Object.keys(customClasses.value).map(Number))
    const newClassName = 'Custom-' + newClassId
    customClasses.value[newClassId] = {
      name: newClassName,
      color: cardModel.color,
      topIcon: cardModel.topIcon,
      midIcon: cardModel.midIcon,
      botIcon: cardModel.botIcon,
    }
    persistCustomClasses()

    return newClassId
  }

  function renameClass(classId: number, newName: string) {
    if (newName == '') {
      return
    }
    customClasses.value[classId].name = newName
    persistCustomClasses()
  }

  function deleteClass(classId: number) {
    if (classId < CUSTOM_MIN_ID) {
      return
    }

    while (customClasses.value[classId + 1]) {
      customClasses.value[classId] = customClasses.value[classId + 1]
      classId++
    }
    delete customClasses.value[classId]
    persistCustomClasses()
  }

  async function saveCustomClasses() {
    await saveToFile(customClasses.value)
  }

  async function loadCustomClassesFromJson(jsonString: string) {
    customClasses.value = await loadFromJson(jsonString)
    persistCustomClasses()
  }

  return { customClasses, resetFromLocalStorage, persistCustomClasses, addCustomClass, renameClass, deleteClass, saveCustomClasses, loadCustomClassesFromJson }
})
