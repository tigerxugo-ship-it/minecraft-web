import * as THREE from 'three'

// 敌对生物类型
export type HostileMobType = 'zombie' | 'skeleton' | 'creeper' | 'spider'

// 敌对生物状态
export type HostileAIState = 'idle' | 'chase' | 'attack' | 'explode' | 'flee' | 'burning'

// 敌对生物配置
interface HostileMobConfig {
  health: number
  speed: number
  damage: number
  attackRange: number
  detectionRange: number
  size: { width: number; height: number; depth: number }
  color: string
  name: string
  isNocturnal: boolean      // 是否夜间活动
  canClimb: boolean         // 是否能攀爬
  isExplosive: boolean      // 是否会爆炸
  drops: { type: string; count: number; chance: number }[]
}

const HOSTILE_MOB_CONFIGS: Record<HostileMobType, HostileMobConfig> = {
  zombie: {
    health: 20,
    speed: 2.3,
    damage: 4,
    attackRange: 2,
    detectionRange: 35,
    size: { width: 0.6, height: 1.95, depth: 0.6 },
    color: '#2E8B57',
    name: '僵尸',
    isNocturnal: true,
    canClimb: false,
    isExplosive: false,
    drops: [
      { type: 'rotten_flesh', count: 1, chance: 1.0 },
      { type: 'iron_ingot', count: 1, chance: 0.025 },
      { type: 'carrot', count: 1, chance: 0.025 }
    ]
  },
  
  skeleton: {
    health: 20,
    speed: 2.2,
    damage: 4,
    attackRange: 15,  // 远程
    detectionRange: 40,
    size: { width: 0.6, height: 1.99, depth: 0.6 },
    color: '#D3D3D3',
    name: '骷髅',
    isNocturnal: true,
    canClimb: false,
    isExplosive: false,
    drops: [
      { type: 'arrow', count: 2, chance: 1.0 },
      { type: 'bone', count: 2, chance: 1.0 },
      { type: 'bow', count: 1, chance: 0.1 }
    ]
  },
  
  creeper: {
    health: 20,
    speed: 2.6,
    damage: 49,  // 爆炸伤害
    attackRange: 3,  // 爆炸范围
    detectionRange: 30,
    size: { width: 0.6, height: 1.7, depth: 0.6 },
    color: '#50C878',
    name: '苦力怕',
    isNocturnal: false,
    canClimb: false,
    isExplosive: true,
    drops: [
      { type: 'gunpowder', count: 2, chance: 1.0 },
      { type: 'music_disc', count: 1, chance: 0.01 }
    ]
  },
  
  spider: {
    health: 16,
    speed: 3.0,
    damage: 3,
    attackRange: 1.5,
    detectionRange: 32,
    size: { width: 1.4, height: 0.9, depth: 1.4 },
    color: '#4B0082',
    name: '蜘蛛',
    isNocturnal: true,
    canClimb: true,
    isExplosive: false,
    drops: [
      { type: 'string', count: 2, chance: 1.0 },
      { type: 'spider_eye', count: 1, chance: 0.33 }
    ]
  }
}

// 箭矢接口
export interface Arrow {
  id: string
  position: THREE.Vector3
  velocity: THREE.Vector3
  damage: number
  ownerId: string
  lifeTime: number
}

// 敌对生物接口
export interface HostileMob {
  id: string
  type: HostileMobType
  position: THREE.Vector3
  rotation: number
  velocity: THREE.Vector3
  health: number
  maxHealth: number
  state: HostileAIState
  stateTimer: number
  targetPosition: THREE.Vector3 | null
  attackCooldown: number
  lastAttackTime: number
  animationTime: number
  
  // 特殊状态
  isCharged: boolean       // 苦力怕是否充能
  chargeTime: number       // 充能时间
  isBurning: boolean       // 是否燃烧（僵尸/骷髅阳光下）
  canSeePlayer: boolean    // 是否能看到玩家
  lastPlayerPosition: THREE.Vector3 | null
}

