import { BlockType } from '../blocks/Block'

// 红石信号最大强度
export const MAX_REDSTONE_POWER = 15

// 红石组件类型
export type RedstoneComponentType = 
  | 'redstone_dust'
  | 'redstone_torch'
  | 'redstone_block'
  | 'redstone_repeater'
  | 'redstone_comparator'
  | 'piston'
  | 'sticky_piston'
  | 'dispenser'
  | 'dropper'
  | 'observer'
  | 'lever'
  | 'stone_button'
  | 'wooden_button'
  | 'stone_pressure_plate'
  | 'wooden_pressure_plate'
  | 'heavy_weighted_pressure_plate'
  | 'light_weighted_pressure_plate'
  | 'tripwire_hook'
  | 'note_block'
  | 'redstone_lamp'
  | 'tnt'
  | 'iron_door'
  | 'wooden_door'
  | 'iron_trapdoor'
  | 'wooden_trapdoor'
  | 'fence_gate'

// 红石方块状态
export interface RedstoneState {
  power: number              // 信号强度 0-15
  isPowered: boolean         // 是否被充能
  isLit: boolean            // 是否亮起（如火把）
  facing: 'north' | 'south' | 'east' | 'west' | 'up' | 'down'
  delay: number             // 延迟（中继器）
  locked: boolean           // 是否被锁存
  extended: boolean         // 活塞是否伸出
  triggered: boolean        // 是否被触发
}

// 红石网络节点
export interface RedstoneNode {
  position: [number, number, number]
  type: RedstoneComponentType
  state: RedstoneState
  neighbors: [number, number, number][]  // 连接的邻居位置
}

// 红石网络
export interface RedstoneNetwork {
  nodes: Map<string, RedstoneNode>  // key: "x,y,z"
  powerSources: RedstoneNode[]      // 电源节点
  consumers: RedstoneNode[]         // 消耗节点
}

// 初始化红石状态
export function initRedstoneState(type: RedstoneComponentType): RedstoneState {
  const baseState: RedstoneState = {
    power: 0,
    isPowered: false,
    isLit: false,
    facing: 'north',
    delay: 0,
    locked: false,
    extended: false,
    triggered: false
  }

  switch (type) {
    case 'redstone_torch':
      return { ...baseState, power: MAX_REDSTONE_POWER, isLit: true }
    case 'redstone_repeater':
      return { ...baseState, delay: 1 }
    case 'lever':
    case 'stone_button':
    case 'wooden_button':
      return { ...baseState }
    default:
      return baseState
  }
}

// 检查是否是红石组件
export function isRedstoneComponent(type: BlockType): boolean {
  const redstoneTypes: BlockType[] = [
    'redstone_dust', 'redstone_torch', 'redstone_repeater', 'redstone_comparator',
    'piston', 'sticky_piston', 'dispenser', 'dropper', 'observer',
    'lever', 'stone_button', 'wooden_button', 'stone_pressure_plate',
    'wooden_pressure_plate', 'heavy_weighted_pressure_plate', 'light_weighted_pressure_plate',
    'tripwire_hook', 'note_block', 'redstone_lamp', 'tnt', 
    'iron_door', 'wooden_door', 'iron_trapdoor', 'wooden_trapdoor', 'fence_gate'
  ]
  return redstoneTypes.includes(type)
}

// 检查是否是电源
export function isPowerSource(type: RedstoneComponentType): boolean {
  const sources: RedstoneComponentType[] = [
    'redstone_torch', 'redstone_block', 'lever',
    'stone_button', 'wooden_button',
    'stone_pressure_plate', 'wooden_pressure_plate',
    'heavy_weighted_pressure_plate', 'light_weighted_pressure_plate'
  ]
  return sources.includes(type as RedstoneComponentType)
}

// 获取位置字符串key
export function getPositionKey(pos: [number, number, number]): string {
  return `${pos[0]},${pos[1]},${pos[2]}`
}

// 解析位置字符串
export function parsePositionKey(key: string): [number, number, number] {
  const [x, y, z] = key.split(',').map(Number)
  return [x, y, z]
}

// 获取相邻位置
export function getNeighbors(pos: [number, number, number]): [number, number, number][] {
  const [x, y, z] = pos
  return [
    [x + 1, y, z], [x - 1, y, z],  // east, west
    [x, y, z + 1], [x, y, z - 1],  // south, north
    [x, y + 1, z], [x, y - 1, z]   // up, down
  ]
}

