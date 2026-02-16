import { BlockType } from '../blocks/Block'
import { Tool, ToolType } from '../tools/ToolSystem'

// 附魔类型
export enum EnchantmentType {
  // 武器附魔
  SHARPNESS = 'sharpness',
  SMITE = 'smite',
  BANE_OF_ARTHROPODS = 'bane_of_arthropods',
  KNOCKBACK = 'knockback',
  FIRE_ASPECT = 'fire_aspect',
  LOOTING = 'looting',
  SWEEPING_EDGE = 'sweeping_edge',
  
  // 工具附魔
  EFFICIENCY = 'efficiency',
  SILK_TOUCH = 'silk_touch',
  FORTUNE = 'fortune',
  
  // 护甲附魔
  PROTECTION = 'protection',
  FIRE_PROTECTION = 'fire_protection',
  FEATHER_FALLING = 'feather_falling',
  BLAST_PROTECTION = 'blast_protection',
  PROJECTILE_PROTECTION = 'projectile_protection',
  RESPIRATION = 'respiration',
  AQUA_AFFINITY = 'aqua_affinity',
  THORNS = 'thorns',
  DEPTH_STRIDER = 'depth_strider',
  FROST_WALKER = 'frost_walker',
  SOUL_SPEED = 'soul_speed',
  
  // 弓附魔
  POWER = 'power',
  PUNCH = 'punch',
  FLAME = 'flame',
  INFINITY = 'infinity',
  
  // 三叉戟附魔
  LOYALTY = 'loyalty',
  IMPALING = 'impaling',
  RIPTIDE = 'riptide',
  CHANNELING = 'channeling',
  
  // 钓鱼竿附魔
  LURE = 'lure',
  LUCK_OF_THE_SEA = 'luck_of_the_sea',
  
  // 通用
  MENDING = 'mending',
  UNBREAKING = 'unbreaking',
  CURSE_OF_VANISHING = 'curse_of_vanishing',
  CURSE_OF_BINDING = 'curse_of_binding'
}

// 附魔属性
export interface Enchantment {
  type: EnchantmentType
  level: number
  name: string
  description: string
  maxLevel: number
  applicableItems: ToolType[]
  isCurse: boolean
  isTreasure: boolean
}

