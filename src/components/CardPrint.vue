<script setup lang="ts">
import type { CardModel } from '@/models/CardModel'
import { useSpellListStore } from '@/stores/spellList'
import SpellCard from './SpellCard.vue'

const spellList = useSpellListStore().spellList

interface IProps {
  cardModel: CardModel
  twoSided?: boolean
}

withDefaults(defineProps<IProps>(), { twoSided: true })
</script>

<template>
  <div id="print-area" class="print-area">
    <SpellCard
      v-for="spell in spellList"
      :key="spell.name"
      :card-design="cardModel"
      :spell-info="spell"
      :two-sided="twoSided"
    />
  </div>
</template>

<style scoped>
.print-area {
  visibility: hidden;
}
</style>
