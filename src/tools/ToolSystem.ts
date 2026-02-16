import { MiningLevel, BlockType, canMineBlock } from '../blocks/Block'
import type { Enchantment } from '../enchanting/EnchantmentSystem'

// 工具类型（扩展以支持附魔系统）
export type ToolType = 
  // 基础工具
  | 'pickaxe' | 'sword' | 'axe' | 'shovel' | 'hoe' | 'shears'
  // 护甲
  | 'helmet' | 'chestplate' | 'leggings' | 'boots'
  // 武器/工具
  | 'bow' | 'trident' | 'fishing_rod'
  // 其他
  | 'flint_and_steel' | 'carrot_on_a_stick' | 'warped_fungus_on_a_stick'

// 工具材料
export type ToolMaterial = 'wood' | 'stone' | 'iron' | 'gold' | 'diamond'

// 工具接口
export interface Tool {
  id: string
  name: string
  type: ToolType
  material: ToolMaterial
  durability: number
  maxDurability: number
  miningLevel: MiningLevel
  miningSpeed: number  // 挖掘速度倍率
  attackDamage: number
  enchantments?: Enchantment[]  // 附魔列表
}

// 材料属性
const MATERIAL_PROPERTIES: Record<ToolMaterial, {
  miningLevel: MiningLevel
  durabilityMultiplier: number
  miningSpeed: number
  attackMultiplier: number
  color: string
}> = {
  wood: {
    miningLevel: MiningLevel.WOOD,
    durabilityMultiplier: 1,
    miningSpeed: 2,
    attackMultiplier: 0.5,
    color: '#8B7355'
  },
  stone: {
    miningLevel: MiningLevel.STONE,
    durabilityMultiplier: 2.2,
    miningSpeed: 4,
    attackMultiplier: 0.75,
    color: '#808080'
  },
  iron: {
    miningLevel: MiningLevel.IRON,
    durabilityMultiplier: 4.17,
    miningSpeed: 6,
    attackMultiplier: 1,
    color: '#C0C0C0'
  },
  gold: {
    miningLevel: MiningLevel.WOOD,  // 金镐等级低
    durabilityMultiplier: 0.33,
    miningSpeed: 12,  // 但是速度很快
    attackMultiplier: 0.5,
    color: '#FFD700'
  },
  diamond: {
    miningLevel: MiningLevel.IRON,
    durabilityMultiplier: 10,
    miningSpeed: 8,
    attackMultiplier: 1.25,
    color: '#00CED1'
  }
}

// 基础耐久度
const BASE_DURABILITY: Record<ToolType, number> = {
  pickaxe: 60,
  sword: 60,
  axe: 60,
  shovel: 60,
  hoe: 60,
  helmet: 55,
  chestplate: 80,
  leggings: 75,
  boots: 65,
  bow: 60,
  trident: 60,
  fishing_rod: 64,
  shears: 60,
  flint_and_steel: 64,
  carrot_on_a_stick: 25,
  warped_fungus_on_a_stick: 25
}

// 基础攻击力
const BASE_ATTACK: Record<ToolType, number> = {
  pickaxe: 2,
  sword: 4,
  axe: 3,
  shovel: 1,
  hoe: 1,
  helmet: 0,
  chestplate: 0,
  leggings: 0,
  boots: 0,
  bow: 0,
  trident: 4,
  fishing_rod: 0,
  shears: 0,
  flint_and_steel: 0,
  carrot_on_a_stick: 0,
  warped_fungus_on_a_stick: 0
}

