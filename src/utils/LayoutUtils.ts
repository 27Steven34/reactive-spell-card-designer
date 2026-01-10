import type { SpellModel } from '@/models/SpellModel'

export function spellID(spell: SpellModel) {
  return ['spell', spell.type, spell.level, spell.name].join('.')
}

export function useSmallCardName(name: string): boolean {
  return name.endsWith(']')
}

export function hasSpellInfo1(spellInfo: SpellModel): boolean {
  return !!(spellInfo.castingTime || spellInfo.range)
}

export function hasSpellInfo2(spellInfo: SpellModel): boolean {
  return !!(spellInfo.components || spellInfo.duration)
}

export function hasMaterials(spellInfo: SpellModel): boolean {
  return !!spellInfo.neededMaterials
}

export function djb2Hash(input: string) {
  let h = 5381
  for (let i = 0; i < input.length; i++) {
    h = (h * 33) ^ input.charCodeAt(i)
  }
  return h >>> 0
}
