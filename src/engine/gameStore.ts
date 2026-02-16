import { create } from 'zustand'
import { BlockType, getBlockDrop, MiningLevel } from '../blocks/Block'
import { Tool, PRESET_TOOLS, useTool } from '../tools/ToolSystem'

// 重新导出类型
export type { BlockType }

export interface WorldBlock {
  type: BlockType
  position: [number, number, number]
}

// 背包物品类型
export interface InventoryItem {
  type: BlockType | 'tool'
  count: number
  tool?: Tool
}

// 挖掘状态
export interface MiningState {
  isMining: boolean
  targetBlock: [number, number, number] | null
  progress: number // 0-100
  startTime: number
}

// 玩家状态
export interface PlayerState {
  health: number
  maxHealth: number
  hunger: number
  maxHunger: number
  position: [number, number, number]
}

interface GameState {
  // 世界状态
  blocks: WorldBlock[]
  addBlock: (block: WorldBlock) => void
  removeBlock: (position: [number, number, number]) => void
  getBlockAt: (position: [number, number, number]) => WorldBlock | undefined
  setBlocks: (blocks: WorldBlock[]) => void
  
  // 玩家状态
  selectedSlot: number
  setSelectedSlot: (slot: number) => void
  player: PlayerState
  setPlayerHealth: (health: number) => void
  setPlayerHunger: (hunger: number) => void
  setPlayerPosition: (position: [number, number, number]) => void
  damagePlayer: (damage: number) => void
  healPlayer: (amount: number) => void
  
  // 背包 (支持工具和方块)
  inventory: InventoryItem[]
  addToInventory: (type: BlockType, count?: number) => void
  addToolToInventory: (tool: Tool) => void
  removeFromInventory: (slot: number, count?: number) => void
  updateToolInSlot: (slot: number, tool: Tool | null) => void
  consumeItem: (type: BlockType, count?: number) => boolean
  hasItem: (type: BlockType, count?: number) => boolean
  
  // 挖掘状态
  miningState: MiningState
  startMining: (position: [number, number, number]) => void
  updateMiningProgress: (progress: number) => void
  stopMining: () => void
  completeMining: () => void
  
  // 当前手持工具
  getEquippedTool: () => Tool | null
  getEquippedItem: () => InventoryItem | null
  
  // 游戏状态
  isLocked: boolean
  setLocked: (locked: boolean) => void
  
  // 昼夜状态
  gameTime: number // 0-1
  isDay: boolean
  lightIntensity: number
  setGameTime: (time: number, isDay: boolean, _lightIntensity: number) => void
  
  // 游戏暂停状态
  isPaused: boolean
  setPaused: (paused: boolean) => void
  
  // 打开的制作界面
  openCraftingStation: 'inventory' | 'crafting_table' | 'furnace' | null
  setOpenCraftingStation: (station: 'inventory' | 'crafting_table' | 'furnace' | null) => void
  
  // 触摸控制状态 (移动端支持)
  touchMoveInput: { x: number; y: number }
  touchLookInput: { deltaX: number; deltaY: number }
  touchJumpTrigger: number // 使用计数触发跳跃
  touchMineTrigger: number // 使用计数触发挖掘
  touchPlaceTrigger: number // 使用计数触发放置
  setTouchMoveInput: (x: number, y: number) => void
  setTouchLookInput: (deltaX: number, deltaY: number) => void
  triggerTouchJump: () => void
  triggerTouchMine: () => void
  triggerTouchPlace: () => void
}

// 初始化背包（包含工具和方块）
const initInventory = (): InventoryItem[] => {
  const inv: InventoryItem[] = []
  
  // 添加基础工具
  inv.push({ type: 'tool', count: 1, tool: PRESET_TOOLS.woodenPickaxe() })
  inv.push({ type: 'tool', count: 1, tool: PRESET_TOOLS.stonePickaxe() })
  inv.push({ type: 'tool', count: 1, tool: PRESET_TOOLS.woodenSword() })
  inv.push({ type: 'tool', count: 1, tool: PRESET_TOOLS.stoneSword() })
  
  // 添加基础方块
  const types: BlockType[] = ['grass', 'dirt', 'stone', 'wood', 'sand', 'planks', 'crafting_table']
  types.forEach(type => {
    inv.push({ type, count: 64 })
  })
  
  // 填充空槽位
  while (inv.length < 36) {
    inv.push({ type: 'grass', count: 0 })
  }
  
  return inv
}

