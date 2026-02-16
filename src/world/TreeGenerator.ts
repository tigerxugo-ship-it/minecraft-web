import { BlockType } from '../blocks/Block'
import { WorldBlock } from '../engine/gameStore'

// 树木类型
export type TreeType = 'oak' | 'spruce' | 'birch'

// 树木配置
interface TreeConfig {
  minHeight: number
  maxHeight: number
  trunkType: BlockType
  leafType: BlockType
}

const TREE_CONFIGS: Record<TreeType, TreeConfig> = {
  oak: {
    minHeight: 4,
    maxHeight: 6,
    trunkType: 'wood',
    leafType: 'grass' // 用草方块代替树叶
  },
  spruce: {
    minHeight: 6,
    maxHeight: 10,
    trunkType: 'wood',
    leafType: 'grass'
  },
  birch: {
    minHeight: 5,
    maxHeight: 7,
    trunkType: 'wood',
    leafType: 'grass'
  }
}

// 生成橡树
function generateOakTree(x: number, y: number, z: number, config: TreeConfig): WorldBlock[] {
  const blocks: WorldBlock[] = []
  const height = Math.floor(Math.random() * (config.maxHeight - config.minHeight + 1)) + config.minHeight
  
  // 生成树干
  for (let i = 0; i < height; i++) {
    blocks.push({
      type: config.trunkType,
      position: [x, y + i, z]
    })
  }
  
  // 生成椭球形树冠
  const crownCenterY = y + height - 1
  const crownRadiusX = 2.5
  const crownRadiusY = 2
  const crownRadiusZ = 2.5
  
  for (let lx = -3; lx <= 3; lx++) {
    for (let ly = -2; ly <= 3; ly++) {
      for (let lz = -3; lz <= 3; lz++) {
        // 椭球方程: (x/a)² + (y/b)² + (z/c)² <= 1
        const normalizedDist = 
          (lx * lx) / (crownRadiusX * crownRadiusX) +
          (ly * ly) / (crownRadiusY * crownRadiusY) +
          (lz * lz) / (crownRadiusZ * crownRadiusZ)
        
        if (normalizedDist <= 1.2) {
          // 避免与树干重叠
          if (lx === 0 && lz === 0 && ly < height) continue
          
          blocks.push({
            type: config.leafType,
            position: [x + lx, crownCenterY + ly, z + lz]
          })
        }
      }
    }
  }
  
  return blocks
}

// 生成云杉 (锥形分层树冠)
function generateSpruceTree(x: number, y: number, z: number, config: TreeConfig): WorldBlock[] {
  const blocks: WorldBlock[] = []
  const height = Math.floor(Math.random() * (config.maxHeight - config.minHeight + 1)) + config.minHeight
  
  // 生成树干
  for (let i = 0; i < height; i++) {
    blocks.push({
      type: config.trunkType,
      position: [x, y + i, z]
    })
  }
  
  // 生成锥形分层树冠
  let currentY = y + height - 2
  let layerRadius = 2
  
  while (currentY >= y + height - 6 && layerRadius >= 0) {
    // 每层生成一圈树叶
    for (let lx = -layerRadius; lx <= layerRadius; lx++) {
      for (let lz = -layerRadius; lz <= layerRadius; lz++) {
        // 只在外圈生成，形成锥形
        const dist = Math.max(Math.abs(lx), Math.abs(lz))
        if (dist >= layerRadius - 1 || layerRadius <= 1) {
          // 避免与树干重叠
          if (lx === 0 && lz === 0) continue
          
          blocks.push({
            type: config.leafType,
            position: [x + lx, currentY, z + lz]
          })
        }
      }
    }
    
    currentY--
    layerRadius--
  }
  
  // 顶部加一个小尖
  blocks.push({
    type: config.leafType,
    position: [x, y + height, z]
  })
  
  return blocks
}

// 生成白桦树 (与橡树类似但树干更细直)
function generateBirchTree(x: number, y: number, z: number, config: TreeConfig): WorldBlock[] {
  const blocks: WorldBlock[] = []
  const height = Math.floor(Math.random() * (config.maxHeight - config.minHeight + 1)) + config.minHeight
  
  // 生成树干
  for (let i = 0; i < height; i++) {
    blocks.push({
      type: config.trunkType,
      position: [x, y + i, z]
    })
  }
  
  // 生成较窄的椭球形树冠
  const crownCenterY = y + height - 1
  const crownRadiusX = 1.8
  const crownRadiusY = 1.8
  const crownRadiusZ = 1.8
  
  for (let lx = -2; lx <= 2; lx++) {
    for (let ly = -2; ly <= 2; ly++) {
      for (let lz = -2; lz <= 2; lz++) {
        const normalizedDist = 
          (lx * lx) / (crownRadiusX * crownRadiusX) +
          (ly * ly) / (crownRadiusY * crownRadiusY) +
          (lz * lz) / (crownRadiusZ * crownRadiusZ)
        
        if (normalizedDist <= 1.1) {
          if (lx === 0 && lz === 0 && ly < height) continue
          
          blocks.push({
            type: config.leafType,
            position: [x + lx, crownCenterY + ly, z + lz]
          })
        }
      }
    }
  }
  
  return blocks
}