// 附魔定义
export const ENCHANTMENTS: Record<EnchantmentType, Omit<Enchantment, 'level'>> = {
  [EnchantmentType.SHARPNESS]: {
    type: EnchantmentType.SHARPNESS,
    name: '锋利',
    description: '增加近战伤害',
    maxLevel: 5,
    applicableItems: ['sword', 'axe'],
    isCurse: false,
    isTreasure: false
  },
  [EnchantmentType.SMITE]: {
    type: EnchantmentType.SMITE,
    name: '亡灵杀手',
    description: '对亡灵生物造成额外伤害',
    maxLevel: 5,
    applicableItems: ['sword', 'axe'],
    isCurse: false,
    isTreasure: false
  },
  [EnchantmentType.BANE_OF_ARTHROPODS]: {
    type: EnchantmentType.BANE_OF_ARTHROPODS,
    name: '节肢杀手',
    description: '对节肢生物造成额外伤害',
    maxLevel: 5,
    applicableItems: ['sword', 'axe'],
    isCurse: false,
    isTreasure: false
  },
  [EnchantmentType.KNOCKBACK]: {
    type: EnchantmentType.KNOCKBACK,
    name: '击退',
    description: '增加击退距离',
    maxLevel: 2,
    applicableItems: ['sword'],
    isCurse: false,
    isTreasure: false
  },
  [EnchantmentType.FIRE_ASPECT]: {
    type: EnchantmentType.FIRE_ASPECT,
    name: '火焰附加',
    description: '使目标着火',
    maxLevel: 2,
    applicableItems: ['sword'],
    isCurse: false,
    isTreasure: false
  },
  [EnchantmentType.LOOTING]: {
    type: EnchantmentType.LOOTING,
    name: '抢夺',
    description: '增加生物掉落物',
    maxLevel: 3,
    applicableItems: ['sword'],
    isCurse: false,
    isTreasure: false
  },
  [EnchantmentType.SWEEPING_EDGE]: {
    type: EnchantmentType.SWEEPING_EDGE,
    name: '横扫之刃',
    description: '增加横扫伤害',
    maxLevel: 3,
    applicableItems: ['sword'],
    isCurse: false,
    isTreasure: false
  },
  [EnchantmentType.EFFICIENCY]: {
    type: EnchantmentType.EFFICIENCY,
    name: '效率',
    description: '加快挖掘速度',
    maxLevel: 5,
    applicableItems: ['pickaxe', 'axe', 'shovel', 'hoe', 'shears'],
    isCurse: false,
    isTreasure: false
  },
  [EnchantmentType.SILK_TOUCH]: {
    type: EnchantmentType.SILK_TOUCH,
    name: '精准采集',
    description: '被挖掘的方块会掉落本身',
    maxLevel: 1,
    applicableItems: ['pickaxe', 'axe', 'shovel', 'hoe'],
    isCurse: false,
    isTreasure: false
  },
  [EnchantmentType.FORTUNE]: {
    type: EnchantmentType.FORTUNE,
    name: '时运',
    description: '增加方块掉落数量',
    maxLevel: 3,
    applicableItems: ['pickaxe', 'axe', 'shovel', 'hoe'],
    isCurse: false,
    isTreasure: false
  },
  [EnchantmentType.PROTECTION]: {
    type: EnchantmentType.PROTECTION,
    name: '保护',
    description: '减少受到的伤害',
    maxLevel: 4,
    applicableItems: ['helmet', 'chestplate', 'leggings', 'boots'],
    isCurse: false,
    isTreasure: false
  },
  [EnchantmentType.FIRE_PROTECTION]: {
    type: EnchantmentType.FIRE_PROTECTION,
    name: '火焰保护',
    description: '减少火焰伤害',
    maxLevel: 4,
    applicableItems: ['helmet', 'chestplate', 'leggings', 'boots'],
    isCurse: false,
    isTreasure: false
  },
  [EnchantmentType.FEATHER_FALLING]: {
    type: EnchantmentType.FEATHER_FALLING,
    name: '摔落保护',
    description: '减少摔落伤害',
    maxLevel: 4,
    applicableItems: ['boots'],
    isCurse: false,
    isTreasure: false
  },
  [EnchantmentType.BLAST_PROTECTION]: {
    type: EnchantmentType.BLAST_PROTECTION,
    name: '爆炸保护',
    description: '减少爆炸伤害',
    maxLevel: 4,
    applicableItems: ['helmet', 'chestplate', 'leggings', 'boots'],
    isCurse: false,
    isTreasure: false
  },
  [EnchantmentType.PROJECTILE_PROTECTION]: {
    type: EnchantmentType.PROJECTILE_PROTECTION,
    name: '弹射物保护',
    description: '减少弹射物伤害',
    maxLevel: 4,
    applicableItems: ['helmet', 'chestplate', 'leggings', 'boots'],
    isCurse: false,
    isTreasure: false
  },
  [EnchantmentType.RESPIRATION]: {
    type: EnchantmentType.RESPIRATION,
    name: '水下呼吸',
    description: '延长水下呼吸时间',
    maxLevel: 3,
    applicableItems: ['helmet'],
    isCurse: false,
    isTreasure: false
  },
  [EnchantmentType.AQUA_AFFINITY]: {
    type: EnchantmentType.AQUA_AFFINITY,
    name: '水下速掘',
    description: '加快水下挖掘速度',
    maxLevel: 1,
    applicableItems: ['helmet'],
    isCurse: false,
    isTreasure: false
  },
  [EnchantmentType.THORNS]: {
    type: EnchantmentType.THORNS,
    name: '荆棘',
    description: '反弹伤害给攻击者',
    maxLevel: 3,
    applicableItems: ['helmet', 'chestplate', 'leggings', 'boots'],
    isCurse: false,
    isTreasure: false
  },
  [EnchantmentType.DEPTH_STRIDER]: {
    type: EnchantmentType.DEPTH_STRIDER,
    name: '深海探索者',
    description: '加快水下移动速度',
    maxLevel: 3,
    applicableItems: ['boots'],
    isCurse: false,
    isTreasure: false
  },
  [EnchantmentType.FROST_WALKER]: {
    type: EnchantmentType.FROST_WALKER,
    name: '冰霜行者',
    description: '在水上行走时结冰',
    maxLevel: 2,
    applicableItems: ['boots'],
    isCurse: false,
    isTreasure: true
  },
  [EnchantmentType.SOUL_SPEED]: {
    type: EnchantmentType.SOUL_SPEED,
    name: '灵魂疾行',
    description: '在灵魂沙上加快移动',
    maxLevel: 3,
    applicableItems: ['boots'],
    isCurse: false,
    isTreasure: true
  },
  [EnchantmentType.POWER]: {
    type: EnchantmentType.POWER,
    name: '力量',
    description: '增加箭矢伤害',
    maxLevel: 5,
    applicableItems: ['bow'],
    isCurse: false,
    isTreasure: false
  },
  [EnchantmentType.PUNCH]: {
    type: EnchantmentType.PUNCH,
    name: '冲击',
    description: '增加箭矢击退效果',
    maxLevel: 2,
    applicableItems: ['bow'],
    isCurse: false,
    isTreasure: false
  },
  [EnchantmentType.FLAME]: {
    type: EnchantmentType.FLAME,
    name: '火矢',
    description: '使箭矢着火',
    maxLevel: 1,
    applicableItems: ['bow'],
    isCurse: false,
    isTreasure: false
  },
  [EnchantmentType.INFINITY]: {
    type: EnchantmentType.INFINITY,
    name: '无限',
    description: '无限箭矢（需要至少一支箭）',
    maxLevel: 1,
    applicableItems: ['bow'],
    isCurse: false,
    isTreasure: false
  },
  [EnchantmentType.LOYALTY]: {
    type: EnchantmentType.LOYALTY,
    name: '忠诚',
    description: '三叉戟会返回投掷者',
    maxLevel: 3,
    applicableItems: ['trident'],
    isCurse: false,
    isTreasure: false
  },
  [EnchantmentType.IMPALING]: {
    type: EnchantmentType.IMPALING,
    name: '穿刺',
    description: '对水生生物造成额外伤害',
    maxLevel: 5,
    applicableItems: ['trident'],
    isCurse: false,
    isTreasure: false
  },
  [EnchantmentType.RIPTIDE]: {
    type: EnchantmentType.RIPTIDE,
    name: '激流',
    description: '在水中或雨中投掷时推进玩家',
    maxLevel: 3,
    applicableItems: ['trident'],
    isCurse: false,
    isTreasure: false
  },
  [EnchantmentType.CHANNELING]: {
    type: EnchantmentType.CHANNELING,
    name: '引雷',
    description: '在雷暴天气召唤闪电',
    maxLevel: 1,
    applicableItems: ['trident'],
    isCurse: false,
    isTreasure: false
  },
  [EnchantmentType.LURE]: {
    type: EnchantmentType.LURE,
    name: '饵钓',
    description: '加快鱼咬钩速度',
    maxLevel: 3,
    applicableItems: ['fishing_rod'],
    isCurse: false,
    isTreasure: false
  },
  [EnchantmentType.LUCK_OF_THE_SEA]: {
    type: EnchantmentType.LUCK_OF_THE_SEA,
    name: '海之眷顾',
    description: '增加获得宝藏的概率',
    maxLevel: 3,
    applicableItems: ['fishing_rod'],
    isCurse: false,
    isTreasure: false
  },
  [EnchantmentType.MENDING]: {
    type: EnchantmentType.MENDING,
    name: '经验修补',
    description: '使用经验值修复耐久',
    maxLevel: 1,
    applicableItems: ['pickaxe', 'axe', 'shovel', 'hoe', 'sword', 'bow', 'helmet', 'chestplate', 'leggings', 'boots', 'fishing_rod', 'trident', 'shears', 'flint_and_steel', 'carrot_on_a_stick', 'warped_fungus_on_a_stick'],
    isCurse: false,
    isTreasure: true
  },
  [EnchantmentType.UNBREAKING]: {
    type: EnchantmentType.UNBREAKING,
    name: '耐久',
    description: '减少耐久消耗',
    maxLevel: 3,
    applicableItems: ['pickaxe', 'axe', 'shovel', 'hoe', 'sword', 'bow', 'helmet', 'chestplate', 'leggings', 'boots', 'fishing_rod', 'trident', 'shears', 'flint_and_steel', 'carrot_on_a_stick', 'warped_fungus_on_a_stick'],
    isCurse: false,
    isTreasure: false
  },
  [EnchantmentType.CURSE_OF_VANISHING]: {
    type: EnchantmentType.CURSE_OF_VANISHING,
    name: '消失诅咒',
    description: '死亡时消失',
    maxLevel: 1,
    applicableItems: ['pickaxe', 'axe', 'shovel', 'hoe', 'sword', 'bow', 'helmet', 'chestplate', 'leggings', 'boots', 'fishing_rod', 'trident', 'shears', 'flint_and_steel', 'carrot_on_a_stick', 'warped_fungus_on_a_stick'],
    isCurse: true,
    isTreasure: true
  },
  [EnchantmentType.CURSE_OF_BINDING]: {
    type: EnchantmentType.CURSE_OF_BINDING,
    name: '绑定诅咒',
    description: '无法取下',
    maxLevel: 1,
    applicableItems: ['helmet', 'chestplate', 'leggings', 'boots'],
    isCurse: true,
    isTreasure: true
  }
}

