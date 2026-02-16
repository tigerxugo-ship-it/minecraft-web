import { BlockType, BlockProperties, MiningLevel } from '../blocks/Block'

// 红石相关方块类型扩展
export type RedstoneBlockType = 
  | 'redstone_dust'
  | 'redstone_torch'
  | 'redstone_block'
  | 'redstone_repeater'
  | 'redstone_comparator'
  | 'redstone_lamp'
  | 'piston'
  | 'sticky_piston'
  | 'dispenser'
  | 'dropper'
  | 'observer'
  | 'lever'
  | 'stone_button'
  | 'wooden_button'
  | 'stone_pressure_plate'
  | 'wooden_pressure_plate'
  | 'heavy_weighted_pressure_plate'
  | 'light_weighted_pressure_plate'
  | 'tripwire_hook'
  | 'note_block'
  | 'tnt'
  | 'iron_door'
  | 'wooden_door'
  | 'iron_trapdoor'
  | 'wooden_trapdoor'
  | 'fence_gate'
  | 'hopper'
  | 'daylight_detector'
  | 'trapped_chest'
  | 'target'

// 红石方块属性
export const REDSTONE_BLOCK_PROPERTIES: Record<RedstoneBlockType, BlockProperties> = {
  redstone_dust: {
    hardness: 0,
    transparent: true,
    color: '#8B0000',
    name: '红石粉',
    miningLevel: MiningLevel.HAND,
    dropItem: 'redstone_dust'
  },
  redstone_torch: {
    hardness: 0,
    transparent: true,
    color: '#FF4500',
    name: '红石火把',
    miningLevel: MiningLevel.HAND,
    dropItem: 'redstone_torch'
  },
  redstone_block: {
    hardness: 5,
    transparent: false,
    color: '#DC143C',
    name: '红石块',
    miningLevel: MiningLevel.WOOD,
    dropItem: 'redstone_block'
  },
  redstone_repeater: {
    hardness: 0,
    transparent: true,
    color: '#A0522D',
    name: '红石中继器',
    miningLevel: MiningLevel.HAND,
    dropItem: 'redstone_repeater'
  },
  redstone_comparator: {
    hardness: 0,
    transparent: true,
    color: '#D2691E',
    name: '红石比较器',
    miningLevel: MiningLevel.HAND,
    dropItem: 'redstone_comparator'
  },
  redstone_lamp: {
    hardness: 0.3,
    transparent: true,
    color: '#4A3728',
    name: '红石灯',
    miningLevel: MiningLevel.HAND,
    dropItem: 'redstone_lamp'
  },
  piston: {
    hardness: 0.5,
    transparent: false,
    color: '#A0A0A0',
    name: '活塞',
    miningLevel: MiningLevel.WOOD,
    dropItem: 'piston'
  },
  sticky_piston: {
    hardness: 0.5,
    transparent: false,
    color: '#8FBC8F',
    name: '粘性活塞',
    miningLevel: MiningLevel.WOOD,
    dropItem: 'sticky_piston'
  },
  dispenser: {
    hardness: 3.5,
    transparent: false,
    color: '#606060',
    name: '发射器',
    miningLevel: MiningLevel.WOOD,
    dropItem: 'dispenser'
  },
  dropper: {
    hardness: 3.5,
    transparent: false,
    color: '#707070',
    name: '投掷器',
    miningLevel: MiningLevel.WOOD,
    dropItem: 'dropper'
  },
  observer: {
    hardness: 3,
    transparent: false,
    color: '#696969',
    name: '侦测器',
    miningLevel: MiningLevel.WOOD,
    dropItem: 'observer'
  },
  lever: {
    hardness: 0.5,
    transparent: true,
    color: '#8B7355',
    name: '拉杆',
    miningLevel: MiningLevel.HAND,
    dropItem: 'lever'
  },
  stone_button: {
    hardness: 0.5,
    transparent: true,
    color: '#808080',
    name: '石质按钮',
    miningLevel: MiningLevel.HAND,
    dropItem: 'stone_button'
  },
  wooden_button: {
    hardness: 0.5,
    transparent: true,
    color: '#8B4513',
    name: '木质按钮',
    miningLevel: MiningLevel.HAND,
    dropItem: 'wooden_button'
  },
  stone_pressure_plate: {
    hardness: 0.5,
    transparent: true,
    color: '#808080',
    name: '石质压力板',
    miningLevel: MiningLevel.HAND,
    dropItem: 'stone_pressure_plate'
  },
  wooden_pressure_plate: {
    hardness: 0.5,
    transparent: true,
    color: '#8B4513',
    name: '木质压力板',
    miningLevel: MiningLevel.HAND,
    dropItem: 'wooden_pressure_plate'
  },
  heavy_weighted_pressure_plate: {
    hardness: 0.5,
    transparent: true,
    color: '#FFD700',
    name: '重质测重压力板',
    miningLevel: MiningLevel.HAND,
    dropItem: 'heavy_weighted_pressure_plate'
  },
  light_weighted_pressure_plate: {
    hardness: 0.5,
    transparent: true,
    color: '#FFA500',
    name: '轻质测重压力板',
    miningLevel: MiningLevel.HAND,
    dropItem: 'light_weighted_pressure_plate'
  },
  tripwire_hook: {
    hardness: 0,
    transparent: true,
    color: '#8B7355',
    name: '绊线钩',
    miningLevel: MiningLevel.HAND,
    dropItem: 'tripwire_hook'
  },
  note_block: {
    hardness: 0.8,
    transparent: false,
    color: '#8B6914',
    name: '音符盒',
    miningLevel: MiningLevel.HAND,
    dropItem: 'note_block'
  },
  tnt: {
    hardness: 0,
    transparent: false,
    color: '#FF6347',
    name: 'TNT',
    miningLevel: MiningLevel.HAND,
    dropItem: 'tnt'
  },
  iron_door: {
    hardness: 5,
    transparent: true,
    color: '#C0C0C0',
    name: '铁门',
    miningLevel: MiningLevel.WOOD,
    dropItem: 'iron_door'
  },
  wooden_door: {
    hardness: 3,
    transparent: true,
    color: '#8B4513',
    name: '木门',
    miningLevel: MiningLevel.HAND,
    dropItem: 'wooden_door'
  },
  iron_trapdoor: {
    hardness: 5,
    transparent: true,
    color: '#C0C0C0',
    name: '铁活板门',
    miningLevel: MiningLevel.WOOD,
    dropItem: 'iron_trapdoor'
  },
  wooden_trapdoor: {
    hardness: 3,
    transparent: true,
    color: '#8B4513',
    name: '木活板门',
    miningLevel: MiningLevel.HAND,
    dropItem: 'wooden_trapdoor'
  },
  fence_gate: {
    hardness: 2,
    transparent: true,
    color: '#8B4513',
    name: '栅栏门',
    miningLevel: MiningLevel.HAND,
    dropItem: 'fence_gate'
  },
  hopper: {
    hardness: 3,
    transparent: false,
    color: '#4A4A4A',
    name: '漏斗',
    miningLevel: MiningLevel.WOOD,
    dropItem: 'hopper'
  },
  daylight_detector: {
    hardness: 0.2,
    transparent: true,
    color: '#D2691E',
    name: '阳光探测器',
    miningLevel: MiningLevel.HAND,
    dropItem: 'daylight_detector'
  },
  trapped_chest: {
    hardness: 2.5,
    transparent: false,
    color: '#D2691E',
    name: '陷阱箱',
    miningLevel: MiningLevel.HAND,
    dropItem: 'trapped_chest'
  },
  target: {
    hardness: 0.5,
    transparent: false,
    color: '#FF6B6B',
    name: '标靶',
    miningLevel: MiningLevel.HAND,
    dropItem: 'target'
  }
}