// 主生成函数
export function generateTree(
  x: number,
  y: number,
  z: number,
  type: TreeType = 'oak'
): WorldBlock[] {
  const config = TREE_CONFIGS[type]
  
  switch (type) {
    case 'oak':
      return generateOakTree(x, y, z, config)
    case 'spruce':
      return generateSpruceTree(x, y, z, config)
    case 'birch':
      return generateBirchTree(x, y, z, config)
    default:
      return generateOakTree(x, y, z, config)
  }
}

// 随机生成树木类型
export function getRandomTreeType(): TreeType {
  const types: TreeType[] = ['oak', 'oak', 'oak', 'spruce', 'spruce', 'birch']
  return types[Math.floor(Math.random() * types.length)]
}

// 树叶腐烂系统
export interface DecayingLeaf {
  position: [number, number, number]
  decayTime: number // 消失时间戳
}

// 检查树叶是否应该开始腐烂
export function shouldLeafDecay(
  position: [number, number, number],
  blocks: WorldBlock[]
): boolean {
  // 检查下方或相邻是否有树干
  const adjacentPositions: [number, number, number][] = [
    [position[0], position[1] - 1, position[2]], // 下方
    [position[0] + 1, position[1], position[2]], // 东
    [position[0] - 1, position[1], position[2]], // 西
    [position[0], position[1], position[2] + 1], // 南
    [position[0], position[1], position[2] - 1], // 北
    [position[0], position[1] + 1, position[2]], // 上方
  ]
  
  // 如果相邻有木头，不腐烂
  for (const pos of adjacentPositions) {
    const adjacentBlock = blocks.find(b => 
      b.position[0] === pos[0] &&
      b.position[1] === pos[1] &&
      b.position[2] === pos[2]
    )
    if (adjacentBlock?.type === 'wood') {
      return false
    }
  }
  
  return true
}

// 处理树叶腐烂
export function processLeafDecay(
  blocks: WorldBlock[],
  decayingLeaves: DecayingLeaf[],
  currentTime: number
): { blocks: WorldBlock[]; decayingLeaves: DecayingLeaf[]; drops: { type: BlockType; position: [number, number, number] }[] } {
  const newBlocks = [...blocks]
  const newDecayingLeaves = [...decayingLeaves]
  const drops: { type: BlockType; position: [number, number, number] }[] = []
  
  // 检查应该开始腐烂的树叶
  const leafBlocks = blocks.filter(b => b.type === 'grass') // 使用草方块作为树叶
  
  for (const leaf of leafBlocks) {
    // 检查是否已经在腐烂列表中
    const alreadyDecaying = decayingLeaves.find(d => 
      d.position[0] === leaf.position[0] &&
      d.position[1] === leaf.position[1] &&
      d.position[2] === leaf.position[2]
    )
    
    if (!alreadyDecaying && shouldLeafDecay(leaf.position, blocks)) {
      // 4-8秒后消失
      const decayDelay = 4000 + Math.random() * 4000
      newDecayingLeaves.push({
        position: leaf.position,
        decayTime: currentTime + decayDelay
      })
    }
  }
  
  // 处理已经到期的树叶
  const expiredLeaves = newDecayingLeaves.filter(d => d.decayTime <= currentTime)
  
  for (const expired of expiredLeaves) {
    // 从世界中移除
    const index = newBlocks.findIndex(b => 
      b.position[0] === expired.position[0] &&
      b.position[1] === expired.position[1] &&
      b.position[2] === expired.position[2]
    )
    
    if (index > -1) {
      newBlocks.splice(index, 1)
      
      // 随机掉落物品 (树苗或木棍)
      if (Math.random() < 0.1) { // 10%几率掉落树苗
        drops.push({
          type: 'wood',
          position: expired.position
        })
      } else if (Math.random() < 0.2) { // 20%几率掉落木棍
        // 木棍可以用心智'wood'代替，实际游戏中应该有不同的物品
        drops.push({
          type: 'wood',
          position: expired.position
        })
      }
    }
  }
  
  // 移除已处理的腐烂记录
  const activeDecayingLeaves = newDecayingLeaves.filter(d => d.decayTime > currentTime)
  
  return {
    blocks: newBlocks,
    decayingLeaves: activeDecayingLeaves,
    drops
  }
}

// 树木掉落物类型
export type TreeDropType = 'sapling' | 'stick' | 'apple'

// 获取树木掉落物
export function getTreeDrops(treeType: TreeType): { type: BlockType | TreeDropType; count: number; chance: number }[] {
  switch (treeType) {
    case 'oak':
      return [
        { type: 'wood', count: 1, chance: 0.05 }, // 树苗
        { type: 'wood', count: 1, chance: 0.1 },  // 木棍
      ]
    case 'spruce':
      return [
        { type: 'wood', count: 1, chance: 0.08 },
        { type: 'wood', count: 1, chance: 0.15 },
      ]
    case 'birch':
      return [
        { type: 'wood', count: 1, chance: 0.06 },
        { type: 'wood', count: 1, chance: 0.12 },
      ]
    default:
      return []
  }
}
