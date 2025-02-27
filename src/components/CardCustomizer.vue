<script setup lang="ts">
import ClassPicker from '@/components/ClassPicker.vue'
import ColorPicker from '@/components/ColorPicker.vue'
import IconPicker from '@/components/IconPicker.vue'
import defaultClasses, { type CardModel } from '@/models/CardModel'
import { CUSTOM_MIN_ID, useCustomCardStore } from '@/stores/customCards'
import { computed, ref } from 'vue'
import LoadSave from './LoadSave.vue'

interface IEmits {
  updateCard: [newCard: CardModel]
}

const customCardStore = useCustomCardStore()
customCardStore.resetFromLocalStorage()

const emit = defineEmits<IEmits>()

const selectedClass = ref<number>(7)

const cardModel = computed<CardModel>(() => {
  let card = defaultClasses[selectedClass.value]
  if (card == undefined) {
    card = customCardStore.customClasses[selectedClass.value]
  }
  emit('updateCard', card)
  return card
})

const defaultOptions = (function () {
  const options = []
  for (const id in defaultClasses) {
    options.push({ id: parseInt(id), name: defaultClasses[id].name })
  }
  return options
})()

const customOptions = computed(() => {
  const options = []
  for (const id in customCardStore.customClasses) {
    options.push({ id: parseInt(id), name: customCardStore.customClasses[id].name })
  }
  return options
})

const iconSelect = (icon: number, index: number) => {
  customize()
  switch (index) {
    case 1:
      cardModel.value.topIcon = `${String.fromCodePoint(icon)}`
      break
    case 2:
      cardModel.value.midIcon = `${String.fromCodePoint(icon)}`
      break
    case 3:
      cardModel.value.botIcon = `${String.fromCodePoint(icon)}`
      break
  }
  customCardStore.persistCustomClasses()
}

const customize = () => {
  if (selectedClass.value < CUSTOM_MIN_ID) {
    selectedClass.value = customCardStore.addCustomClass(cardModel.value)
  }
}

const loadCardsFromFile = (file: File) => {
  const fileReader = new FileReader()
  fileReader.onload = (_ev: ProgressEvent<FileReader>) => {
    try {
      const results = fileReader.result?.toString()
      if (results != null && results != '') {
        customCardStore.loadCustomClassesFromJson(results)
        console.log('Finished loading custom cards:', customCardStore.customClasses)
        selectedClass.value = 0
      }
    } catch (error) {
      console.error('Error while reading JSON file:', error)
    }
  }
  fileReader.onerror = (ev: ProgressEvent<FileReader>) => {
    console.error('Error while reading JSON file:', ev.target?.error)
  }
  fileReader.readAsText(file)
}
</script>

<template>
  <h3>Card Customization</h3>
  <div class="card-customizer-container">
    <ClassPicker
      v-model:selected-id="selectedClass"
      :default-options="defaultOptions"
      :custom-options="customOptions"
      @rename-class="(newName: string) => customCardStore.renameClass(selectedClass, newName)"
      @copy-class="() => (selectedClass = customCardStore.addCustomClass(cardModel))"
      @delete-class="customCardStore.deleteClass(selectedClass--)"
    />
    <ColorPicker
      v-model:selected-color="cardModel.color"
      @choosing-color="customize()"
      @color-selected="customCardStore.persistCustomClasses()"
    />
    <IconPicker
      icon-font="rpg-icons"
      :title="'Select Top Icon'"
      :displayed-icon="cardModel.topIcon"
      @icon-selected="(newIcon) => iconSelect(newIcon, 1)"
    ></IconPicker>
    <IconPicker
      icon-font="rpg-icons"
      :title="'Select Middle Icon'"
      :displayed-icon="cardModel.midIcon"
      @icon-selected="(newIcon) => iconSelect(newIcon, 2)"
    ></IconPicker>
    <IconPicker
      icon-font="rpg-icons"
      :title="'Select Bottom Icon'"
      :displayed-icon="cardModel.botIcon"
      @icon-selected="(newIcon) => iconSelect(newIcon, 3)"
    ></IconPicker>
    <LoadSave
      supported-mimes="application/json"
      @file-loaded="(file: File) => loadCardsFromFile(file)"
      @save="() => customCardStore.saveCustomClasses()"
    />
  </div>
</template>

<style scoped>
.card-customizer-container {
  display: flex;
  flex-flow: row wrap;
  justify-content: space-around;
  align-items: center;
}
</style>
