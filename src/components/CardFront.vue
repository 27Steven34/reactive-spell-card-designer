<script setup lang="ts">
import { type SpellModel } from '@/models/SpellModel'
import { hasMaterials, hasSpellInfo1, hasSpellInfo2, useSmallCardName } from '@/utils/LayoutUtils'
import { marked } from 'marked'

interface IProps {
  spell: SpellModel
}

defineProps<IProps>()
</script>

<template>
  <div class="front">
    <div class="body">
      <h3
        class="name lined srname"
        :class="{ small: useSmallCardName(spell.name) }"
        data-field="name"
      >
        {{ spell.name }}
      </h3>

      <div v-if="hasSpellInfo1(spell)" class="status lined" data-section="info-1">
        <div>
          <em>casting time</em><span data-field="castingTime">{{ spell.castingTime }}</span>
        </div>
        <div class="second">
          <em>range</em><span data-field="range">{{ spell.range }}</span>
        </div>
        <br clear="all" />
      </div>

      <div v-if="hasSpellInfo2(spell)" class="status lined" data-section="info-2">
        <div>
          <em>components</em><span data-field="components">{{ spell.components }}</span>
        </div>
        <div class="second">
          <em>duration</em><span data-field="duration">{{ spell.duration }}</span>
        </div>
        <br clear="all" />
      </div>

      <div v-if="hasMaterials(spell)" class="inset" data-section="materials">
        <b class="need" data-field="neededMaterials">{{ spell.neededMaterials }}</b>
      </div>

      <div class="text-container">
        <p
          v-dompurify-html="marked(spell.description)"
          class="text"
          :class="{ small: false }"
          data-field="description"
        ></p>
      </div>
    </div>
    <div class="footer">
      <b class="class" data-field="source">{{ spell.source }}</b>
      <b class="type" data-field="type">{{ spell.type }}</b>
    </div>
  </div>
</template>
