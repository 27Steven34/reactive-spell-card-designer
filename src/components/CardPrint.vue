<script setup lang="ts">
import type { CardModel } from '@/models/CardModel'
import { useSpellListStore } from '@/stores/spellList'
import SpellCard from './SpellCard.vue'
import { useSpellPageStore } from '@/stores/spellPages'
import { spellHash } from '@/services/Pagination'

const spellListStore = useSpellListStore()
const spellPageStore = useSpellPageStore()

interface IProps {
  cardModel: CardModel
  twoSided?: boolean
}

withDefaults(defineProps<IProps>(), { twoSided: true })
</script>

<template>
  <div id="print-area" class="print-area">
    <template v-for="spell in spellListStore.spellList" :key="spell.name">
      <SpellCard
        v-for="spellPage in spellPageStore.pagesBySpell.get(spellHash(spell))"
        :key="spellPage.objectId"
        :card-design="cardModel"
        :spell-page="spellPage"
        :two-sided="twoSided"
      />
    </template>
  </div>
</template>

<style scoped>
.print-area {
  visibility: hidden;
}
</style>
