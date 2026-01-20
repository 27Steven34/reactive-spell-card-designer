import type { SpellModel } from './SpellModel'

export type CardFontOption = 'normal' | 'small'

export interface SpellPageModel {
  objectId: string
  label: string
  pageNo: number
  pageCount: number
  fontSize: CardFontOption
  spell: SpellModel
}

export interface PaginationResult {
  pagesList: SpellPageModel[]
  pagesBySpell: Map<string, SpellPageModel[]>
}
