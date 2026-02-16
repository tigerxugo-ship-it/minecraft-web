import { useEffect, useRef, useCallback } from 'react'
import { BlockInstances } from '../blocks/BlockInstances'
import { useGameStore } from '../engine/gameStore'
import { BlockType } from '../blocks/Block'
import { generateTree, processLeafDecay, DecayingLeaf } from './TreeGenerator'
import { generateOres } from './OreGenerator'
import { MobRenderer } from '../entities/MobRenderer'
import { Mob, updateMobs, damageMob, getMobDrops, spawnMobGroup } from '../entities/MobAI'
import { HostileMob, updateHostileMobs, createHostileMob, damageHostileMob, getHostileMobDrops, getRandomHostileMobType } from '../entities/HostileMobAI'
import { useTool } from '../tools/ToolSystem'
import * as THREE from 'three'

// 简单的地形生成
function generateTerrain(): { type: BlockType; position: [number, number, number] }[] {
  const blocks: { type: BlockType; position: [number, number, number] }[] = []
  const size = 15
  
  // 生成平地
  for (let x = -size; x <= size; x++) {
    for (let z = -size; z <= size; z++) {
      // 草地层
      blocks.push({ type: 'grass', position: [x, 0, z] })
      // 泥土层（下面2层）
      blocks.push({ type: 'dirt', position: [x, -1, z] })
      blocks.push({ type: 'dirt', position: [x, -2, z] })
      // 石头层（深度到-15）
      for (let y = -3; y >= -15; y--) {
        blocks.push({ type: 'stone', position: [x, y, z] })
      }
    }
  }
  
  return blocks
}

// 生成随机树木位置
function generateTreePositions(count: number, excludeRadius: number = 5): [number, number, number][] {
  const positions: [number, number, number][] = []
  const size = 12
  
  for (let i = 0; i < count; i++) {
    let attempts = 0
    while (attempts < 10) {
      const x = Math.floor(Math.random() * size * 2) - size
      const z = Math.floor(Math.random() * size * 2) - size
      
      // 避免在玩家出生点附近生成
      if (Math.abs(x) < excludeRadius && Math.abs(z) < excludeRadius) {
        attempts++
        continue
      }
      
      // 避免重叠
      const tooClose = positions.some(p => 
        Math.abs(p[0] - x) < 3 && Math.abs(p[2] - z) < 3
      )
      
      if (!tooClose) {
        positions.push([x, 1, z])
        break
      }
      attempts++
    }
  }
  
  return positions
}

// 世界组件props
interface WorldProps {
  // 暂无props
}

