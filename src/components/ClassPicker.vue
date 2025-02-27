<script setup lang="ts">
import { CUSTOM_MIN_ID } from '@/stores/customCards'
import { computed, ref } from 'vue'

interface IProps {
  defaultOptions: { id: number; name: string }[]
  customOptions: { id: number; name: string }[]
}

interface IEmits {
  renameClass: [newName: string]
  copyClass: []
  deleteClass: []
}

const props = defineProps<IProps>()
const selectedId = defineModel<number>('selectedId', { default: 0 })
const emit = defineEmits<IEmits>()

const isDefaultClass = computed(() => selectedId.value < CUSTOM_MIN_ID)

const renameDialog = ref<HTMLDialogElement>()
const currentName = computed(() => {
  return props.customOptions.find((option) => option.id === selectedId.value)?.name ?? ''
})
const newName = ref<string>(currentName.value)

const openRenameDialog = () => {
  newName.value = currentName.value
  renameDialog.value?.showModal()
}

const confirmRename = () => {
  emit('renameClass', newName.value)
  closeRenameDialog()
}

const closeRenameDialog = () => {
  newName.value = ''
  renameDialog.value?.close()
}
</script>

<template>
  <div class="class-picker">
    <select v-model="selectedId" title="Select Card Design" name="Card Design List">
      <optgroup label="Default">
        <option v-for="option in defaultOptions" :key="option.id" :value="option.id">
          {{ option.name }}
        </option>
      </optgroup>
      <optgroup v-if="customOptions.length > 0" label="Custom">
        <option v-for="option in customOptions" :key="option.id" :value="option.id">
          {{ option.name }}
        </option>
      </optgroup>
    </select>
    <div class="edit-buttons-container">
      <button
        type="button"
        title="Rename"
        :disabled="isDefaultClass"
        @click.stop="openRenameDialog"
      >
        <FontAwesomeIcon :icon="['fa-regular', 'fa-pen-to-square']" />
      </button>
      <button type="button" title="Copy" @click="emit('copyClass')">
        <FontAwesomeIcon :icon="['fa-regular', 'fa-copy']" />
      </button>
      <button type="button" title="Delete" :disabled="isDefaultClass" @click="emit('deleteClass')">
        <FontAwesomeIcon :icon="['fa-regular', 'fa-trash-can']" />
      </button>
    </div>
    <dialog ref="renameDialog">
      <form
        v-click-outside="closeRenameDialog"
        method="dialog"
        @submit.stop.prevent="confirmRename"
      >
        <input
          v-model="newName"
          name="New Card Design Name"
          title="New Name"
          type="text"
          placeholder="New Name"
          required
        />
        <button type="submit" title="Confirm Rename">Rename</button>
        <button type="button" title="Cancel Rename" formmethod="dialog" @click="closeRenameDialog">
          Cancel
        </button>
      </form>
    </dialog>
  </div>
</template>

<style scoped>
.class-picker {
  display: flex;
  flex-flow: column wrap;
  align-content: space-around;
  gap: 0.5rem;
}

.class-picker select {
  min-width: 8rem;
  max-width: 10rem;
}

.class-picker dialog {
  margin: 5rem auto auto;
}

.edit-buttons-container {
  display: flex;
  justify-content: space-between;
}
</style>