// 计算附魔等级成本
export function calculateEnchantmentCost(enchantments: Enchantment[]): number {
  let cost = 0
  for (const ench of enchantments) {
    // 基础成本 = 等级 × 附魔权重
    const weight = getEnchantmentWeight(ench.type)
    cost += ench.level * weight
  }
  return Math.min(30, cost) // 最高30级
}

// 获取附魔权重
function getEnchantmentWeight(type: EnchantmentType): number {
  const weights: Record<EnchantmentType, number> = {
    [EnchantmentType.PROTECTION]: 1,
    [EnchantmentType.FIRE_PROTECTION]: 2,
    [EnchantmentType.FEATHER_FALLING]: 2,
    [EnchantmentType.BLAST_PROTECTION]: 4,
    [EnchantmentType.PROJECTILE_PROTECTION]: 2,
    [EnchantmentType.RESPIRATION]: 2,
    [EnchantmentType.AQUA_AFFINITY]: 2,
    [EnchantmentType.THORNS]: 8,
    [EnchantmentType.DEPTH_STRIDER]: 2,
    [EnchantmentType.FROST_WALKER]: 4,
    [EnchantmentType.SOUL_SPEED]: 8,
    [EnchantmentType.SHARPNESS]: 1,
    [EnchantmentType.SMITE]: 2,
    [EnchantmentType.BANE_OF_ARTHROPODS]: 2,
    [EnchantmentType.KNOCKBACK]: 2,
    [EnchantmentType.FIRE_ASPECT]: 4,
    [EnchantmentType.LOOTING]: 4,
    [EnchantmentType.SWEEPING_EDGE]: 2,
    [EnchantmentType.EFFICIENCY]: 1,
    [EnchantmentType.SILK_TOUCH]: 8,
    [EnchantmentType.FORTUNE]: 4,
    [EnchantmentType.POWER]: 1,
    [EnchantmentType.PUNCH]: 4,
    [EnchantmentType.FLAME]: 4,
    [EnchantmentType.INFINITY]: 8,
    [EnchantmentType.LUCK_OF_THE_SEA]: 2,
    [EnchantmentType.LURE]: 2,
    [EnchantmentType.LOYALTY]: 1,
    [EnchantmentType.IMPALING]: 2,
    [EnchantmentType.RIPTIDE]: 2,
    [EnchantmentType.CHANNELING]: 8,
    [EnchantmentType.MENDING]: 4,
    [EnchantmentType.UNBREAKING]: 2,
    [EnchantmentType.CURSE_OF_VANISHING]: 8,
    [EnchantmentType.CURSE_OF_BINDING]: 8
  }
  return weights[type] || 1
}

