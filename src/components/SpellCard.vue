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

.spellCard {
  font-family: 'Lato', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  display: inline-block;
  width: 2.5in;
  min-width: 2.5in;
  max-width: 2.5in;
  height: 3.5in;
  max-height: 3.5in;
  background: var(--class-color) !important;
  padding: 0;
  font-size: 10px;
  position: relative;
  margin: 0px;
  vertical-align: top;
  text-align: left;
  z-index: 1;
  margin: 0 1px 1px 0;
}

.two-sided.spellCard {
  width: 5in;
  min-width: 5in;
}

.spellCard * {
  color: #676a6c !important;
}

.spellCard .front,
.spellCard .back {
  display: block;
  height: 100%;
  width: 100%;
  position: absolute;
}

.two-sided.spellCard .front,
.two-sided.spellCard .back {
  width: 50%;
}

.spellCard .front {
  padding: 10px 10px 25px;
  top: 0;
  left: 0;
}

.spellCard .back {
  padding: 10px 10px 10px;
  top: 0;
  left: auto;
  right: 0;
  transform: rotateY(0deg);
}
</style>
