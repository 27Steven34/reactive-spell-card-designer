<script setup lang="ts">
import { type CardModel } from '@/models/CardModel'
import { type SpellModel } from '@/models/SpellModel'
import CardBack from './CardBack.vue'
import CardFront from './CardFront.vue'

interface IProps {
  cardDesign: CardModel
  spellInfo: SpellModel
  twoSided?: boolean
}

withDefaults(defineProps<IProps>(), { twoSided: true })

const quoted = (str: string) => `'${str}'`
</script>

<template>
  <div class="spellCard" :class="{ 'two-sided': twoSided }">
    <CardFront :spell="spellInfo" />
    <CardBack v-if="twoSided" :level="spellInfo.level" />
  </div>
</template>

<style scoped>
.spellCard {
  --class-color: v-bind(cardDesign.color);
  --class-icon-top: v-bind(quoted(cardDesign.topIcon));
  --class-icon-mid: v-bind(quoted(cardDesign.midIcon));
  --class-icon-bot: v-bind(quoted(cardDesign.botIcon));
}
</style>
