export interface SpellModel {
  name: string
  level: string
  castingTime: string
  range: string
  components: string
  duration: string
  neededMaterials: string
  description: string
  source: string
  type: string
}

export const emptySpell: SpellModel = {
  name: '',
  level: '',
  castingTime: '',
  range: '',
  components: '',
  duration: '',
  neededMaterials: '',
  description: '',
  source: '',
  type: '',
}

export const defaultSpells: SpellModel[] = [
  {
    name: 'Fireball',
    level: '3',
    castingTime: '1 action',
    range: '150 feet',
    components: 'V, S, M',
    duration: 'Instantaneous',
    neededMaterials: 'A tiny ball of bat guano and sulfur',
    description: `A bright streak flashes from your pointing finger to a point you choose within range and then blossoms with a low roar into an explosion of flame. Each creature in a 20-foot radius sphere centered on that point must make a Dexterity saving throw. A target takes 8d6 fire damage on a failed save, or half as much damage on a successful one.<br>The fire spreads around corners. It ignites flammable objects in the area that aren't being worn or carried.<br><b>At Higher Levels</b>: When you cast this spell using a spell slot of 4th level or higher, the damage increases by 1d6 for each slot level above 3rd.`,
    source: 'Wizard',
    type: '3rd Level Evocation',
  },
  {
    name: 'Fireball (with markup)',
    level: '3',
    castingTime: '1 action',
    range: '150 feet',
    components: 'V, S, M',
    duration: 'Instantaneous',
    neededMaterials: 'A tiny ball of bat guano and sulfur',
    description: `A <em>bright</em> streak <i>flashes</i> from <b>your</b> pointing <strong>finger</strong> to a <mark>point</mark> you <s>choose</s> with<sub>i</sub>n <small>range</small> and then bl<sup>oss</sup>oms with a <q>low</q> roar<br>into an ex<wbr>plosion of <code>flame</code>. Each creature in a 20-foot radius sphere centered on that point must make a Dexterity saving throw. A target takes 8d6 fire damage on a failed save, or half as much damage on a successful one.<br>The fire spreads around corners. It ignites flammable objects in the area that aren't being worn or carried.<br><b>At Higher Levels</b>: When you cast this spell using a spell slot of 4th level or higher, the damage increases by 1d6 for each slot level above 3rd.`,
    source: 'Wizard',
    type: '3rd Level Evocation',
  },
  {
    name: 'Meld into Stone (ritual)',
    level: '3',
    castingTime: '1 action',
    range: 'Touch',
    components: 'V, S',
    duration: '8 hours',
    neededMaterials: '',
    description: `You step into a stone object or surface large enough to fully contain your body, melding yourself and all the equipment you carry with the stone for the duration. Using your movement, you step into the stone at a point you can touch. Nothing of your presence remains visible or otherwise detectable by nonmagical senses.<br> While merged with the stone, you can't see what occurs outside it, and any Wisdom (Perception) checks you make to hear sounds outside it are made with disadvantage. You remain aware of the passage of time and can cast spells on yourself while merged in the stone. You can use your movement to leave the stone where you entered it, which ends the spell. You otherwise can't move.<br> Minor physical damage to the stone doesn't harm you, but its partial destruction or a change in its shape (to the extent that you no longer fit within it) expels you and deals 6d6 bludgeoning damage to you. The stone's complete destruction (or transmutation into a different substance) expels you and deals 50 bludgeoning damage to you. If expelled, you fall prone in an unoccupied space closest to where you first entered.`,
    source: 'Cleric',
    type: '3rd level Transmutation',
  },
  {
    name: 'Planar Binding',
    level: '5',
    castingTime: '1 hour',
    range: '60 feet',
    components: 'V, S, M',
    duration: '24 hours',
    neededMaterials: 'a jewel worth at least 1,000 gp, which the spell consumes',
    description: `With <i><b>this</b></i> spell, you attempt to bind a celestial, an elemental, a fey, or a fiend to your service. The creature must be within range for the entire casting of the spell. (Typically, the creature is first summoned into the center of an inverted <i>magic circle</i> in order to keep it trapped while this spell is cast.) At the completion of the casting, the target must make a Charisma saving throw. On a failed save, it is bound to serve you for the duration. If the creature was summoned or created by another spell, that spell's duration is extended to match the duration of this spell.<br> A bound creature must follow your instructions to the best of its ability. You might command the creature to accompany you on an adventure, to guard a location, or to deliver a message. The creature obeys the letter of your instructions, but if the creature is hostile to you, it strives to twist your words to achieve its own objectives. <b>If the creature carries out your instructions completely before the spell ends, it travels to you to report this fact if you are on the same plane of existence.</b> If you are on a different plane of existence, it returns to the place where you bound it and remains there until the spell ends.<br> <b>At Higher Levels</b>: When you cast this spell using a spell slot of a higher level, the duration increases to 10 days with a 6th-level slot, to 30 days with a 7th-level slot, to 180 days with an 8th-level slot, and to a year and a day with a 9th-level spell slot.`,
    source: 'Cleric',
    type: '5th level Abjuration',
  },
]
