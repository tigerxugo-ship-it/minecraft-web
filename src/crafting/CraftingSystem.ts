import { BlockType } from '../blocks/Block'
import { Tool, createTool } from '../tools/ToolSystem'

// 配方类型
export type RecipeType = 'shaped' | 'shapeless' | 'furnace'

// 有序配方 (3x3网格)
export interface ShapedRecipe {
  type: 'shaped'
  pattern: (BlockType | null)[][]  // 3x3网格，null表示空
  result: {
    type: BlockType | 'tool'
    count: number
    tool?: () => Tool
  }
}

// 无序配方
export interface ShapelessRecipe {
  type: 'shapeless'
  ingredients: BlockType[]  // 所需材料列表
  result: {
    type: BlockType | 'tool'
    count: number
    tool?: () => Tool
  }
}

// 熔炉配方
export interface FurnaceRecipe {
  type: 'furnace'
  input: BlockType
  fuel: BlockType  // 燃料类型
  result: {
    type: BlockType
    count: number
  }
  cookTime: number  // 烹饪时间（秒）
}

export type CraftingRecipe = ShapedRecipe | ShapelessRecipe
export type SmeltingRecipe = FurnaceRecipe

// 有序配方表
const SHAPED_RECIPES: ShapedRecipe[] = [
  // 木板 - 1个木头 = 4个木板
  {
    type: 'shaped',
    pattern: [
      [null, null, null],
      [null, 'wood', null],
      [null, null, null]
    ],
    result: { type: 'planks', count: 4 }
  },
  
  // 木棍 - 2个木板竖放 = 4个木棍
  {
    type: 'shaped',
    pattern: [
      [null, 'planks', null],
      [null, 'planks', null],
      [null, null, null]
    ],
    result: { type: 'stick', count: 4 }
  },
  
  // 工作台 - 4个木板 2x2 = 1个工作台
  {
    type: 'shaped',
    pattern: [
      ['planks', 'planks', null],
      ['planks', 'planks', null],
      [null, null, null]
    ],
    result: { type: 'crafting_table', count: 1 }
  },
  
  // 木镐 - 3个木板顶行 + 2个木棍竖放
  {
    type: 'shaped',
    pattern: [
      ['planks', 'planks', 'planks'],
      [null, 'stick', null],
      [null, 'stick', null]
    ],
    result: { type: 'tool', count: 1, tool: () => createTool('pickaxe', 'wood') }
  },
  
  // 石镐 - 3个圆石顶行 + 2个木棍竖放
  {
    type: 'shaped',
    pattern: [
      ['cobblestone', 'cobblestone', 'cobblestone'],
      [null, 'stick', null],
      [null, 'stick', null]
    ],
    result: { type: 'tool', count: 1, tool: () => createTool('pickaxe', 'stone') }
  },
  
  // 铁镐 - 3个铁锭顶行 + 2个木棍竖放
  {
    type: 'shaped',
    pattern: [
      ['iron_ingot', 'iron_ingot', 'iron_ingot'],
      [null, 'stick', null],
      [null, 'stick', null]
    ],
    result: { type: 'tool', count: 1, tool: () => createTool('pickaxe', 'iron') }
  },
  
  // 金镐 - 3个金锭顶行 + 2个木棍竖放
  {
    type: 'shaped',
    pattern: [
      ['gold_ingot', 'gold_ingot', 'gold_ingot'],
      [null, 'stick', null],
      [null, 'stick', null]
    ],
    result: { type: 'tool', count: 1, tool: () => createTool('pickaxe', 'gold') }
  },
  
  // 钻石镐 - 3个钻石顶行 + 2个木棍竖放
  {
    type: 'shaped',
    pattern: [
      ['diamond', 'diamond', 'diamond'],
      [null, 'stick', null],
      [null, 'stick', null]
    ],
    result: { type: 'tool', count: 1, tool: () => createTool('pickaxe', 'diamond') }
  },
  
  // 木剑 - 1个木板 + 1个木棍
  {
    type: 'shaped',
    pattern: [
      [null, 'planks', null],
      [null, 'planks', null],
      [null, 'stick', null]
    ],
    result: { type: 'tool', count: 1, tool: () => createTool('sword', 'wood') }
  },
  
  // 石剑 - 2个圆石 + 1个木棍
  {
    type: 'shaped',
    pattern: [
      [null, 'cobblestone', null],
      [null, 'cobblestone', null],
      [null, 'stick', null]
    ],
    result: { type: 'tool', count: 1, tool: () => createTool('sword', 'stone') }
  },
  
  // 铁剑 - 2个铁锭 + 1个木棍
  {
    type: 'shaped',
    pattern: [
      [null, 'iron_ingot', null],
      [null, 'iron_ingot', null],
      [null, 'stick', null]
    ],
    result: { type: 'tool', count: 1, tool: () => createTool('sword', 'iron') }
  },
  
  // 钻石剑 - 2个钻石 + 1个木棍
  {
    type: 'shaped',
    pattern: [
      [null, 'diamond', null],
      [null, 'diamond', null],
      [null, 'stick', null]
    ],
    result: { type: 'tool', count: 1, tool: () => createTool('sword', 'diamond') }
  },
  
  // 熔炉 - 8个圆石围一圈
  {
    type: 'shaped',
    pattern: [
      ['cobblestone', 'cobblestone', 'cobblestone'],
      ['cobblestone', null, 'cobblestone'],
      ['cobblestone', 'cobblestone', 'cobblestone']
    ],
    result: { type: 'furnace', count: 1 }
  }
]