// 创建工具
export function createTool(
  type: ToolType,
  material: ToolMaterial,
  customName?: string
): Tool {
  const matProps = MATERIAL_PROPERTIES[material]
  const baseDurability = BASE_DURABILITY[type]
  const baseAttack = BASE_ATTACK[type]

  const materialNames: Record<ToolMaterial, string> = {
    wood: '木',
    stone: '石',
    iron: '铁',
    gold: '金',
    diamond: '钻石'
  }

  const typeNames: Record<ToolType, string> = {
    pickaxe: '镐',
    sword: '剑',
    axe: '斧',
    shovel: '锹',
    hoe: '锄',
    helmet: '头盔',
    chestplate: '胸甲',
    leggings: '护腿',
    boots: '靴子',
    bow: '弓',
    trident: '三叉戟',
    fishing_rod: '钓鱼竿',
    shears: '剪刀',
    flint_and_steel: '打火石',
    carrot_on_a_stick: '胡萝卜钓竿',
    warped_fungus_on_a_stick: '诡异菌钓竿'
  }

  return {
    id: `${material}_${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: customName || `${materialNames[material]}${typeNames[type]}`,
    type,
    material,
    durability: Math.floor(baseDurability * matProps.durabilityMultiplier),
    maxDurability: Math.floor(baseDurability * matProps.durabilityMultiplier),
    miningLevel: matProps.miningLevel,
    miningSpeed: matProps.miningSpeed,
    attackDamage: Math.floor(baseAttack * matProps.attackMultiplier)
  }
}

// 预设工具
export const PRESET_TOOLS = {
  // 木工具
  woodenPickaxe: () => createTool('pickaxe', 'wood'),
  woodenSword: () => createTool('sword', 'wood'),
  woodenAxe: () => createTool('axe', 'wood'),
  woodenShovel: () => createTool('shovel', 'wood'),
  
  // 石工具
  stonePickaxe: () => createTool('pickaxe', 'stone'),
  stoneSword: () => createTool('sword', 'stone'),
  stoneAxe: () => createTool('axe', 'stone'),
  stoneShovel: () => createTool('shovel', 'stone'),
  
  // 铁工具
  ironPickaxe: () => createTool('pickaxe', 'iron'),
  ironSword: () => createTool('sword', 'iron'),
  ironAxe: () => createTool('axe', 'iron'),
  ironShovel: () => createTool('shovel', 'iron'),
  
  // 金工具
  goldenPickaxe: () => createTool('pickaxe', 'gold'),
  goldenSword: () => createTool('sword', 'gold'),
  
  // 钻石工具
  diamondPickaxe: () => createTool('pickaxe', 'diamond'),
  diamondSword: () => createTool('sword', 'diamond'),
  diamondAxe: () => createTool('axe', 'diamond')
}

// 使用工具 (消耗耐久度)
export function useTool(tool: Tool, damage: number = 1): Tool | null {
  const newDurability = tool.durability - damage
  
  if (newDurability <= 0) {
    // 工具损坏
    return null
  }
  
  return {
    ...tool,
    durability: newDurability
  }
}

// 修复工具 (用于合成修复)
export function repairTool(tool: Tool, amount: number): Tool {
  return {
    ...tool,
    durability: Math.min(tool.durability + amount, tool.maxDurability)
  }
}

// 获取挖掘时间 (秒)
export function getMiningTime(
  blockHardness: number,
  tool: Tool | null,
  blockType: BlockType,
  isCorrectTool: boolean
): number {
  // 检查是否可以挖掘
  if (tool && !canMineBlock(blockType, tool.miningLevel)) {
    return blockHardness * 5  // 挖掘等级不足，速度极慢
  }

  if (tool && isCorrectTool) {
    // 使用正确工具
    return blockHardness / tool.miningSpeed
  } else {
    // 徒手或使用错误工具
    return blockHardness * 1.5
  }
}

// 检查工具是否适合挖掘方块
export function isCorrectTool(toolType: ToolType, blockType: BlockType): boolean {
  // 镐 - 石头、矿石
  const pickaxeBlocks: BlockType[] = ['stone', 'coal_ore', 'iron_ore', 'gold_ore', 'diamond_ore', 'cobblestone']
  
  // 斧 - 木头
  const axeBlocks: BlockType[] = ['wood', 'planks', 'crafting_table']
  
  // 锹 - 泥土、沙子、沙砾
  const shovelBlocks: BlockType[] = ['dirt', 'grass', 'sand']
  
  switch (toolType) {
    case 'pickaxe':
      return pickaxeBlocks.includes(blockType)
    case 'axe':
      return axeBlocks.includes(blockType)
    case 'shovel':
      return shovelBlocks.includes(blockType)
    default:
      return false
  }
}

// 获取工具颜色 (用于UI显示)
export function getToolColor(tool: Tool): string {
  return MATERIAL_PROPERTIES[tool.material].color
}

// 获取耐久度百分比
export function getDurabilityPercent(tool: Tool): number {
  return (tool.durability / tool.maxDurability) * 100
}

// 获取工具图标 (简化为首字母)
export function getToolIcon(tool: Tool): string {
  const icons: Record<ToolType, string> = {
    pickaxe: '⛏',
    sword: '⚔',
    axe: '🪓',
    shovel: '🔨',
    hoe: '↳',
    helmet: '🪖',
    chestplate: '👕',
    leggings: '👖',
    boots: '👢',
    bow: '🏹',
    trident: '🔱',
    fishing_rod: '🎣',
    shears: '✂',
    flint_and_steel: '🔥',
    carrot_on_a_stick: '🥕',
    warped_fungus_on_a_stick: '🍄'
  }
  return icons[tool.type] || '?'
}