// 红石信号传播方向
export const REDSTONE_DIRECTIONS = {
  north: [0, 0, -1] as [number, number, number],
  south: [0, 0, 1] as [number, number, number],
  east: [1, 0, 0] as [number, number, number],
  west: [-1, 0, 0] as [number, number, number],
  up: [0, 1, 0] as [number, number, number],
  down: [0, -1, 0] as [number, number, number]
}

// 反转方向
export function getOppositeDirection(dir: keyof typeof REDSTONE_DIRECTIONS): keyof typeof REDSTONE_DIRECTIONS {
  const opposites: Record<keyof typeof REDSTONE_DIRECTIONS, keyof typeof REDSTONE_DIRECTIONS> = {
    north: 'south', south: 'north',
    east: 'west', west: 'east',
    up: 'down', down: 'up'
  }
  return opposites[dir]
}

// 计算信号衰减
export function attenuatePower(power: number, distance: number): number {
  return Math.max(0, power - distance)
}

// 检查方块是否导电（可被充能）
export function isConductiveBlock(type: BlockType): boolean {
  const nonConductive: BlockType[] = [
    'air', 'glass', 'leaves', 'redstone_dust', 'redstone_torch'
  ]
  return !nonConductive.includes(type)
}

// 红石粉尘连接状态
export interface RedstoneDustConnections {
  north: boolean
  south: boolean
  east: boolean
  west: boolean
  up: boolean
  down: boolean
}

// 计算红石粉尘连接
export function calculateDustConnections(
  pos: [number, number, number],
  getBlockAt: (pos: [number, number, number]) => { type: BlockType } | undefined
): RedstoneDustConnections {
  const connections: RedstoneDustConnections = {
    north: false, south: false, east: false, west: false, up: false, down: false
  }

  const directions: (keyof typeof REDSTONE_DIRECTIONS)[] = ['north', 'south', 'east', 'west', 'up', 'down']
  
  for (const dir of directions) {
    const offset = REDSTONE_DIRECTIONS[dir]
    const neighborPos: [number, number, number] = [
      pos[0] + offset[0],
      pos[1] + offset[1],
      pos[2] + offset[2]
    ]
    
    const neighbor = getBlockAt(neighborPos)
    if (neighbor && isRedstoneComponent(neighbor.type)) {
      connections[dir] = true
    }
  }

  return connections
}

// 红石系统管理器类
export class RedstoneSystem {
  private networks: RedstoneNetwork[] = []
  private pendingUpdates: Map<string, RedstoneState> = new Map()
  private updateQueue: Array<{ pos: [number, number, number]; delay: number }> = []

  // 添加红石组件到网络
  addComponent(pos: [number, number, number], type: RedstoneComponentType): RedstoneNode {
    const node: RedstoneNode = {
      position: pos,
      type,
      state: initRedstoneState(type),
      neighbors: []
    }

    // 查找或创建网络
    let network = this.findNetworkForPosition(pos)
    if (!network) {
      network = { nodes: new Map(), powerSources: [], consumers: [] }
      this.networks.push(network)
    }

    network.nodes.set(getPositionKey(pos), node)
    
    if (isPowerSource(type)) {
      network.powerSources.push(node)
    }

    // 更新邻居连接
    this.updateNeighborConnections(pos, network)

    return node
  }

  // 移除红石组件
  removeComponent(pos: [number, number, number]): void {
    const key = getPositionKey(pos)
    
    for (const network of this.networks) {
      if (network.nodes.has(key)) {
        const node = network.nodes.get(key)!
        network.nodes.delete(key)
        
        // 从电源/消耗列表中移除
        network.powerSources = network.powerSources.filter(n => n !== node)
        network.consumers = network.consumers.filter(n => n !== node)
        
        // 更新邻居连接
        this.updateNeighborConnections(pos, network)
        
        // 如果网络为空，移除网络
        if (network.nodes.size === 0) {
          this.networks = this.networks.filter(n => n !== network)
        }
        
        break
      }
    }
  }

  // 查找位置所属的网络
  private findNetworkForPosition(pos: [number, number, number]): RedstoneNetwork | null {
    const key = getPositionKey(pos)
    
    for (const network of this.networks) {
      if (network.nodes.has(key)) {
        return network
      }
    }
    
    // 检查是否与现有网络相邻
    const neighbors = getNeighbors(pos)
    for (const network of this.networks) {
      for (const neighbor of neighbors) {
        if (network.nodes.has(getPositionKey(neighbor))) {
          return network
        }
      }
    }
    
    return null
  }

