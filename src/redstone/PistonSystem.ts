import { BlockType } from '../blocks/Block'
import { useGameStore } from '../engine/gameStore'
import { getPositionKey, REDSTONE_DIRECTIONS } from './RedstoneSystem'

// 活塞推动结果
export interface PistonPushResult {
  success: boolean
  pushedBlocks: Array<{
    from: [number, number, number]
    to: [number, number, number]
    type: BlockType
  }>
  destroyedBlocks: Array<{
    position: [number, number, number]
    type: BlockType
  }>
}

// 可推动方块列表
const PUSHABLE_BLOCKS: BlockType[] = [
  'grass', 'dirt', 'stone', 'sand', 'gravel', 'cobblestone',
  'planks', 'wood', 'wool', 'glass', 'ice', 'packed_ice',
  'redstone_dust', 'redstone_torch', 'redstone_block',
  'piston', 'sticky_piston'
]

// 不可推动方块（会被破坏）
const DESTRUCTIBLE_BLOCKS: BlockType[] = [
  'leaves', 'oak_sapling', 'birch_sapling', 'spruce_sapling',
  'redstone_dust', 'redstone_torch'
]

// 无法推动的方块
const IMMOVABLE_BLOCKS: BlockType[] = [
  'obsidian', 'bedrock', 'ender_chest', 'enchanting_table',
  'furnace', 'furnace_lit', 'crafting_table', 'chest'
]

// 检查方块是否可推动
export function isPushable(type: BlockType): boolean {
  return PUSHABLE_BLOCKS.includes(type)
}

// 检查方块是否会被破坏
export function isDestructible(type: BlockType): boolean {
  return DESTRUCTIBLE_BLOCKS.includes(type)
}

// 检查方块是否无法移动
export function isImmovable(type: BlockType): boolean {
  return IMMOVABLE_BLOCKS.includes(type)
}

// 获取活塞推动方向
export function getPistonDirection(
  facing: 'north' | 'south' | 'east' | 'west' | 'up' | 'down'
): [number, number, number] {
  return REDSTONE_DIRECTIONS[facing]
}

// 计算活塞可推动的方块链
export function calculatePushChain(
  pistonPos: [number, number, number],
  facing: 'north' | 'south' | 'east' | 'west' | 'up' | 'down',
  maxLength: number = 12,
  _isSticky: boolean = false
): PistonPushResult {
  const result: PistonPushResult = {
    success: true,
    pushedBlocks: [],
    destroyedBlocks: []
  }

  const direction = getPistonDirection(facing)
  const { getBlockAt } = useGameStore.getState()
  
  // 检查活塞前方的方块链
  let currentPos: [number, number, number] = [
    pistonPos[0] + direction[0],
    pistonPos[1] + direction[1],
    pistonPos[2] + direction[2]
  ]
  
  const blocksToPush: Array<{
    position: [number, number, number]
    type: BlockType
  }> = []

  // 收集需要推动的方块
  for (let i = 0; i < maxLength; i++) {
    const block = getBlockAt(currentPos)
    
    if (!block) {
      // 空气，可以推动
      break
    }

    if (isImmovable(block.type)) {
      // 无法移动的方块，推动失败
      result.success = false
      return result
    }

    if (isDestructible(block.type)) {
      // 会被破坏的方块
      result.destroyedBlocks.push({
        position: [...currentPos] as [number, number, number],
        type: block.type
      })
      break
    }

    if (isPushable(block.type)) {
      blocksToPush.push({
        position: [...currentPos] as [number, number, number],
        type: block.type
      })
    } else {
      // 未知方块，假设不能推动
      result.success = false
      return result
    }

    // 移动到下一个位置
    currentPos = [
      currentPos[0] + direction[0],
      currentPos[1] + direction[1],
      currentPos[2] + direction[2]
    ]
  }

  // 检查最后一个位置是否为空（或超出推动限制）
  if (blocksToPush.length > 0) {
    const lastBlock = blocksToPush[blocksToPush.length - 1]
    const lastPos: [number, number, number] = [
      lastBlock.position[0] + direction[0],
      lastBlock.position[1] + direction[1],
      lastBlock.position[2] + direction[2]
    ]
    
    const lastBlockCheck = getBlockAt(lastPos)
    if (lastBlockCheck && !isDestructible(lastBlockCheck.type)) {
      // 最后一个位置被占据且不会被破坏
      result.success = false
      return result
    }
  }

  // 计算推动后的位置
  // 从后往前推动
  for (let i = blocksToPush.length - 1; i >= 0; i--) {
    const block = blocksToPush[i]
    result.pushedBlocks.push({
      from: block.position,
      to: [
        block.position[0] + direction[0],
        block.position[1] + direction[1],
        block.position[2] + direction[2]
      ],
      type: block.type
    })
  }

  return result
}

