import type { SpellModel } from '@/models/SpellModel'
import { hasMaterials, hasSpellInfo1, hasSpellInfo2, useSmallCardName } from '@/utils/LayoutUtils'
import DOMPurify from 'dompurify'
import { marked } from 'marked'

/**
 * This layout is used to create a DOM element for measuring pagination.
 * Any changes to the layout of `CardFront.vue` _must_ be replicated here to maintain pagination.
 */
export const CARD_TEMPLATE_HTML = `
  <div class="front">
    <div class="body">
      <h3 class="name lined srname" data-field="name"></h3>

      <div class="status lined" data-section="info-1">
        <div><em>casting time</em><span data-field="castingTime"></span></div>
        <div class="second"><em>range</em><span data-field="range"></span></div>
        <br clear="all" />
      </div>

      <div class="status lined" data-section="info-2">
        <div><em>components</em><span data-field="components"></span></div>
        <div class="second"><em>duration</em><span data-field="duration"></span></div>
        <br clear="all" />
      </div>

      <div class="inset" data-section="materials">
        <b class="need" data-field="neededMaterials"></b>
      </div>

      <div class="text-container">
        <p class="text" data-field="description"></p>
      </div>
    </div>
    <div class="footer">
      <b class="class" data-field="source"></b>
      <b class="type" data-field="type"></b>
    </div>
  </div>
`

export const selectors = {
  name: '[data-field="name"]',
  info1: '[data-section="info-1"]',
  castingTime: '[data-field="castingTime"]',
  range: '[data-field="range"]',
  info2: '[data-section="info-2"]',
  components: '[data-field="components"]',
  duration: '[data-field="duration"]',
  materials: '[data-section="materials"]',
  need: '[data-field="neededMaterials"]',
  text: '[data-field="description"]',
  class: '[data-field="source"]',
  type: '[data-field="type"]',
} as const

export function applyCardLayout(root: HTMLElement, spellInfo: SpellModel) {
  root.innerHTML = CARD_TEMPLATE_HTML

  // contents
  root.querySelector(selectors.name)!.textContent = spellInfo.name
  root.querySelector(selectors.castingTime)!.textContent = spellInfo.castingTime
  root.querySelector(selectors.range)!.textContent = spellInfo.range
  root.querySelector(selectors.components)!.textContent = spellInfo.components
  root.querySelector(selectors.duration)!.textContent = spellInfo.duration
  root.querySelector(selectors.need)!.textContent = spellInfo.neededMaterials
  root.querySelector(selectors.class)!.textContent = spellInfo.source
  root.querySelector(selectors.type)!.textContent = spellInfo.type

  // conditional formatting
  root.querySelector(selectors.name)!.classList.toggle('small', useSmallCardName(spellInfo.name))

  // conditional presence
  if (!hasSpellInfo1(spellInfo)) {
    root.querySelector(selectors.info1)!.remove()
  }
  if (!hasSpellInfo2(spellInfo)) {
    root.querySelector(selectors.info2)!.remove()
  }
  if (!hasMaterials(spellInfo)) {
    root.querySelector(selectors.materials)!.remove()
  }
}

export function applyCardDescription(root: HTMLElement, text: string) {
  const descriptionEl = root.querySelector(selectors.text)!
  descriptionEl.innerHTML = DOMPurify.sanitize(marked(text, { async: false }))
}

export function applyDescriptionFontSize(root: HTMLElement, fontSize: 'normal' | 'small') {
  const descriptionEl = root.querySelector(selectors.text)!
  descriptionEl.classList.toggle('small', fontSize === 'small')
}
