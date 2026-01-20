<script setup lang="ts">
import type { SpellPageModel } from '@/models/SpellPageModel'
import { hasMaterials, hasSpellInfo1, hasSpellInfo2, useSmallCardName } from '@/utils/LayoutUtils'
import { marked } from 'marked'

interface IProps {
  spellPage: SpellPageModel
}

defineProps<IProps>()
</script>

<template>
  <div class="front">
    <div class="body">
      <h3
        class="name lined srname"
        :class="{ small: useSmallCardName(spellPage.spell.name) }"
        data-field="name"
      >
        {{ spellPage.spell.name }}
      </h3>

      <div v-if="hasSpellInfo1(spellPage.spell)" class="status lined" data-section="info-1">
        <div>
          <em>casting time</em
          ><span data-field="castingTime">{{ spellPage.spell.castingTime }}</span>
        </div>
        <div class="second">
          <em>range</em><span data-field="range">{{ spellPage.spell.range }}</span>
        </div>
        <br clear="all" />
      </div>

      <div v-if="hasSpellInfo2(spellPage.spell)" class="status lined" data-section="info-2">
        <div>
          <em>components</em><span data-field="components">{{ spellPage.spell.components }}</span>
        </div>
        <div class="second">
          <em>duration</em><span data-field="duration">{{ spellPage.spell.duration }}</span>
        </div>
        <br clear="all" />
      </div>

      <div v-if="hasMaterials(spellPage.spell)" class="inset" data-section="materials">
        <b class="need" data-field="neededMaterials">{{ spellPage.spell.neededMaterials }}</b>
      </div>

      <div class="text-container">
        <p
          v-dompurify-html="marked(spellPage.spell.description)"
          class="text"
          :class="{ small: spellPage.fontSize === 'small' }"
          data-field="description"
        ></p>
      </div>
    </div>
    <div class="footer">
      <b class="class" data-field="source">{{ spellPage.spell.source }}</b>
      <b class="type" data-field="type">{{ spellPage.spell.type }}</b>
    </div>
  </div>
</template>