export function World(_props: WorldProps) {
  const { blocks, addBlock, removeBlock, setBlocks, isDay, damagePlayer, player, isPaused } = useGameStore()
  
  // 使用ref来存储树叶腐烂状态和生物
  const decayingLeavesRef = useRef<DecayingLeaf[]>([])
  const mobsRef = useRef<Mob[]>([])
  const hostileMobsRef = useRef<HostileMob[]>([])
  const lastUpdateRef = useRef<number>(Date.now())
  const blockSetRef = useRef<Set<string>>(new Set())
  const lastMobSpawnRef = useRef<number>(0)
  
  // 更新方块集合
  useEffect(() => {
    blockSetRef.current = new Set(blocks.map(b => `${b.position[0]},${b.position[1]},${b.position[2]}`))
  }, [blocks])
  
  // 初始化地形、树木和矿石
  useEffect(() => {
    if (blocks.length === 0) {
      // 生成基础地形
      const terrain = generateTerrain()
      terrain.forEach(block => addBlock(block))
      
      // 生成橡树
      const oakPositions = generateTreePositions(5)
      oakPositions.forEach(pos => {
        const treeBlocks = generateTree(pos[0], pos[1], pos[2], 'oak')
        treeBlocks.forEach(block => addBlock(block))
      })
      
      // 生成云杉
      const sprucePositions = generateTreePositions(4)
      sprucePositions.forEach(pos => {
        const treeBlocks = generateTree(pos[0], pos[1], pos[2], 'spruce')
        treeBlocks.forEach(block => addBlock(block))
      })
      
      // 生成白桦树
      const birchPositions = generateTreePositions(3)
      birchPositions.forEach(pos => {
        const treeBlocks = generateTree(pos[0], pos[1], pos[2], 'birch')
        treeBlocks.forEach(block => addBlock(block))
      })
      
      // 生成矿石
      const currentBlocks = useGameStore.getState().blocks
      const blocksWithOres = generateOres(currentBlocks, Date.now())
      setBlocks(blocksWithOres)
      
      // 生成动物群
      const pigGroup = spawnMobGroup([12, 1, 12], 3, 5)
      const cowGroup = spawnMobGroup([-12, 1, -12], 2, 5)
      const sheepGroup = spawnMobGroup([10, 1, -10], 3, 5)
      
      mobsRef.current = [...pigGroup, ...cowGroup, ...sheepGroup]
      
      // 初始生成一些敌对生物
      if (!isDay) {
        spawnHostileMobs()
      }
    }
  }, [])
  
  // 生成敌对生物
  const spawnHostileMobs = useCallback(() => {
    const playerPos = player.position
    const spawnPositions: Array<[number, number, number]> = [
      [playerPos[0] + 20, playerPos[1], playerPos[2] + 20],
      [playerPos[0] - 20, playerPos[1], playerPos[2] - 20],
      [playerPos[0] + 20, playerPos[1], playerPos[2] - 20],
      [playerPos[0] - 20, playerPos[1], playerPos[2] + 20]
    ]
    
    // 随机选择1-3个位置生成敌对生物
    const numSpawns = 1 + Math.floor(Math.random() * 3)
    for (let i = 0; i < numSpawns; i++) {
      const pos = spawnPositions[Math.floor(Math.random() * spawnPositions.length)]
      const mobType = getRandomHostileMobType()
      hostileMobsRef.current.push(createHostileMob(mobType, pos))
    }
  }, [player.position])
  
  // 处理玩家受到伤害
  const handlePlayerDamage = useCallback((damage: number) => {
    damagePlayer(damage)
  }, [damagePlayer])
  
  // 处理爆炸
  const handleExplosion = useCallback((position: THREE.Vector3, damage: number) => {
    // 对玩家造成伤害
    const playerPos = new THREE.Vector3(...player.position)
    const distToPlayer = position.distanceTo(playerPos)
    if (distToPlayer < 5) {
      const explosionDamage = Math.floor(damage * (1 - distToPlayer / 5))
      damagePlayer(explosionDamage)
    }
    
    // 破坏方块
    const radius = 3
    for (let x = -radius; x <= radius; x++) {
      for (let y = -radius; y <= radius; y++) {
        for (let z = -radius; z <= radius; z++) {
          const blockPos: [number, number, number] = [
            Math.round(position.x + x),
            Math.round(position.y + y),
            Math.round(position.z + z)
          ]
          const dist = Math.sqrt(x*x + y*y + z*z)
          if (dist <= radius) {
            removeBlock(blockPos)
          }
        }
      }
    }
  }, [damagePlayer, player.position, removeBlock])
  
  // 处理射箭（简化版）
  const handleShootArrow = useCallback(() => {
    // 简化处理：直接对玩家造成伤害
    // 实际应该创建箭矢实体
  }, [])
  
  // 游戏循环更新
  useEffect(() => {
    if (isPaused) return
    
    const interval = setInterval(() => {
      const now = Date.now()
      const deltaTime = (now - lastUpdateRef.current) / 1000
      lastUpdateRef.current = now
      
      // 更新树叶腐烂
      if (blocks.length > 0) {
        const result = processLeafDecay(blocks, decayingLeavesRef.current, now)
        
        if (result.drops.length > 0) {
          result.drops.forEach(_drop => {
            // 添加掉落物到世界
          })
        }
        
        decayingLeavesRef.current = result.decayingLeaves
        
        // 移除已腐烂的树叶
        result.blocks.forEach(block => {
          removeBlock(block.position)
        })
      }
      
      // 更新动物AI
      if (mobsRef.current.length > 0) {
        const playerPos = new THREE.Vector3(...player.position)
        mobsRef.current = updateMobs(mobsRef.current, deltaTime, playerPos, blockSetRef.current)
      }
      
      // 更新敌对生物AI
      if (hostileMobsRef.current.length > 0) {
        const playerPos = new THREE.Vector3(...player.position)
        hostileMobsRef.current = updateHostileMobs(
          hostileMobsRef.current,
          deltaTime,
          playerPos,
          player.health,
          isDay,
          blockSetRef.current,
          handlePlayerDamage,
          handleExplosion,
          handleShootArrow
        ).mobs
      }
      
      // 夜间生成敌对生物
      if (!isDay) {
        if (now - lastMobSpawnRef.current > 10000 && hostileMobsRef.current.length < 10) {
          spawnHostileMobs()
          lastMobSpawnRef.current = now
        }
      } else {
        // 白天清除燃烧的敌对生物
        hostileMobsRef.current = hostileMobsRef.current.filter(mob => {
          if ((mob.type === 'zombie' || mob.type === 'skeleton') && mob.isBurning) {
            return false
          }
          return true
        })
      }
    }, 100) // 10fps更新
    
    return () => clearInterval(interval)
  }, [blocks, removeBlock, player.position, player.health, isDay, isPaused, handlePlayerDamage, handleExplosion, handleShootArrow, spawnHostileMobs])
  
  // 处理动物点击 (攻击)
  const handleMobClick = useCallback((mob: Mob) => {
    const equippedTool = useGameStore.getState().getEquippedTool()
    const damage = equippedTool?.attackDamage || 1
    
    const updatedMob = damageMob(mob, damage)
    
    if (updatedMob === null) {
      const drops = getMobDrops(mob)
      const { addToInventory } = useGameStore.getState()
      drops.forEach(drop => {
        // 简化处理：直接给玩家掉落物
        if (drop.type === 'porkchop') addToInventory('raw_porkchop', drop.count)
        else if (drop.type === 'beef') addToInventory('raw_beef', drop.count)
        else if (drop.type === 'mutton') addToInventory('raw_mutton', drop.count)
        else if (drop.type === 'wool') addToInventory('wool', drop.count)
        else if (drop.type === 'leather') addToInventory('leather', drop.count)
      })
      
      mobsRef.current = mobsRef.current.filter(m => m.id !== mob.id)
    } else {
      mobsRef.current = mobsRef.current.map(m => 
        m.id === mob.id ? updatedMob : m
      )
    }
    
    if (equippedTool) {
      const { updateToolInSlot, selectedSlot } = useGameStore.getState()
      const updatedTool = useTool(equippedTool, 1)
      updateToolInSlot(selectedSlot, updatedTool)
    }
  }, [])
  
  // 处理敌对生物点击
  const handleHostileMobClick = useCallback((mob: HostileMob) => {
    const equippedTool = useGameStore.getState().getEquippedTool()
    const damage = equippedTool?.attackDamage || 1
    
    const playerPos = new THREE.Vector3(...player.position)
    const updatedMob = damageHostileMob(mob, damage, playerPos)
    
    if (updatedMob === null) {
      const drops = getHostileMobDrops(mob)
      const { addToInventory } = useGameStore.getState()
      drops.forEach(drop => {
        // 添加掉落物到背包
        addToInventory(drop.type as BlockType, drop.count)
      })
      
      hostileMobsRef.current = hostileMobsRef.current.filter(m => m.id !== mob.id)
    } else {
      hostileMobsRef.current = hostileMobsRef.current.map(m => 
        m.id === mob.id ? updatedMob : m
      )
    }
    
    if (equippedTool) {
      const { updateToolInSlot, selectedSlot } = useGameStore.getState()
      const updatedTool = useTool(equippedTool, 1)
      updateToolInSlot(selectedSlot, updatedTool)
    }
  }, [player.position])

  return (
    <>
      <BlockInstances blocks={blocks} />
      <MobRenderer 
        mobs={mobsRef.current}
        hostileMobs={hostileMobsRef.current}
        onMobClick={handleMobClick}
        onHostileMobClick={handleHostileMobClick}
      />
    </>
  )
}