// 计算粘性活塞拉回
export function calculatePullChain(
  pistonPos: [number, number, number],
  facing: 'north' | 'south' | 'east' | 'west' | 'up' | 'down'
): PistonPushResult {
  const result: PistonPushResult = {
    success: true,
    pushedBlocks: [],
    destroyedBlocks: []
  }

  const direction = getPistonDirection(facing)
  const { getBlockAt } = useGameStore.getState()
  
  // 检查活塞前方的方块
  const frontPos: [number, number, number] = [
    pistonPos[0] + direction[0],
    pistonPos[1] + direction[1],
    pistonPos[2] + direction[2]
  ]
  
  const block = getBlockAt(frontPos)
  
  if (block && isPushable(block.type)) {
    // 检查活塞后方是否有空间
    const backPos: [number, number, number] = [
      pistonPos[0] - direction[0],
      pistonPos[1] - direction[1],
      pistonPos[2] - direction[2]
    ]
    
    const backBlock = getBlockAt(backPos)
    if (!backBlock) {
      // 可以拉回
      result.pushedBlocks.push({
        from: frontPos,
        to: backPos,
        type: block.type
      })
    }
  }

  return result
}

// 执行活塞推动
export function executePistonPush(
  pistonPos: [number, number, number],
  facing: 'north' | 'south' | 'east' | 'west' | 'up' | 'down',
  isSticky: boolean,
  extend: boolean
): PistonPushResult {
  if (extend) {
    // 推出
    const result = calculatePushChain(pistonPos, facing, 12, isSticky)
    
    if (!result.success) {
      return result
    }

    const { removeBlock, addBlock } = useGameStore.getState()

    // 先处理被破坏的方块
    for (const destroyed of result.destroyedBlocks) {
      removeBlock(destroyed.position)
      // TODO: 掉落物品
    }

    // 从后往前移动方块（避免覆盖）
    for (let i = result.pushedBlocks.length - 1; i >= 0; i--) {
      const push = result.pushedBlocks[i]
      removeBlock(push.from)
      addBlock({
        type: push.type,
        position: push.to
      })
    }

    return result
  } else {
    // 收回
    if (isSticky) {
      const result = calculatePullChain(pistonPos, facing)
      
      if (result.pushedBlocks.length > 0) {
        const { removeBlock, addBlock } = useGameStore.getState()
        const pull = result.pushedBlocks[0]
        
        removeBlock(pull.from)
        addBlock({
          type: pull.type,
          position: pull.to
        })
      }
      
      return result
    }
    
    return { success: true, pushedBlocks: [], destroyedBlocks: [] }
  }
}

// 活塞管理器
export class PistonManager {
  private activePistons: Map<string, {
    position: [number, number, number]
    facing: 'north' | 'south' | 'east' | 'west' | 'up' | 'down'
    isSticky: boolean
    extended: boolean
    extending: boolean
    retracting: boolean
    progress: number
  }> = new Map()

  // 添加活塞
  addPiston(
    position: [number, number, number],
    facing: 'north' | 'south' | 'east' | 'west' | 'up' | 'down',
    isSticky: boolean = false
  ): void {
    const key = getPositionKey(position)
    this.activePistons.set(key, {
      position,
      facing,
      isSticky,
      extended: false,
      extending: false,
      retracting: false,
      progress: 0
    })
  }

  // 移除活塞
  removePiston(position: [number, number, number]): void {
    const key = getPositionKey(position)
    this.activePistons.delete(key)
  }

  // 激活活塞
  activatePiston(position: [number, number, number]): boolean {
    const key = getPositionKey(position)
    const piston = this.activePistons.get(key)
    
    if (!piston || piston.extended || piston.extending) {
      return false
    }

    piston.extending = true
    piston.progress = 0
    
    // 立即执行推动
    executePistonPush(position, piston.facing, piston.isSticky, true)
    piston.extended = true
    piston.extending = false
    
    return true
  }

  // 关闭活塞
  deactivatePiston(position: [number, number, number]): boolean {
    const key = getPositionKey(position)
    const piston = this.activePistons.get(key)
    
    if (!piston || !piston.extended || piston.retracting) {
      return false
    }

    piston.retracting = true
    piston.progress = 0
    
    // 立即执行收回
    executePistonPush(position, piston.facing, piston.isSticky, false)
    piston.extended = false
    piston.retracting = false
    
    return true
  }

  // 获取活塞状态
  getPistonState(position: [number, number, number]) {
    const key = getPositionKey(position)
    return this.activePistons.get(key)
  }

  // 检查活塞是否存在
  hasPiston(position: [number, number, number]): boolean {
    return this.activePistons.has(getPositionKey(position))
  }

  // 清理
  clear(): void {
    this.activePistons.clear()
  }
}

// 创建全局活塞管理器实例
export const pistonManager = new PistonManager()