// 检查是否是红石方块
export function isRedstoneBlock(type: BlockType): boolean {
  return type in REDSTONE_BLOCK_PROPERTIES
}

// 获取红石方块属性
export function getRedstoneBlockProperty(type: RedstoneBlockType): BlockProperties {
  return REDSTONE_BLOCK_PROPERTIES[type]
}

// 红石合成配方
export interface RedstoneRecipe {
  output: RedstoneBlockType
  count: number
  ingredients: (BlockType | null)[][]
}

// 红石相关合成配方
export const REDSTONE_RECIPES: RedstoneRecipe[] = [
  {
    output: 'redstone_torch',
    count: 1,
    ingredients: [
      [null, 'redstone_dust', null],
      [null, 'stick', null]
    ]
  },
  {
    output: 'redstone_repeater',
    count: 1,
    ingredients: [
      ['redstone_torch', 'redstone_dust', 'redstone_torch'],
      ['stone', 'stone', 'stone']
    ]
  },
  {
    output: 'redstone_comparator',
    count: 1,
    ingredients: [
      [null, 'redstone_torch', null],
      ['redstone_torch', 'quartz', 'redstone_torch'],
      ['stone', 'stone', 'stone']
    ]
  },
  {
    output: 'redstone_lamp',
    count: 1,
    ingredients: [
      [null, 'redstone_dust', null],
      ['redstone_dust', 'glowstone', 'redstone_dust'],
      [null, 'redstone_dust', null]
    ]
  },
  {
    output: 'piston',
    count: 1,
    ingredients: [
      ['planks', 'planks', 'planks'],
      ['cobblestone', 'iron_ingot', 'cobblestone'],
      ['cobblestone', 'redstone_dust', 'cobblestone']
    ]
  },
  {
    output: 'sticky_piston',
    count: 1,
    ingredients: [
      ['slime_ball'],
      ['piston']
    ]
  },
  {
    output: 'dispenser',
    count: 1,
    ingredients: [
      ['cobblestone', 'cobblestone', 'cobblestone'],
      ['cobblestone', 'bow', 'cobblestone'],
      ['cobblestone', 'redstone_dust', 'cobblestone']
    ]
  },
  {
    output: 'dropper',
    count: 1,
    ingredients: [
      ['cobblestone', 'cobblestone', 'cobblestone'],
      ['cobblestone', null, 'cobblestone'],
      ['cobblestone', 'redstone_dust', 'cobblestone']
    ]
  },
  {
    output: 'observer',
    count: 1,
    ingredients: [
      ['cobblestone', 'cobblestone', 'cobblestone'],
      ['redstone_dust', 'redstone_dust', 'quartz'],
      ['cobblestone', 'cobblestone', 'cobblestone']
    ]
  },
  {
    output: 'lever',
    count: 1,
    ingredients: [
      ['stick'],
      ['cobblestone']
    ]
  },
  {
    output: 'stone_button',
    count: 1,
    ingredients: [
      ['stone']
    ]
  },
  {
    output: 'wooden_button',
    count: 1,
    ingredients: [
      ['planks']
    ]
  },
  {
    output: 'stone_pressure_plate',
    count: 1,
    ingredients: [
      ['stone', 'stone']
    ]
  },
  {
    output: 'wooden_pressure_plate',
    count: 1,
    ingredients: [
      ['planks', 'planks']
    ]
  },
  {
    output: 'heavy_weighted_pressure_plate',
    count: 1,
    ingredients: [
      ['iron_ingot', 'iron_ingot']
    ]
  },
  {
    output: 'light_weighted_pressure_plate',
    count: 1,
    ingredients: [
      ['gold_ingot', 'gold_ingot']
    ]
  },
  {
    output: 'note_block',
    count: 1,
    ingredients: [
      ['planks', 'planks', 'planks'],
      ['planks', 'redstone_dust', 'planks'],
      ['planks', 'planks', 'planks']
    ]
  },
  {
    output: 'tnt',
    count: 1,
    ingredients: [
      ['gunpowder', 'sand', 'gunpowder'],
      ['sand', 'gunpowder', 'sand'],
      ['gunpowder', 'sand', 'gunpowder']
    ]
  },
  {
    output: 'hopper',
    count: 1,
    ingredients: [
      ['iron_ingot', null, 'iron_ingot'],
      ['iron_ingot', 'chest', 'iron_ingot'],
      [null, 'iron_ingot', null]
    ]
  },
  {
    output: 'daylight_detector',
    count: 1,
    ingredients: [
      ['glass', 'glass', 'glass'],
      ['quartz', 'quartz', 'quartz'],
      ['wood', 'wood', 'wood']
    ]
  },
  {
    output: 'target',
    count: 1,
    ingredients: [
      [null, 'redstone_dust', null],
      ['redstone_dust', 'hay_block', 'redstone_dust'],
      [null, 'redstone_dust', null]
    ]
  }
]

// 音符盒音符
export const NOTE_BLOCK_NOTES = [
  'F♯', 'G', 'G♯', 'A', 'A♯', 'B',
  'C', 'C♯', 'D', 'D♯', 'E', 'F',
  'F♯', 'G', 'G♯', 'A', 'A♯', 'B',
  'C', 'C♯', 'D', 'D♯', 'E', 'F',
  'F♯'
]

// 获取音符盒音高
export function getNoteBlockPitch(clicks: number): number {
  return clicks % 25
}

// 获取音符名称
export function getNoteName(clicks: number): string {
  return NOTE_BLOCK_NOTES[getNoteBlockPitch(clicks)]
}
