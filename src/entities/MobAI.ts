import * as THREE from 'three'

// 生物类型
export type MobType = 'pig' | 'cow' | 'sheep'

// AI状态
export type AIState = 'idle' | 'wander' | 'flee' | 'chase'

// 生物属性配置
interface MobConfig {
  health: number
  speed: number
  size: { width: number; height: number; depth: number }
  color: string
  name: string
  drops: { type: string; count: number; chance: number }[]
}

const MOB_CONFIGS: Record<MobType, MobConfig> = {
  pig: {
    health: 10,
    speed: 2.5,
    size: { width: 0.9, height: 0.9, depth: 1.3 },
    color: '#FFB6C1',
    name: '猪',
    drops: [
      { type: 'porkchop', count: 1, chance: 1.0 },
      { type: 'porkchop', count: 1, chance: 0.5 }
    ]
  },
  cow: {
    health: 10,
    speed: 2,
    size: { width: 1.4, height: 1.4, depth: 2.0 },
    color: '#8B4513',
    name: '牛',
    drops: [
      { type: 'beef', count: 1, chance: 1.0 },
      { type: 'leather', count: 1, chance: 0.5 }
    ]
  },
  sheep: {
    health: 8,
    speed: 2.2,
    size: { width: 1.0, height: 1.3, depth: 1.5 },
    color: '#F5F5DC',
    name: '羊',
    drops: [
      { type: 'mutton', count: 1, chance: 1.0 },
      { type: 'wool', count: 1, chance: 1.0 },
      { type: 'wool', count: 1, chance: 0.5 }
    ]
  }
}

// 生物实例接口
export interface Mob {
  id: string
  type: MobType
  position: THREE.Vector3
  rotation: number
  velocity: THREE.Vector3
  health: number
  maxHealth: number
  state: AIState
  stateTimer: number
  targetPosition: THREE.Vector3 | null
  fleeTarget: THREE.Vector3 | null
  lastDamageTime: number
  animationTime: number
}