// 检查附魔是否冲突
export function areEnchantmentsCompatible(ench1: EnchantmentType, ench2: EnchantmentType): boolean {
  // 互斥的附魔组
  const exclusiveGroups: EnchantmentType[][] = [
    // 保护类（只能有一个）
    [EnchantmentType.PROTECTION, EnchantmentType.FIRE_PROTECTION, EnchantmentType.BLAST_PROTECTION, EnchantmentType.PROJECTILE_PROTECTION],
    // 伤害类（只能有一个）
    [EnchantmentType.SHARPNESS, EnchantmentType.SMITE, EnchantmentType.BANE_OF_ARTHROPODS],
    // 采集类（只能有一个）
    [EnchantmentType.SILK_TOUCH, EnchantmentType.FORTUNE],
    // 冰霜行者和深海探索者
    [EnchantmentType.FROST_WALKER, EnchantmentType.DEPTH_STRIDER],
    // 忠诚和激流
    [EnchantmentType.LOYALTY, EnchantmentType.RIPTIDE],
    // 引雷和激流
    [EnchantmentType.CHANNELING, EnchantmentType.RIPTIDE],
    // 无限和经验修补
    [EnchantmentType.INFINITY, EnchantmentType.MENDING]
  ]
  
  for (const group of exclusiveGroups) {
    if (group.includes(ench1) && group.includes(ench2)) {
      return false
    }
  }
  
  return true
}