// 初始化玩家状态
const initPlayer = (): PlayerState => ({
  health: 20,
  maxHealth: 20,
  hunger: 20,
  maxHunger: 20,
  position: [0, 2, 0]
})

export const useGameStore = create<GameState>((set, get) => ({
  blocks: [],
  
  addBlock: (block) => {
    const { blocks } = get()
    // 检查位置是否已有方块
    const exists = blocks.some(b => 
      b.position[0] === block.position[0] &&
      b.position[1] === block.position[1] &&
      b.position[2] === block.position[2]
    )
    if (!exists) {
      set({ blocks: [...blocks, block] })
    }
  },
  
  removeBlock: (position) => {
    const { blocks } = get()
    set({ 
      blocks: blocks.filter(b => 
        b.position[0] !== position[0] ||
        b.position[1] !== position[1] ||
        b.position[2] !== position[2]
      )
    })
  },
  
  getBlockAt: (position) => {
    const { blocks } = get()
    return blocks.find(b => 
      b.position[0] === position[0] &&
      b.position[1] === position[1] &&
      b.position[2] === position[2]
    )
  },
  
  setBlocks: (blocks) => set({ blocks }),
  
  selectedSlot: 0,
  setSelectedSlot: (slot) => set({ selectedSlot: slot }),
  
  player: initPlayer(),
  
  setPlayerHealth: (health) => set(state => ({
    player: { ...state.player, health: Math.max(0, Math.min(health, state.player.maxHealth)) }
  })),
  
  setPlayerHunger: (hunger) => set(state => ({
    player: { ...state.player, hunger: Math.max(0, Math.min(hunger, state.player.maxHunger)) }
  })),
  
  setPlayerPosition: (position) => set(state => ({
    player: { ...state.player, position }
  })),
  
  damagePlayer: (damage) => {
    const { player, setPlayerHealth } = get()
    setPlayerHealth(player.health - damage)
  },
  
  healPlayer: (amount) => {
    const { player, setPlayerHealth } = get()
    setPlayerHealth(player.health + amount)
  },
  
  inventory: initInventory(),
  
  addToInventory: (type, count = 1) => {
    const { inventory } = get()
    const newInventory = [...inventory]
    
    // 先尝试堆叠到现有槽位
    for (let i = 0; i < newInventory.length; i++) {
      if (newInventory[i].type === type && newInventory[i].count > 0 && newInventory[i].count < 64) {
        const addCount = Math.min(count, 64 - newInventory[i].count)
        newInventory[i].count += addCount
        count -= addCount
        if (count <= 0) break
      }
    }
    
    // 再找空槽位
    if (count > 0) {
      for (let i = 0; i < newInventory.length; i++) {
        if (newInventory[i].count === 0) {
          newInventory[i] = { type, count: Math.min(count, 64) }
          count -= Math.min(count, 64)
          if (count <= 0) break
        }
      }
    }
    
    set({ inventory: newInventory })
  },
  
  addToolToInventory: (tool) => {
    const { inventory } = get()
    const newInventory = [...inventory]
    
    // 找空槽位放工具
    for (let i = 0; i < newInventory.length; i++) {
      if (newInventory[i].count === 0) {
        newInventory[i] = { type: 'tool', count: 1, tool }
        set({ inventory: newInventory })
        return
      }
    }
  },
  
  removeFromInventory: (slot, count = 1) => {
    const { inventory } = get()
    const newInventory = [...inventory]
    if (newInventory[slot].count >= count) {
      newInventory[slot].count -= count
      if (newInventory[slot].count === 0) {
        newInventory[slot] = { type: 'grass', count: 0 }
      }
      set({ inventory: newInventory })
    }
  },
  
  updateToolInSlot: (slot, tool) => {
    const currentInventory = get().inventory
    const newInventory = [...currentInventory]
    if (tool) {
      newInventory[slot] = { type: 'tool', count: 1, tool }
    } else {
      newInventory[slot] = { type: 'grass', count: 0 }
    }
    set({ inventory: newInventory })
  },
  
  consumeItem: (type, count = 1) => {
    const { inventory, hasItem } = get()
    if (!hasItem(type, count)) return false
    
    const newInventory = [...inventory]
    let remaining = count
    
    for (let i = 0; i < newInventory.length && remaining > 0; i++) {
      if (newInventory[i].type === type && newInventory[i].count > 0) {
        const consume = Math.min(remaining, newInventory[i].count)
        newInventory[i].count -= consume
        remaining -= consume
        
        if (newInventory[i].count === 0) {
          newInventory[i] = { type: 'grass', count: 0 }
        }
      }
    }
    
    set({ inventory: newInventory })
    return true
  },
  
  hasItem: (type, count = 1) => {
    const { inventory } = get()
    let total = 0
    
    for (const item of inventory) {
      if (item.type === type) {
        total += item.count
        if (total >= count) return true
      }
    }
    
    return false
  },
  
  miningState: {
    isMining: false,
    targetBlock: null,
    progress: 0,
    startTime: 0
  },
  
  startMining: (position) => set({
    miningState: {
      isMining: true,
      targetBlock: position,
      progress: 0,
      startTime: Date.now()
    }
  }),
  
  updateMiningProgress: (progress) => set(state => ({
    miningState: { ...state.miningState, progress }
  })),
  
  stopMining: () => set({
    miningState: {
      isMining: false,
      targetBlock: null,
      progress: 0,
      startTime: 0
    }
  }),
  
  completeMining: () => {
    const { miningState, removeBlock, addToInventory, getEquippedTool } = get()
    if (miningState.targetBlock) {
      const block = get().getBlockAt(miningState.targetBlock)
      if (block) {
        // 获取工具
        const equippedTool = getEquippedTool()
        const toolLevel = equippedTool?.miningLevel ?? MiningLevel.HAND
        
        // 获取掉落物（考虑挖掘等级）
        const dropType = getBlockDrop(block.type, toolLevel)
        
        if (dropType) {
          removeBlock(miningState.targetBlock)
          addToInventory(dropType)
          
          // 消耗工具耐久度
          if (equippedTool) {
            const { selectedSlot, updateToolInSlot } = get()
            const updatedTool = useTool(equippedTool, 1)
            updateToolInSlot(selectedSlot, updatedTool)
          }
        }
      }
    }
    set({
      miningState: {
        isMining: false,
        targetBlock: null,
        progress: 0,
        startTime: 0
      }
    })
  },
  
  getEquippedTool: () => {
    const { inventory, selectedSlot } = get()
    const item = inventory[selectedSlot]
    if (item && item.type === 'tool' && item.tool) {
      return item.tool
    }
    return null
  },
  
  getEquippedItem: () => {
    const { inventory, selectedSlot } = get()
    return inventory[selectedSlot] || null
  },
  
  isLocked: false,
  setLocked: (locked) => set({ isLocked: locked }),
  
  gameTime: 0,
  isDay: true,
  lightIntensity: 1,
  setGameTime: (time, isDay, lightIntensity) => set({ 
    gameTime: time, 
    isDay, 
    lightIntensity 
  }),
  
  isPaused: false,
  setPaused: (paused) => set({ isPaused: paused }),
  
  openCraftingStation: null,
  setOpenCraftingStation: (station) => set({ openCraftingStation: station }),
  
  // 触摸控制状态
  touchMoveInput: { x: 0, y: 0 },
  touchLookInput: { deltaX: 0, deltaY: 0 },
  touchJumpTrigger: 0,
  touchMineTrigger: 0,
  touchPlaceTrigger: 0,
  setTouchMoveInput: (x, y) => set({ touchMoveInput: { x, y } }),
  setTouchLookInput: (deltaX, deltaY) => set({ touchLookInput: { deltaX, deltaY } }),
  triggerTouchJump: () => set(state => ({ touchJumpTrigger: state.touchJumpTrigger + 1 })),
  triggerTouchMine: () => set(state => ({ touchMineTrigger: state.touchMineTrigger + 1 })),
  triggerTouchPlace: () => set(state => ({ touchPlaceTrigger: state.touchPlaceTrigger + 1 })),
}))
