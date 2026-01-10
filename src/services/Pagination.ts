import { applyCardDescription, applyCardLayout } from '@/layouts/CardLayout'
import { type SpellModel } from '@/models/SpellModel'
import { djb2Hash, spellID } from '@/utils/LayoutUtils'

interface PaginatedCard {
  objectId: string
  label: string
  pageNo: number
  pageCount: number
  card: SpellModel
}

export interface PaginationResult {
  pagesList: PaginatedCard[]
  pagesBySpell: Map<string, PaginatedCard[]>
}

let measureRoot: HTMLElement

async function initializePaginationEngine() {
  await document.fonts.ready

  if (measureRoot !== undefined) {
    return
  }

  measureRoot = document.createElement('div')
  measureRoot.className = 'measure-root spellCard'
  measureRoot.setAttribute('aria-hidden', 'true')

  document.body.appendChild(measureRoot)
}

export async function paginateSpells(spellList: SpellModel[]): Promise<PaginationResult> {
  await initializePaginationEngine()

  const pagesList: PaginatedCard[] = []
  const pagesBySpell = new Map<string, PaginatedCard[]>()

  for (const spell of spellList) {
    applyCardLayout(measureRoot, spell)

    const paginatedDescription = paginateText(spell.description)
    const spellPages = paginatedDescription.map((textPage, index): PaginatedCard => {
      const spellPart: SpellModel = { ...spell }
      if (paginatedDescription.length > 1) {
        spellPart.name += ` [${index + 1}/${paginatedDescription.length}]`
      }
      spellPart.description = textPage
      return {
        objectId: spellID(spell),
        label: spellPart.name,
        pageNo: index + 1,
        pageCount: paginatedDescription.length,
        card: spellPart,
      }
    })

    const hash = spellHash(spell).toString(16)
    pagesList.push(...spellPages)
    pagesBySpell.set(hash, spellPages)
  }

  return { pagesList, pagesBySpell }
}

/** non-cryptographic sync hash built from layout-affecting spell fields */
function spellHash(spell: SpellModel) {
  return djb2Hash(
    [spell.name, spell.castingTime, spell.duration, spell.neededMaterials, spell.description].join(
      '|',
    ),
  )
}

function paginateText(text: string) {
  const paginatedText = []
  const pageContainer = measureRoot.getElementsByClassName('text-container')[0] as HTMLElement

  // Everything fits in one page, easy return
  if (fitsInPage(text)) {
    return [text]
  }

  const textArray: string[] = text.split(' ')
  while (textArray.length > 0) {
    let min = 0
    let max = textArray.length - 1
    let mid = max
    while (min < max) {
      const words = textArray.slice(0, mid + 1).join(' ')
      if (fitsInPage(words)) {
        min = mid
      } else {
        max = mid - 1
      }
      mid = Math.floor((min + max + 1) / 2)
    }
    const textPage = textArray.splice(0, min + 1).join(' ')
    paginatedText.push(addUnopenedTags(textPage))
  }

  function fitsInPage(words: string) {
    applyCardDescription(measureRoot, words)
    return pageContainer!.offsetHeight >= pageContainer!.scrollHeight
  }

  function addUnopenedTags(text: string) {
    const tagPattern: RegExp = /<\/?([a-zA-Z]+)[^>]*>/g
    const openTags: string[] = []
    const closeTags: string[] = []
    let match: RegExpExecArray | null

    while ((match = tagPattern.exec(text)) !== null) {
      if (match[0][1] === '/') {
        // Closing tag
        const lastTag = openTags.pop()
        const newTag = match[1]
        if (lastTag === undefined) {
          closeTags.push(newTag)
        } else if (lastTag !== newTag) {
          // Mismatched tag, add the lastTag back and push new close tag
          openTags.push(lastTag)
          closeTags.push(newTag)
        }
      } else if (!['<br>', '<wbr>'].includes(match[0])) {
        // Opening tag
        openTags.push(match[1])
      }
    }

    // Add the unopened tags at the beginning of the text
    const unopenedTags = closeTags
      .reverse()
      .map((tag) => `<${tag}>`)
      .join('')
    return unopenedTags + text
  }

  return paginatedText
}
