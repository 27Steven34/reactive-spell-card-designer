<script setup lang="ts">
import { ref } from 'vue'

interface IProps {
  supportedMimes?: string
}

interface IEmits {
  fileLoaded: [file: File]
  save: []
}

defineProps<IProps>()
const emit = defineEmits<IEmits>()

const fileInput = ref<HTMLInputElement>()

const handleLoadFromFileSelect = (ev: Event) => {
  try {
    const files = (ev.target as HTMLInputElement).files
    if (files != null && files?.length > 0) {
      emit('fileLoaded', files[0])
    }
  } finally {
    fileInput.value!.value = ''
  }
}
</script>

<template>
  <div class="load-save-container">
    <input
      ref="fileInput"
      type="file"
      :accept="supportedMimes"
      hidden
      @change="handleLoadFromFileSelect"
    />
    <button @click.stop="fileInput?.click">Load</button>
    <button @click="emit('save')">Save</button>
    <slot></slot>
  </div>
</template>

<style scoped>
.load-save-container {
  display: flex;
  flex-flow: column;
}

.load-save-container button {
  margin: 0.25rem;
}

dialog {
  margin: auto;
}
</style>