// 获取适用于物品的附魔列表
export function getApplicableEnchantments(toolType: ToolType): EnchantmentType[] {
  const result: EnchantmentType[] = []
  
  for (const [type, data] of Object.entries(ENCHANTMENTS)) {
    if (data.applicableItems.includes(toolType)) {
      result.push(type as EnchantmentType)
    }
  }
  
  return result
}

// 随机生成附魔选项
export function generateEnchantmentOptions(
  toolType: ToolType,
  bookshelfCount: number
): Array<{ enchantments: Enchantment[]; cost: number; levelRequirement: number }> {
  const options: Array<{ enchantments: Enchantment[]; cost: number; levelRequirement: number }> = []
  
  // 根据书架数量确定可用最高等级
  const maxAvailableLevel = Math.min(30, Math.floor(bookshelfCount / 15 * 30) + 5)
  
  // 生成3个选项
  const optionLevels = [
    Math.max(1, Math.floor(maxAvailableLevel * 0.3)),
    Math.max(1, Math.floor(maxAvailableLevel * 0.6)),
    Math.max(1, Math.floor(maxAvailableLevel * 0.9))
  ]
  
  const applicableEnchants = getApplicableEnchantments(toolType)
  
  for (const optionLevel of optionLevels) {
    const selectedEnchants: Enchantment[] = []
    let remainingPower = optionLevel
    
    // 随机选择附魔
    while (remainingPower > 0 && applicableEnchants.length > 0) {
      const randomIndex = Math.floor(Math.random() * applicableEnchants.length)
      const enchantType = applicableEnchants[randomIndex]
      const enchantData = ENCHANTMENTS[enchantType]
      
      // 检查是否与已选附魔冲突
      let hasConflict = false
      for (const selected of selectedEnchants) {
        if (!areEnchantmentsCompatible(enchantType, selected.type)) {
          hasConflict = true
          break
        }
      }
      
      if (hasConflict) continue
      
      // 随机等级
      const level = Math.min(
        enchantData.maxLevel,
        Math.max(1, Math.floor(Math.random() * remainingPower) + 1)
      )
      
      selectedEnchants.push({
        type: enchantType,
        level,
        name: enchantData.name,
        description: enchantData.description,
        maxLevel: enchantData.maxLevel,
        applicableItems: enchantData.applicableItems,
        isCurse: enchantData.isCurse,
        isTreasure: enchantData.isTreasure
      })
      
      remainingPower -= level
    }
    
    if (selectedEnchants.length > 0) {
      options.push({
        enchantments: selectedEnchants,
        cost: optionLevel,
        levelRequirement: Math.max(1, Math.floor(optionLevel * 0.7))
      })
    }
  }
  
  return options
}

