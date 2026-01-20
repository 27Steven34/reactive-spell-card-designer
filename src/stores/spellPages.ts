import type { SpellModel } from '@/models/SpellModel'
import { type SpellPageModel } from '@/models/SpellPageModel'
import { paginateSpells } from '@/services/Pagination'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useSpellPageStore = defineStore('spellPage', () => {
  const _pagesBySpell = ref<Map<string, SpellPageModel[]>>(new Map())
  const pagesBySpell = computed(() => _pagesBySpell.value)

  async function loadSpellPages(spellList: SpellModel[]) {
    _pagesBySpell.value = (await paginateSpells(spellList)).pagesBySpell
  }

  return { pagesBySpell, loadSpellPages }
})
