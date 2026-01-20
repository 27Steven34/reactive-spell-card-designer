<script setup lang="ts">
import { type CardModel } from '@/models/CardModel'
import CardBack from './CardBack.vue'
import CardFront from './CardFront.vue'
import type { SpellPageModel } from '@/models/SpellPageModel'

interface IProps {
  cardDesign: CardModel
  spellPage: SpellPageModel
  twoSided?: boolean
}

withDefaults(defineProps<IProps>(), { twoSided: true })

const quoted = (str: string) => `'${str}'`
</script>

<template>
  <div class="spellCard" :class="{ 'two-sided': twoSided }">
    <CardFront :spell-page="spellPage" />
    <CardBack v-if="twoSided" :level="spellPage.spell.level" />
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
