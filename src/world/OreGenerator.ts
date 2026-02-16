import { BlockType } from '../blocks/Block'
import { WorldBlock } from '../engine/gameStore'

// 矿脉配置
interface OreVeinConfig {
  type: BlockType
  minHeight: number
  maxHeight: number
  veinSize: number        // 矿脉大小
  veinsPerChunk: number   // 每区块矿脉数量
  replaceable: BlockType[] // 可替换的方块类型
}

// 矿石配置
const ORE_CONFIGS: OreVeinConfig[] = [
  {
    type: 'coal_ore',
    minHeight: 0,
    maxHeight: 128,
    veinSize: 16,
    veinsPerChunk: 20,
    replaceable: ['stone']
  },
  {
    type: 'iron_ore',
    minHeight: 0,
    maxHeight: 64,
    veinSize: 8,
    veinsPerChunk: 20,
    replaceable: ['stone']
  },
  {
    type: 'gold_ore',
    minHeight: 0,
    maxHeight: 32,
    veinSize: 8,
    veinsPerChunk: 2,
    replaceable: ['stone']
  },
  {
    type: 'diamond_ore',
    minHeight: 0,
    maxHeight: 16,
    veinSize: 8,
    veinsPerChunk: 1,
    replaceable: ['stone']
  }
]

// 区块大小 (16x16)
const CHUNK_SIZE = 16

// 伪随机数生成器（基于种子）
class SeededRandom {
  private seed: number

  constructor(seed: number = Date.now()) {
    this.seed = seed
  }

  // 获取下一个随机数 (0-1)
  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280
    return this.seed / 233280
  }

  // 获取范围随机数
  range(min: number, max: number): number {
    return min + this.next() * (max - min)
  }

  // 获取整数随机数
  rangeInt(min: number, max: number): number {
    return Math.floor(this.range(min, max))
  }
}

// 矿石生成器
export class OreGenerator {
  private worldSeed: number

  constructor(seed?: number) {
    this.worldSeed = seed || Date.now()
  }

  // 生成区块的矿石
  generateChunkOres(chunkX: number, chunkZ: number, existingBlocks: WorldBlock[]): WorldBlock[] {
    const ores: WorldBlock[] = []
    const blockMap = new Map<string, WorldBlock>()
    
    // 构建现有方块映射
    existingBlocks.forEach(block => {
      const key = `${block.position[0]},${block.position[1]},${block.position[2]}`
      blockMap.set(key, block)
    })

    // 为当前区块设置种子
    const chunkSeed = this.worldSeed + chunkX * 341873128712 + chunkZ * 132897987541
    const chunkRandom = new SeededRandom(chunkSeed)

    // 生成每种矿石
    for (const config of ORE_CONFIGS) {
      const veinCount = chunkRandom.rangeInt(
        Math.floor(config.veinsPerChunk * 0.8),
        Math.ceil(config.veinsPerChunk * 1.2)
      )

      for (let i = 0; i < veinCount; i++) {
        // 随机选择矿脉起始位置
        const startX = chunkX * CHUNK_SIZE + chunkRandom.rangeInt(0, CHUNK_SIZE)
        const startY = chunkRandom.rangeInt(config.minHeight, config.maxHeight)
        const startZ = chunkZ * CHUNK_SIZE + chunkRandom.rangeInt(0, CHUNK_SIZE)

        // 生成矿脉
        const vein = this.generateVein(
          startX, startY, startZ,
          config.type,
          config.veinSize,
          config.replaceable,
          chunkRandom,
          blockMap
        )

        ores.push(...vein)
      }
    }

    return ores
  }