// 生成生物ID
function generateMobId(): string {
  return `hostile_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// 创建敌对生物
export function createHostileMob(
  type: HostileMobType, 
  position: [number, number, number]
): HostileMob {
  const config = HOSTILE_MOB_CONFIGS[type]
  
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
    attackCooldown: 0,
    lastAttackTime: 0,
    animationTime: 0,
    isCharged: false,
    chargeTime: 0,
    isBurning: false,
    canSeePlayer: false,
    lastPlayerPosition: null
  }
}

// 获取配置
export function getHostileMobConfig(type: HostileMobType): HostileMobConfig {
  return HOSTILE_MOB_CONFIGS[type]
}

// 生成掉落物
export function getHostileMobDrops(mob: HostileMob): { type: string; count: number }[] {
  const config = HOSTILE_MOB_CONFIGS[mob.type]
  const drops: { type: string; count: number }[] = []
  
  for (const drop of config.drops) {
    if (Math.random() < drop.chance) {
      drops.push({ type: drop.type, count: drop.count })
    }
  }
  
  return drops
}

// 伤害敌对生物
export function damageHostileMob(
  mob: HostileMob, 
  damage: number, 
  _attackerPosition?: THREE.Vector3
): HostileMob | null {
  const newHealth = mob.health - damage
  
  if (newHealth <= 0) {
    // 生物死亡
    return null
  }
  
  return {
    ...mob,
    health: newHealth,
    state: 'chase',
    stateTimer: 0,
    lastAttackTime: Date.now()
  }
}

// 更新敌对生物AI
export function updateHostileMob(
  mob: HostileMob,
  deltaTime: number,
  playerPosition: THREE.Vector3,
  _playerHealth: number,
  isDay: boolean,
  blocks: Set<string>,
  _onAttack: (damage: number) => void,
  onExplode: (position: THREE.Vector3, damage: number) => void,
  onShootArrow: (arrow: Arrow) => void
): { mob: HostileMob; arrows: Arrow[] } {
  const config = HOSTILE_MOB_CONFIGS[mob.type]
  const updatedMob = { ...mob }
  const newArrows: Arrow[] = []
  
  updatedMob.animationTime += deltaTime
  updatedMob.stateTimer += deltaTime
  updatedMob.attackCooldown = Math.max(0, mob.attackCooldown - deltaTime)
  
  // 计算与玩家的距离
  const distanceToPlayer = mob.position.distanceTo(playerPosition)
  
  // 检查是否能看到玩家
  const canSeePlayer = checkLineOfSight(mob.position, playerPosition, blocks)
  updatedMob.canSeePlayer = canSeePlayer
  
  if (canSeePlayer) {
    updatedMob.lastPlayerPosition = playerPosition.clone()
  }
  
  // 处理阳光燃烧（僵尸和骷髅）
  if (isDay && (mob.type === 'zombie' || mob.type === 'skeleton')) {
    const isUnderCover = checkUnderCover(mob.position, blocks)
    if (!isUnderCover) {
      updatedMob.isBurning = true
      // 每秒受到1点伤害
      if (Math.floor(updatedMob.animationTime * 10) % 10 === 0) {
        updatedMob.health -= 1
      }
    } else {
      updatedMob.isBurning = false
    }
  } else {
    updatedMob.isBurning = false
  }
  
  // AI状态机
  switch (mob.type) {
    case 'zombie':
      updateZombieAI(updatedMob, deltaTime, playerPosition, distanceToPlayer, canSeePlayer, config, blocks, _onAttack)
      break
      
    case 'skeleton':
      const skeletonResult = updateSkeletonAI(updatedMob, deltaTime, playerPosition, distanceToPlayer, canSeePlayer, config, blocks, _onAttack, onShootArrow)
      updatedMob.state = skeletonResult.mob.state
      newArrows.push(...skeletonResult.arrows)
      break
      
    case 'creeper':
      updateCreeperAI(updatedMob, deltaTime, playerPosition, distanceToPlayer, canSeePlayer, config, blocks, _onAttack, onExplode)
      break
      
    case 'spider':
      updateSpiderAI(updatedMob, deltaTime, playerPosition, distanceToPlayer, canSeePlayer, config, blocks, _onAttack, isDay)
      break
  }
  
  // 重力
  applyGravity(updatedMob, deltaTime, blocks)
  
  return { mob: updatedMob, arrows: newArrows }
}

// 僵尸AI
function updateZombieAI(
  mob: HostileMob,
  deltaTime: number,
  playerPosition: THREE.Vector3,
  distanceToPlayer: number,
  canSeePlayer: boolean,
  config: HostileMobConfig,
  blocks: Set<string>,
  onAttack: (damage: number) => void
): void {
  switch (mob.state) {
    case 'idle':
      if (canSeePlayer && distanceToPlayer < config.detectionRange) {
        mob.state = 'chase'
        mob.stateTimer = 0
      } else if (mob.stateTimer > 3 + Math.random() * 2) {
        // 随机游荡
        mob.state = 'chase'
        mob.targetPosition = new THREE.Vector3(
          mob.position.x + (Math.random() - 0.5) * 10,
          mob.position.y,
          mob.position.z + (Math.random() - 0.5) * 10
        )
        mob.stateTimer = 0
      }
      break
      
    case 'chase':
      if (!canSeePlayer && mob.stateTimer > 5) {
        mob.state = 'idle'
        mob.stateTimer = 0
      } else if (distanceToPlayer < config.attackRange) {
        mob.state = 'attack'
        mob.stateTimer = 0
      } else {
        // 追踪玩家
        moveTowards(mob, playerPosition, config.speed, deltaTime, blocks)
      }
      break
      
    case 'attack':
      if (distanceToPlayer > config.attackRange * 1.5) {
        mob.state = 'chase'
        mob.stateTimer = 0
      } else if (mob.attackCooldown <= 0) {
        // 攻击玩家
        onAttack(config.damage)
        mob.attackCooldown = 1.0  // 1秒攻击间隔
        mob.lastAttackTime = Date.now()
      }
      // 保持面向玩家
      facePosition(mob, playerPosition)
      break
  }
}

// 骷髅AI
function updateSkeletonAI(
  mob: HostileMob,
  deltaTime: number,
  playerPosition: THREE.Vector3,
  distanceToPlayer: number,
  canSeePlayer: boolean,
  config: HostileMobConfig,
  blocks: Set<string>,
  _onAttack: (damage: number) => void,
  onShootArrow: (arrow: Arrow) => void
): { mob: HostileMob; arrows: Arrow[] } {
  const arrows: Arrow[] = []
  
  switch (mob.state) {
    case 'idle':
      if (canSeePlayer && distanceToPlayer < config.detectionRange) {
        mob.state = 'chase'
        mob.stateTimer = 0
      }
      break
      
    case 'chase':
      if (!canSeePlayer) {
        if (mob.lastPlayerPosition) {
          moveTowards(mob, mob.lastPlayerPosition, config.speed, deltaTime, blocks)
        }
        if (mob.stateTimer > 5) {
          mob.state = 'idle'
        }
      } else if (distanceToPlayer < config.attackRange) {
        // 保持距离
        const awayDir = new THREE.Vector3().subVectors(mob.position, playerPosition).normalize()
        const targetPos = mob.position.clone().add(awayDir.multiplyScalar(5))
        moveTowards(mob, targetPos, config.speed, deltaTime, blocks)
      } else if (distanceToPlayer < config.detectionRange) {
        // 射箭
        if (mob.attackCooldown <= 0) {
          const arrow = createArrow(mob.position, playerPosition, config.damage, mob.id)
          arrows.push(arrow)
          onShootArrow(arrow)
          mob.attackCooldown = 2.0  // 2秒射击间隔
        }
        facePosition(mob, playerPosition)
      }
      break
  }
  
  return { mob, arrows }
}

// 苦力怕AI
function updateCreeperAI(
  mob: HostileMob,
  deltaTime: number,
  playerPosition: THREE.Vector3,
  distanceToPlayer: number,
  canSeePlayer: boolean,
  config: HostileMobConfig,
  blocks: Set<string>,
  _onAttack: (damage: number) => void,
  onExplode: (position: THREE.Vector3, damage: number) => void
): void {
  switch (mob.state) {
    case 'idle':
      mob.isCharged = false
      mob.chargeTime = 0
      if (canSeePlayer && distanceToPlayer < config.detectionRange) {
        mob.state = 'chase'
        mob.stateTimer = 0
      }
      break
      
    case 'chase':
      if (!canSeePlayer && mob.stateTimer > 3) {
        mob.state = 'idle'
      } else if (distanceToPlayer <= 3) {
        mob.state = 'explode'
        mob.isCharged = true
        mob.chargeTime = 0
      } else {
        moveTowards(mob, playerPosition, config.speed, deltaTime, blocks)
      }
      break
      
    case 'explode':
      mob.chargeTime += deltaTime
      
      // 充能期间继续靠近
      if (distanceToPlayer > 2) {
        moveTowards(mob, playerPosition, config.speed * 0.5, deltaTime, blocks)
      }
      
      // 1.5秒后爆炸
      if (mob.chargeTime >= 1.5) {
        onExplode(mob.position.clone(), config.damage)
        mob.health = 0  // 自爆死亡
      }
      
      // 如果玩家跑远，取消爆炸
      if (distanceToPlayer > 5) {
        mob.state = 'chase'
        mob.isCharged = false
        mob.chargeTime = 0
      }
      break
  }
}

// 蜘蛛AI
function updateSpiderAI(
  mob: HostileMob,
  deltaTime: number,
  playerPosition: THREE.Vector3,
  distanceToPlayer: number,
  canSeePlayer: boolean,
  config: HostileMobConfig,
  blocks: Set<string>,
  onAttack: (damage: number) => void,
  isDay: boolean
): void {
  // 蜘蛛在白天是中立的，除非被攻击
  const isAggressive = !isDay || mob.health < config.health
  
  switch (mob.state) {
    case 'idle':
      if (isAggressive && canSeePlayer && distanceToPlayer < config.detectionRange) {
        mob.state = 'chase'
        mob.stateTimer = 0
      } else if (mob.stateTimer > 2 + Math.random() * 2) {
        // 攀爬墙壁
        if (config.canClimb && Math.random() < 0.3) {
          tryClimbWall(mob, deltaTime, blocks)
        }
        mob.stateTimer = 0
      }
      break
      
    case 'chase':
      if (!canSeePlayer && mob.stateTimer > 4) {
        mob.state = 'idle'
      } else if (distanceToPlayer < config.attackRange) {
        mob.state = 'attack'
      } else {
        moveTowards(mob, playerPosition, config.speed, deltaTime, blocks)
        // 尝试攀爬接近玩家
        if (config.canClimb && distanceToPlayer > 5) {
          tryClimbWall(mob, deltaTime, blocks)
        }
      }
      break
      
    case 'attack':
      if (distanceToPlayer > config.attackRange * 1.5) {
        mob.state = 'chase'
      } else if (mob.attackCooldown <= 0) {
        onAttack(config.damage)
        mob.attackCooldown = 0.8
      }
      facePosition(mob, playerPosition)
      break
  }
}

// 创建箭矢
function createArrow(
  from: THREE.Vector3,
  to: THREE.Vector3,
  damage: number,
  ownerId: string
): Arrow {
  const direction = new THREE.Vector3().subVectors(to, from).normalize()
  const velocity = direction.multiplyScalar(30)  // 箭矢速度
  
  return {
    id: `arrow_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    position: from.clone().add(new THREE.Vector3(0, 1, 0)),
    velocity,
    damage,
    ownerId,
    lifeTime: 5  // 5秒寿命
  }
}

