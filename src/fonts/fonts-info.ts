export interface FontInfo {
  name: string,
  rangeStart: string,
  rangeSize: number
}

export interface FontInfoList {
  [name: string]: FontInfo
}

const fontsInfo: FontInfoList = {
  /** Credit to "Lorc" for these icons */
  "rpg-icons": {
    name: "rpg-icons",
    rangeStart: 'e000',
    rangeSize: 789
  }
}

export default fontsInfo