  // 生成单个矿脉
  private generateVein(
    startX: number,
    startY: number,
    startZ: number,
    oreType: BlockType,
    size: number,
    replaceable: BlockType[],
    random: SeededRandom,
    blockMap: Map<string, WorldBlock>
  ): WorldBlock[] {
    const vein: WorldBlock[] = []
    const placed = new Set<string>()
    
    // 使用集群算法生成矿脉
    const positions: Array<[number, number, number]> = [[startX, startY, startZ]]
    placed.add(`${startX},${startY},${startZ}`)

    let attempts = 0
    while (positions.length < size && attempts < size * 3) {
      attempts++
      
      // 随机选择一个已放置的位置作为扩展点
      const baseIndex = random.rangeInt(0, positions.length)
      const [bx, by, bz] = positions[baseIndex]

      // 随机方向扩展 (6个方向)
      const directions = [
        [1, 0, 0], [-1, 0, 0],
        [0, 1, 0], [0, -1, 0],
        [0, 0, 1], [0, 0, -1]
      ]
      const dir = directions[random.rangeInt(0, directions.length)]
      
      const nx = bx + dir[0]
      const ny = by + dir[1]
      const nz = bz + dir[2]
      
      const key = `${nx},${ny},${nz}`
      
      // 检查是否已放置
      if (placed.has(key)) continue

      // 检查位置是否有可替换的方块
      const existingBlock = blockMap.get(key)
      if (!existingBlock || !replaceable.includes(existingBlock.type)) {
        continue
      }

      // 放置矿石
      placed.add(key)
      positions.push([nx, ny, nz])
    }

    // 转换为 WorldBlock
    for (const [x, y, z] of positions) {
      // 移除原有方块
      const key = `${x},${y},${z}`
      blockMap.delete(key)
      
      vein.push({
        type: oreType,
        position: [x, y, z]
      })
    }

    return vein
  }

  // 生成世界范围的矿石 (用于世界初始化)
  generateWorldOres(worldBlocks: WorldBlock[]): WorldBlock[] {
    const allOres: WorldBlock[] = []
    
    // 计算世界边界
    let minChunkX = Infinity, maxChunkX = -Infinity
    let minChunkZ = Infinity, maxChunkZ = -Infinity
    
    worldBlocks.forEach(block => {
      const chunkX = Math.floor(block.position[0] / CHUNK_SIZE)
      const chunkZ = Math.floor(block.position[2] / CHUNK_SIZE)
      minChunkX = Math.min(minChunkX, chunkX)
      maxChunkX = Math.max(maxChunkX, chunkX)
      minChunkZ = Math.min(minChunkZ, chunkZ)
      maxChunkZ = Math.max(maxChunkZ, chunkZ)
    })

    // 为每个区块生成矿石
    for (let cx = minChunkX; cx <= maxChunkX; cx++) {
      for (let cz = minChunkZ; cz <= maxChunkZ; cz++) {
        const chunkOres = this.generateChunkOres(cx, cz, worldBlocks)
        allOres.push(...chunkOres)
      }
    }

    // 合并原有方块和矿石
    const orePositions = new Set(allOres.map(o => `${o.position[0]},${o.position[1]},${o.position[2]}`))
    const filteredWorld = worldBlocks.filter(b => !orePositions.has(`${b.position[0]},${b.position[1]},${b.position[2]}`))
    
    return [...filteredWorld, ...allOres]
  }
}

// 便捷函数：生成矿石
export function generateOres(worldBlocks: WorldBlock[], seed?: number): WorldBlock[] {
  const generator = new OreGenerator(seed)
  return generator.generateWorldOres(worldBlocks)
}

// 获取矿石分布统计
export function getOreStatistics(blocks: WorldBlock[]): Record<BlockType, number> {
  const stats: Record<string, number> = {}
  
  const oreTypes: BlockType[] = ['coal_ore', 'iron_ore', 'gold_ore', 'diamond_ore']
  oreTypes.forEach(type => stats[type] = 0)
  
  blocks.forEach(block => {
    if (oreTypes.includes(block.type)) {
      stats[block.type] = (stats[block.type] || 0) + 1
    }
  })
  
  return stats as Record<BlockType, number>
}