// 向目标移动
function moveTowards(
  mob: HostileMob,
  target: THREE.Vector3,
  speed: number,
  deltaTime: number,
  blocks: Set<string>
): void {
  const direction = new THREE.Vector3().subVectors(target, mob.position)
  direction.y = 0
  direction.normalize()
  
  mob.rotation = Math.atan2(direction.x, direction.z)
  
  const nextPos = mob.position.clone().add(
    direction.multiplyScalar(speed * deltaTime)
  )
  
  // 碰撞检测
  const blockKey = `${Math.round(nextPos.x)},${Math.round(nextPos.y)},${Math.round(nextPos.z)}`
  if (!blocks.has(blockKey)) {
    mob.position.x = nextPos.x
    mob.position.z = nextPos.z
  }
  
  // 尝试跳跃障碍
  const jumpKey = `${Math.round(nextPos.x)},${Math.round(mob.position.y + 1)},${Math.round(nextPos.z)}`
  if (blocks.has(blockKey) && !blocks.has(jumpKey)) {
    mob.velocity.y = 8  // 跳跃
  }
}

// 面向位置
function facePosition(mob: HostileMob, target: THREE.Vector3): void {
  const direction = new THREE.Vector3().subVectors(target, mob.position)
  mob.rotation = Math.atan2(direction.x, direction.z)
}

