<script setup lang="ts">
import CardCustomizer from '@/components/CardCustomizer.vue'
import CardPrint from '@/components/CardPrint.vue'
import SpellCard from '@/components/SpellCard.vue'
import SpellSelectionWidget from '@/components/SpellSelectionWidget.vue'
import { emptyCard, type CardModel } from '@/models/CardModel'
import { emptySpell, type SpellModel } from '@/models/SpellModel'
import { nextTick, ref } from 'vue'

const cardModel = ref<CardModel>(emptyCard)

const selectedSpell = ref<SpellModel>(emptySpell)

const twoSided = ref<boolean>(true)

const printing = ref<boolean>(false)
const printSpells = ref<SpellModel[]>([])
const print = async (spellList: SpellModel[]) => {
  printSpells.value = spellList
  printing.value = true
  await nextTick()
  window.print()
  printing.value = false
  printSpells.value = []
}
</script>

<template>
  <div class="options">
    <CardCustomizer @update-card="(newCard) => (cardModel = newCard)" />
    <SpellSelectionWidget
      @update-spell="(newSpell) => (selectedSpell = newSpell)"
      @print-spells="(spellList) => print(spellList)"
    />
  </div>
  <div class="spells">
    <SpellCard
      v-if="selectedSpell != undefined"
      :card-design="cardModel"
      :spell-info="selectedSpell"
      :two-sided="twoSided"
    />
  </div>
  <div v-if="printing">
    <CardPrint :card-model="cardModel" :spell-list="printSpells" :two-sided="twoSided" />
  </div>
</template>

<style scoped>
.spells {
  display: flex;
  flex-flow: row;
  justify-content: center;
}

.options {
  margin-bottom: 20px;
}
</style>