// 无序配方表
const SHAPELESS_RECIPES: ShapelessRecipe[] = [
  // 当前暂无纯无序配方，大部分工具使用有序配方
]

// 熔炉配方表
const FURNACE_RECIPES: SmeltingRecipe[] = [
  // 铁矿石 -> 铁锭
  {
    type: 'furnace',
    input: 'iron_ore',
    fuel: 'coal',
    result: { type: 'iron_ingot', count: 1 },
    cookTime: 10
  },
  
  // 金矿石 -> 金锭
  {
    type: 'furnace',
    input: 'gold_ore',
    fuel: 'coal',
    result: { type: 'gold_ingot', count: 1 },
    cookTime: 10
  }
]

// 有效燃料
export const VALID_FUELS: BlockType[] = ['coal', 'wood', 'planks']

// 燃料燃烧时间（秒）
export const FUEL_BURN_TIMES: Partial<Record<BlockType, number>> = {
  coal: 80,
  wood: 15,
  planks: 15
}

// 检查有序配方是否匹配
export function matchShapedRecipe(
  grid: (BlockType | null)[][],
  recipe: ShapedRecipe
): boolean {
  // 标准化网格（去除边缘空行空列）
  const normalizedGrid = normalizeGrid(grid)
  const normalizedPattern = normalizeGrid(recipe.pattern)
  
  // 比较
  if (normalizedGrid.length !== normalizedPattern.length) return false
  
  for (let y = 0; y < normalizedGrid.length; y++) {
    if (normalizedGrid[y].length !== normalizedPattern[y].length) return false
    
    for (let x = 0; x < normalizedGrid[y].length; x++) {
      if (normalizedGrid[y][x] !== normalizedPattern[y][x]) return false
    }
  }
  
  return true
}

// 标准化网格（去除边缘的空行空列）
function normalizeGrid(grid: (BlockType | null)[][]): (BlockType | null)[][] {
  // 找到非空的边界
  let minX = 3, maxX = -1, minY = 3, maxY = -1
  
  for (let y = 0; y < 3; y++) {
    for (let x = 0; x < 3; x++) {
      if (grid[y][x] !== null) {
        minX = Math.min(minX, x)
        maxX = Math.max(maxX, x)
        minY = Math.min(minY, y)
        maxY = Math.max(maxY, y)
      }
    }
  }
  
  // 如果全是空的
  if (maxX === -1) return [[]]
  
  // 提取有效区域
  const result: (BlockType | null)[][] = []
  for (let y = minY; y <= maxY; y++) {
    const row: (BlockType | null)[] = []
    for (let x = minX; x <= maxX; x++) {
      row.push(grid[y][x])
    }
    result.push(row)
  }
  
  return result
}

