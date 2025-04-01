<script setup lang="ts">
import type { CardModel } from '@/models/CardModel'
import SpellCard from './SpellCard.vue'
import type { SpellModel } from '@/models/SpellModel'

interface IProps {
  cardModel: CardModel
  spellList: SpellModel[]
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