  // 更新邻居连接
  private updateNeighborConnections(pos: [number, number, number], network: RedstoneNetwork): void {
    const key = getPositionKey(pos)
    const node = network.nodes.get(key)
    
    if (!node) return

    node.neighbors = []
    const neighbors = getNeighbors(pos)
    
    for (const neighborPos of neighbors) {
      const neighborKey = getPositionKey(neighborPos)
      if (network.nodes.has(neighborKey)) {
        node.neighbors.push(neighborPos)
      }
    }
  }

  // 更新红石信号（BFS算法）
  updateNetwork(network: RedstoneNetwork): void {
    // 重置所有节点状态
    for (const node of network.nodes.values()) {
      if (!isPowerSource(node.type)) {
        node.state.power = 0
        node.state.isPowered = false
      }
    }

    // 从电源开始BFS传播
    const queue: Array<{ node: RedstoneNode; power: number; distance: number }> = []
    const visited = new Set<string>()

    // 初始化队列，添加所有电源
    for (const source of network.powerSources) {
      if (source.state.power > 0) {
        queue.push({ node: source, power: source.state.power, distance: 0 })
        visited.add(getPositionKey(source.position))
      }
    }

    // BFS传播
    while (queue.length > 0) {
      const { node, power, distance } = queue.shift()!
      
      // 更新节点状态
      if (power > node.state.power) {
        node.state.power = power
        node.state.isPowered = power > 0
      }

      // 向邻居传播
      for (const neighborPos of node.neighbors) {
        const neighborKey = getPositionKey(neighborPos)
        
        if (visited.has(neighborKey)) continue
        
        const neighbor = network.nodes.get(neighborKey)
        if (!neighbor) continue

        // 计算传播后的信号强度
        const newPower = attenuatePower(power, 1)
        
        if (newPower > 0 && newPower > neighbor.state.power) {
          visited.add(neighborKey)
          queue.push({ node: neighbor, power: newPower, distance: distance + 1 })
        }
      }
    }
  }

  // 触发方块更新
  triggerUpdate(pos: [number, number, number], delay: number = 0): void {
    this.updateQueue.push({ pos, delay })
  }

  // 处理延迟更新
  processDelayedUpdates(deltaTime: number): void {
    const remaining: typeof this.updateQueue = []
    
    for (const update of this.updateQueue) {
      update.delay -= deltaTime
      
      if (update.delay <= 0) {
        // 执行更新
        for (const network of this.networks) {
          if (network.nodes.has(getPositionKey(update.pos))) {
            this.updateNetwork(network)
            break
          }
        }
      } else {
        remaining.push(update)
      }
    }
    
    this.updateQueue = remaining
  }

  // 切换拉杆/按钮状态
  toggleComponent(pos: [number, number, number]): boolean {
    const key = getPositionKey(pos)
    
    for (const network of this.networks) {
      const node = network.nodes.get(key)
      if (!node) continue

      if (node.type === 'lever' || node.type.includes('button')) {
        node.state.isPowered = !node.state.isPowered
        node.state.power = node.state.isPowered ? MAX_REDSTONE_POWER : 0
        
        this.updateNetwork(network)
        return true
      }
    }
    
    return false
  }

  // 获取组件状态
  getComponentState(pos: [number, number, number]): RedstoneState | null {
    const key = getPositionKey(pos)
    
    for (const network of this.networks) {
      const node = network.nodes.get(key)
      if (node) {
        return { ...node.state }
      }
    }
    
    return null
  }

  // 设置中继器延迟
  setRepeaterDelay(pos: [number, number, number], delay: number): boolean {
    const key = getPositionKey(pos)
    
    for (const network of this.networks) {
      const node = network.nodes.get(key)
      if (node && node.type === 'redstone_repeater') {
        node.state.delay = Math.max(1, Math.min(4, delay))
        return true
      }
    }
    
    return false
  }

  // 获取所有网络状态（用于保存）
  getAllNetworks(): RedstoneNetwork[] {
    return this.networks.map(network => ({
      nodes: new Map(network.nodes),
      powerSources: [...network.powerSources],
      consumers: [...network.consumers]
    }))
  }

  // 加载网络状态
  loadNetworks(networks: RedstoneNetwork[]): void {
    this.networks = networks
  }

  // 清理
  clear(): void {
    this.networks = []
    this.pendingUpdates.clear()
    this.updateQueue = []
  }
}

// 创建全局红石系统实例
export const redstoneSystem = new RedstoneSystem()