// 检查无序配方是否匹配
export function matchShapelessRecipe(
  items: BlockType[],
  recipe: ShapelessRecipe
): boolean {
  if (items.length !== recipe.ingredients.length) return false
  
  const sortedItems = [...items].sort()
  const sortedIngredients = [...recipe.ingredients].sort()
  
  for (let i = 0; i < sortedItems.length; i++) {
    if (sortedItems[i] !== sortedIngredients[i]) return false
  }
  
  return true
}

// 查找匹配的有序配方
export function findShapedRecipe(grid: (BlockType | null)[][]): ShapedRecipe | null {
  for (const recipe of SHAPED_RECIPES) {
    if (matchShapedRecipe(grid, recipe)) {
      return recipe
    }
  }
  return null
}

// 查找匹配的无序配方
export function findShapelessRecipe(items: BlockType[]): ShapelessRecipe | null {
  for (const recipe of SHAPELESS_RECIPES) {
    if (matchShapelessRecipe(items, recipe)) {
      return recipe
    }
  }
  return null
}

// 查找熔炉配方
export function findFurnaceRecipe(input: BlockType): SmeltingRecipe | null {
  return FURNACE_RECIPES.find(r => r.input === input) || null
}

// 检查是否为有效燃料
export function isValidFuel(item: BlockType): boolean {
  return VALID_FUELS.includes(item)
}

// 获取燃料燃烧时间
export function getFuelBurnTime(fuel: BlockType): number {
  return FUEL_BURN_TIMES[fuel] || 0
}

// 获取所有配方（用于配方书）
export function getAllRecipes(): CraftingRecipe[] {
  return [...SHAPED_RECIPES, ...SHAPELESS_RECIPES]
}

// 获取所有熔炉配方
export function getAllFurnaceRecipes(): SmeltingRecipe[] {
  return [...FURNACE_RECIPES]
}

// 快捷合成（用于快捷栏一键合成）
export interface QuickCraftRecipe {
  name: string
  icon: string
  ingredients: { type: BlockType; count: number }[]
  result: { type: BlockType | 'tool'; count: number; tool?: () => Tool }
  canCraft: (hasItem: (type: BlockType, count: number) => boolean) => boolean
}

// 常用快捷合成配方
export function getQuickCraftRecipes(): QuickCraftRecipe[] {
  return [
    {
      name: '木板',
      icon: '🪵',
      ingredients: [{ type: 'wood', count: 1 }],
      result: { type: 'planks', count: 4 },
      canCraft: (hasItem) => hasItem('wood', 1)
    },
    {
      name: '木棍',
      icon: '🥢',
      ingredients: [{ type: 'planks', count: 2 }],
      result: { type: 'stick', count: 4 },
      canCraft: (hasItem) => hasItem('planks', 2)
    },
    {
      name: '工作台',
      icon: '🔨',
      ingredients: [{ type: 'planks', count: 4 }],
      result: { type: 'crafting_table', count: 1 },
      canCraft: (hasItem) => hasItem('planks', 4)
    },
    {
      name: '木镐',
      icon: '⛏',
      ingredients: [{ type: 'planks', count: 3 }, { type: 'stick', count: 2 }],
      result: { type: 'tool', count: 1, tool: () => createTool('pickaxe', 'wood') },
      canCraft: (hasItem) => hasItem('planks', 3) && hasItem('stick', 2)
    },
    {
      name: '石镐',
      icon: '⛏',
      ingredients: [{ type: 'cobblestone', count: 3 }, { type: 'stick', count: 2 }],
      result: { type: 'tool', count: 1, tool: () => createTool('pickaxe', 'stone') },
      canCraft: (hasItem) => hasItem('cobblestone', 3) && hasItem('stick', 2)
    }
  ]
}