// 应用附魔效果到工具
export function applyEnchantmentEffect(tool: Tool, enchantment: Enchantment): Tool {
  const newTool = { ...tool }
  
  if (!newTool.enchantments) {
    newTool.enchantments = []
  }
  
  // 检查是否已有同类型附魔
  const existingIndex = newTool.enchantments!.findIndex((e: Enchantment) => e.type === enchantment.type)
  
  if (existingIndex >= 0) {
    // 如果新等级更高，替换
    if (enchantment.level > newTool.enchantments[existingIndex].level) {
      newTool.enchantments[existingIndex] = enchantment
    }
  } else {
    newTool.enchantments.push(enchantment)
  }
  
  // 应用附魔效果
  switch (enchantment.type) {
    case EnchantmentType.EFFICIENCY:
      newTool.miningSpeed = (newTool.miningSpeed || 1) * (1 + enchantment.level * 0.3)
      break
    case EnchantmentType.UNBREAKING:
      newTool.maxDurability = Math.floor(newTool.maxDurability * (1 + enchantment.level * 0.5))
      break
    case EnchantmentType.SHARPNESS:
      newTool.attackDamage = (newTool.attackDamage || 1) + enchantment.level * 1.25
      break
    case EnchantmentType.SMITE:
      newTool.attackDamage = (newTool.attackDamage || 1) + enchantment.level * 2.5
      break
    case EnchantmentType.BANE_OF_ARTHROPODS:
      newTool.attackDamage = (newTool.attackDamage || 1) + enchantment.level * 2.5
      break
  }
  
  return newTool
}

// 获取附魔名称显示
export function getEnchantmentDisplayName(enchantment: Enchantment): string {
  const romanNumerals = ['I', 'II', 'III', 'IV', 'V']
  const level = Math.min(enchantment.level - 1, 4)
  return `${enchantment.name} ${romanNumerals[level]}`
}

// 附魔台书架检测
export function countBookshelvesAround(
  enchantingTable: [number, number, number],
  getBlockAt: (pos: [number, number, number]) => { type: BlockType } | undefined
): number {
  let count = 0
  const [ex, ey, ez] = enchantingTable
  
  // 检查15格范围内的书架
  for (let x = -2; x <= 2; x++) {
    for (let y = 0; y <= 1; y++) {
      for (let z = -2; z <= 2; z++) {
        if (x === 0 && z === 0) continue // 跳过附魔台位置
        
        const pos: [number, number, number] = [ex + x, ey + y, ez + z]
        const block = getBlockAt(pos)
        
        if (block?.type === 'bookshelf') {
          count++
        }
      }
    }
  }
  
  return Math.min(count, 15) // 最多15个书架有效
}
