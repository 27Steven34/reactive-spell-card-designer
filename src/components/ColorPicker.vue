<script setup lang="ts">
interface IEmits {
  choosingColor: []
  colorSelected: []
}
const selectedColor = defineModel<string>('selectedColor', { default: '#000000' })
const emit = defineEmits<IEmits>()
</script>

<template>
  <input
    v-model="selectedColor"
    title="Select Color"
    type="color"
    class="color-picker"
    @click="emit('choosingColor')"
    @change="emit('colorSelected')"
  />
</template>

<style scoped>
.color-picker {
  width: 64px;
  height: 58px;
  padding: 0px 5px;
  margin: 10px;
  border: none;
  background: none;
  cursor: pointer;
}
</style>
