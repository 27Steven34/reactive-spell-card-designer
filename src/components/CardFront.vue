<script setup lang="ts">
import { type SpellModel } from '@/models/SpellModel'
import { marked } from 'marked'

interface IProps {
  spell: SpellModel
}

defineProps<IProps>()
</script>

<template>
  <div class="front">
    <div class="body">
      <h3 class="name lined srname">{{ spell.name }}</h3>

      <div v-if="spell.castingTime != '' || spell.range != ''" class="status lined">
        <div><em>casting time</em>{{ spell.castingTime }}</div>
        <div class="second"><em>range</em>{{ spell.range }}</div>
        <br clear="all" />
      </div>

      <div v-if="spell.components != '' || spell.duration != ''" class="status lined">
        <div><em>components</em>{{ spell.components }}</div>
        <div class="second"><em>duration</em>{{ spell.duration }}</div>
        <br clear="all" />
      </div>

      <div v-if="spell.neededMaterials != ''" class="inset">
        <b class="need">{{ spell.neededMaterials }}</b>
      </div>

      <div class="text-container">
        <p v-dompurify-html="marked(spell.description)" class="text"></p>
      </div>
    </div>
    <div class="footer">
      <b class="class">{{ spell.source }}</b>
      <b class="type">{{ spell.type }}</b>
    </div>
  </div>
</template>

<style scoped>
.front .body {
  display: flex;
  flex-flow: column;
  background-color: #fff !important;
  border-radius: 5px;
  height: 100%;
  overflow: hidden;
}

.name {
  font-size: 14px;
  line-height: normal;
  padding: 6px 5px;
  margin: 0;
  text-transform: uppercase;
  text-align: center;
  min-height: 20px;
}

.srname {
  font-weight: bold;
}

.status {
  list-style: none;
  text-align: center;
  padding: 0;
  margin: 0;
}

.lined {
  border-bottom: 2px solid var(--class-color);
}

.status div {
  padding: 2px 4px;
  float: left;
  vertical-align: top;
  font-size: 9px;
  line-height: 9px;
  min-height: 25px;
  width: 50%;
  margin: 0;
}

.status div.second {
  border-left: 2px solid var(--class-color);
}

.status div em {
  font-style: normal;
  font-size: 10px;
  text-transform: uppercase;
  display: block;
  color: var(--class-color) !important;
  font-weight: bold;
  padding-bottom: 2px;
}

.inset .need {
  color: #fff !important;
  background-color: var(--class-color) !important;
  display: block;
  padding: 2px 4px 4px;
  font-weight: normal;
  font-style: italic;
  line-height: 100%;
  font-size: 8px;
}

.text-container {
  flex-grow: 1;
  overflow-y: auto;
}

.text {
  padding: 2px 4px;
  font-size: 10px;
  line-height: 9px;
  margin: 0;
}

.footer .class {
  position: absolute;
  bottom: 8px;
  color: #fff !important;
  left: 10px;
  font-size: 9px;
  font-weight: normal;
}

.footer .type {
  position: absolute;
  bottom: 8px;
  color: #fff !important;
  right: 10px;
  font-size: 10px;
  font-weight: normal;
}
</style>