// 应用重力
function applyGravity(mob: HostileMob, deltaTime: number, blocks: Set<string>): void {
  const groundKey = `${Math.round(mob.position.x)},${Math.round(mob.position.y - 1)},${Math.round(mob.position.z)}`
  
  if (!blocks.has(groundKey)) {
    mob.velocity.y -= 20 * deltaTime
  } else {
    mob.velocity.y = Math.max(0, mob.velocity.y)
    mob.position.y = Math.round(mob.position.y)
  }
  
  mob.position.y += mob.velocity.y * deltaTime
}

// 检查视线
function checkLineOfSight(
  from: THREE.Vector3,
  to: THREE.Vector3,
  blocks: Set<string>
): boolean {
  const direction = new THREE.Vector3().subVectors(to, from).normalize()
  const distance = from.distanceTo(to)
  const steps = Math.ceil(distance * 2)
  
  for (let i = 0; i < steps; i++) {
    const checkPos = from.clone().add(direction.clone().multiplyScalar(i * 0.5))
    const key = `${Math.round(checkPos.x)},${Math.round(checkPos.y)},${Math.round(checkPos.z)}`
    if (blocks.has(key)) {
      return false
    }
  }
  
  return true
}

// 检查是否在遮蔽处
function checkUnderCover(position: THREE.Vector3, blocks: Set<string>): boolean {
  // 检查头顶是否有方块
  for (let y = Math.round(position.y) + 1; y < position.y + 10; y++) {
    const key = `${Math.round(position.x)},${y},${Math.round(position.z)}`
    if (blocks.has(key)) {
      return true
    }
  }
  return false
}

