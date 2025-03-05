export interface CardModel {
  name: string
  color: string
  topIcon: string
  midIcon: string
  botIcon: string
}

export interface CardListModel {
  [index: number]: CardModel
}

export const emptyCard: CardModel = {
  name: '',
  color: '#000000',
  topIcon: '',
  midIcon: '',
  botIcon: '',
}

const defaultClasses: CardListModel = {
  0: {
    name: 'Bard',
    color: '#8c5385',
    topIcon: '\ue314',
    midIcon: '\ue077',
    botIcon: '\ue2e1',
  },
  1: {
    name: 'Cleric',
    color: '#ffad46',
    topIcon: '\ue042',
    midIcon: '\ue0f2',
    botIcon: '\ue0b7',
  },
  2: {
    name: 'Druid',
    color: '#60b85d',
    topIcon: '\ue027',
    midIcon: '\ue066',
    botIcon: '\ue127',
  },
  3: {
    name: 'Paladin',
    color: '#3bafb1',
    topIcon: '\ue1c1',
    midIcon: '\ue2c5',
    botIcon: '\ue055',
  },
  4: {
    name: 'Ranger',
    color: '#857056',
    topIcon: '\ue29d',
    midIcon: '\ue05e',
    botIcon: '\ue123',
  },
  5: {
    name: 'Sorcerer',
    color: '#f83a22',
    topIcon: '\ue2f2',
    midIcon: '\ue1b5',
    botIcon: '\ue30f',
  },
  6: {
    name: 'Warlock',
    color: '#8c5385',
    topIcon: '\ue01d',
    midIcon: '\ue173',
    botIcon: '\ue23d',
  },
  7: {
    name: 'Wizard',
    color: '#800000',
    topIcon: '\ue208',
    midIcon: '\ue0c9',
    botIcon: '\ue1f2',
  },
  99: {
    name: 'Other',
    color: '#4986e7',
    topIcon: '\ue2ef',
    midIcon: '\ue26f',
    botIcon: '\ue29e',
  },
}

export default defaultClasses
