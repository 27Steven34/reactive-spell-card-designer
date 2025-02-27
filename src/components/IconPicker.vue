<script setup lang="ts">
import fontsInfo from '@/fonts/fonts-info'
import { ref } from 'vue'

interface IProps {
  iconFont: string
  title: string
  displayedIcon: string
}

interface IEmits {
  iconSelected: [icon: number]
}

const props = defineProps<IProps>()
const emit = defineEmits<IEmits>()

const iconPickerDialog = ref<HTMLDialogElement>()
const icons = ref(
  [...Array(fontsInfo[props.iconFont].rangeSize).keys()].map(
    (i) => parseInt(fontsInfo[props.iconFont].rangeStart, 16) + i,
  ),
)

const selectIcon = (icon: number) => {
  emit('iconSelected', icon)
  iconPickerDialog.value?.close()
}
</script>

<template>
  <button type="button" class="icon" :title="title" @click.stop="iconPickerDialog?.showModal()">
    {{ displayedIcon }}
  </button>
  <dialog ref="iconPickerDialog">
    <form v-click-outside="() => iconPickerDialog?.close()" method="dialog" class="icon-container">
      <button
        v-for="icon in icons"
        :key="icon"
        class="icon listing"
        :title="icon.toString()"
        @click.stop="selectIcon(icon)"
      >
        {{ String.fromCodePoint(icon) }}
      </button>
    </form>
  </dialog>
</template>

<style scoped>
dialog {
  margin: 10rem auto auto;
  background-color: var(--color-border);
}

.icon {
  font-family: v-bind(iconFont);
  font-size: 48px;
  margin: 10px;
  cursor: pointer;
}

.icon-container {
  display: flex;
  flex-wrap: wrap;
  overflow-y: scroll;
  max-height: 400px;
  background-color: var(--color-background);
}

button.listing {
  background: none;
  border: none;
  padding: 0;
  background-color: var(--color-background);
  color: var(--color-text);
}
</style>