// 生成生物ID
function generateMobId(): string {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// 创建新生物
export function createMob(type: MobType, position: [number, number, number]): Mob {
  const config = MOB_CONFIGS[type]
  
  return {
    id: generateMobId(),
    type,
    position: new THREE.Vector3(...position),
    rotation: Math.random() * Math.PI * 2,
    velocity: new THREE.Vector3(0, 0, 0),
    health: config.health,
    maxHealth: config.health,
    state: 'idle',
    stateTimer: 0,
    targetPosition: null,
    fleeTarget: null,
    lastDamageTime: 0,
    animationTime: 0
  }
}

// 获取生物配置
export function getMobConfig(type: MobType): MobConfig {
  return MOB_CONFIGS[type]
}

// 获取随机游走目标
function getWanderTarget(currentPos: THREE.Vector3): THREE.Vector3 {
  const angle = Math.random() * Math.PI * 2
  const distance = 3 + Math.random() * 5
  
  return new THREE.Vector3(
    currentPos.x + Math.cos(angle) * distance,
    currentPos.y,
    currentPos.z + Math.sin(angle) * distance
  )
}

// 更新单个生物AI
export function updateMob(
  mob: Mob,
  deltaTime: number,
  playerPosition: THREE.Vector3,
  blocks: Set<string>
): Mob {
  const config = MOB_CONFIGS[mob.type]
  const updatedMob = { ...mob }
  
  updatedMob.animationTime += deltaTime
  updatedMob.stateTimer += deltaTime
  
  // 状态机
  switch (mob.state) {
    case 'idle':
      // IDLE状态: 停留一段时间，然后进入WANDER
      if (mob.stateTimer > 2 + Math.random() * 3) {
        updatedMob.state = 'wander'
        updatedMob.stateTimer = 0
        updatedMob.targetPosition = getWanderTarget(mob.position)
      }
      
      // 检查是否被攻击 (简化: 检测玩家距离)
      const distToPlayer = mob.position.distanceTo(playerPosition)
      if (distToPlayer < 2 && Date.now() - mob.lastDamageTime < 1000) {
        updatedMob.state = 'flee'
        updatedMob.stateTimer = 0
        updatedMob.fleeTarget = playerPosition.clone()
      }
      break
      
    case 'wander':
      // WANDER状态: 向目标移动
      if (mob.targetPosition) {
        const direction = new THREE.Vector3().subVectors(mob.targetPosition, mob.position)
        direction.y = 0
        const distance = direction.length()
        
        if (distance < 0.5) {
          // 到达目标，回到IDLE
          updatedMob.state = 'idle'
          updatedMob.stateTimer = 0
          updatedMob.targetPosition = null
        } else {
          // 移动
          direction.normalize()
          updatedMob.rotation = Math.atan2(direction.x, direction.z)
          
          // 简单障碍物检测
          const nextPos = mob.position.clone().add(
            direction.clone().multiplyScalar(config.speed * deltaTime)
          )
          const blockKey = `${Math.round(nextPos.x)},${Math.round(nextPos.y)},${Math.round(nextPos.z)}`
          
          if (!blocks.has(blockKey)) {
            updatedMob.position.x = nextPos.x
            updatedMob.position.z = nextPos.z
          } else {
            // 有障碍物，换个方向
            updatedMob.targetPosition = getWanderTarget(mob.position)
          }
        }
      }
      
      // 检查是否被攻击
      const wanderDistToPlayer = mob.position.distanceTo(playerPosition)
      if (wanderDistToPlayer < 2 && Date.now() - mob.lastDamageTime < 1000) {
        updatedMob.state = 'flee'
        updatedMob.stateTimer = 0
        updatedMob.fleeTarget = playerPosition.clone()
      }
      break
      
    case 'flee':
      // FLEE状态: 从玩家逃跑，速度1.5倍，持续5秒
      const fleeDirection = new THREE.Vector3().subVectors(mob.position, playerPosition)
      fleeDirection.y = 0
      fleeDirection.normalize()
      
      updatedMob.rotation = Math.atan2(fleeDirection.x, fleeDirection.z)
      
      const fleeSpeed = config.speed * 1.5
      const fleeNextPos = mob.position.clone().add(
        fleeDirection.clone().multiplyScalar(fleeSpeed * deltaTime)
      )
      
      // 检查逃跑路径是否可行
      const fleeBlockKey = `${Math.round(fleeNextPos.x)},${Math.round(fleeNextPos.y)},${Math.round(fleeNextPos.z)}`
      if (!blocks.has(fleeBlockKey)) {
        updatedMob.position.x = fleeNextPos.x
        updatedMob.position.z = fleeNextPos.z
      }
      
      // 5秒后回到IDLE
      if (mob.stateTimer > 5) {
        updatedMob.state = 'idle'
        updatedMob.stateTimer = 0
        updatedMob.fleeTarget = null
      }
      break
  }
  
  // 重力
  const groundKey = `${Math.round(mob.position.x)},${Math.round(mob.position.y - 1)},${Math.round(mob.position.z)}`
  if (!blocks.has(groundKey)) {
    updatedMob.velocity.y -= 20 * deltaTime // 重力
  } else {
    updatedMob.velocity.y = 0
    // 保持在地面
    updatedMob.position.y = Math.round(mob.position.y)
  }
  
  updatedMob.position.y += updatedMob.velocity.y * deltaTime
  
  return updatedMob
}

// 更新所有生物
export function updateMobs(
  mobs: Mob[],
  deltaTime: number,
  playerPosition: THREE.Vector3,
  blocks: Set<string>
): Mob[] {
  return mobs.map(mob => updateMob(mob, deltaTime, playerPosition, blocks))
}

// 伤害生物
export function damageMob(mob: Mob, damage: number): Mob | null {
  const newHealth = mob.health - damage
  
  if (newHealth <= 0) {
    // 生物死亡
    return null
  }
  
  return {
    ...mob,
    health: newHealth,
    state: 'flee',
    stateTimer: 0,
    lastDamageTime: Date.now()
  }
}

// 生成掉落物
export function getMobDrops(mob: Mob): { type: string; count: number }[] {
  const config = MOB_CONFIGS[mob.type]
  const drops: { type: string; count: number }[] = []
  
  for (const drop of config.drops) {
    if (Math.random() < drop.chance) {
      drops.push({ type: drop.type, count: drop.count })
    }
  }
  
  return drops
}

// 随机生成生物类型
export function getRandomMobType(): MobType {
  const types: MobType[] = ['pig', 'cow', 'sheep', 'pig', 'cow']
  return types[Math.floor(Math.random() * types.length)]
}

// 生成一群生物
export function spawnMobGroup(
  centerPosition: [number, number, number],
  count: number,
  radius: number = 10
): Mob[] {
  const mobs: Mob[] = []
  const type = getRandomMobType()
  
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5
    const distance = Math.random() * radius
    
    const pos: [number, number, number] = [
      centerPosition[0] + Math.cos(angle) * distance,
      centerPosition[1],
      centerPosition[2] + Math.sin(angle) * distance
    ]
    
    mobs.push(createMob(type, pos))
  }
  
  return mobs
}