// 尝试攀爬墙壁
function tryClimbWall(mob: HostileMob, deltaTime: number, blocks: Set<string>): void {
  // 检查前方是否有墙壁
  const forward = new THREE.Vector3(Math.sin(mob.rotation), 0, Math.cos(mob.rotation))
  const checkPos = mob.position.clone().add(forward)
  const wallKey = `${Math.round(checkPos.x)},${Math.round(checkPos.y)},${Math.round(checkPos.z)}`
  
  if (blocks.has(wallKey)) {
    // 向上攀爬
    const upKey = `${Math.round(checkPos.x)},${Math.round(checkPos.y + 1)},${Math.round(checkPos.z)}`
    if (!blocks.has(upKey)) {
      mob.position.y += 3 * deltaTime
    }
  }
}

// 更新所有敌对生物
export function updateHostileMobs(
  mobs: HostileMob[],
  deltaTime: number,
  playerPosition: THREE.Vector3,
  playerHealth: number,
  isDay: boolean,
  blocks: Set<string>,
  onAttack: (damage: number) => void,
  onExplode: (position: THREE.Vector3, damage: number) => void,
  onShootArrow: (arrow: Arrow) => void
): { mobs: HostileMob[]; arrows: Arrow[] } {
  const updatedMobs: HostileMob[] = []
  const allArrows: Arrow[] = []
  
  for (const mob of mobs) {
    const result = updateHostileMob(
      mob, deltaTime, playerPosition, playerHealth, isDay, blocks,
      onAttack, onExplode, onShootArrow
    )
    
    if (result.mob.health > 0) {
      updatedMobs.push(result.mob)
    }
    allArrows.push(...result.arrows)
  }
  
  return { mobs: updatedMobs, arrows: allArrows }
}

// 生成敌对生物群
export function spawnHostileMobGroup(
  centerPosition: [number, number, number],
  type: HostileMobType,
  count: number,
  radius: number = 15
): HostileMob[] {
  const mobs: HostileMob[] = []
  
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5
    const distance = Math.random() * radius
    
    const pos: [number, number, number] = [
      centerPosition[0] + Math.cos(angle) * distance,
      centerPosition[1],
      centerPosition[2] + Math.sin(angle) * distance
    ]
    
    mobs.push(createHostileMob(type, pos))
  }
  
  return mobs
}

// 随机生成敌对生物类型
export function getRandomHostileMobType(): HostileMobType {
  const types: HostileMobType[] = ['zombie', 'zombie', 'skeleton', 'creeper', 'spider']
  return types[Math.floor(Math.random() * types.length)]
}
