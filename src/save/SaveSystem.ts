import { BlockType, WorldBlock } from '../engine/gameStore'
import { Tool } from '../tools/ToolSystem'

// 存档数据接口
export interface SaveData {
  version: string
  timestamp: number
  player: {
    position: [number, number, number]
    health: number
    hunger: number
    inventory: Array<{
      type: BlockType | 'tool'
      count: number
      tool?: Tool
    }>
    selectedSlot: number
  }
  world: {
    blocks: WorldBlock[]
    gameTime: number
    isDay: boolean
    seed: number
  }
  entities: {
    mobs: Array<{
      type: string
      position: [number, number, number]
      health: number
    }>
  }
  stats: {
    blocksMined: number
    blocksPlaced: number
    playTime: number
    deaths: number
  }
}

// 存档元数据
export interface SaveMetadata {
  id: string
  name: string
  timestamp: number
  playTime: number
  version: string
  size: number
}

// RLE压缩块数据
interface RLEBlock {
  type: BlockType
  count: number
  startPos: [number, number, number]
  endPos: [number, number, number]
}

// 存档管理器
export class SaveManager {
  private db: IDBDatabase | null = null
  private readonly DB_NAME = 'MinecraftWebDB'
  private readonly DB_VERSION = 1
  private readonly STORE_NAME = 'saves'
  
  constructor() {
    this.initDB()
  }
  
  // 初始化IndexedDB
  private async initDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, this.DB_VERSION)
      
      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        if (!db.objectStoreNames.contains(this.STORE_NAME)) {
          db.createObjectStore(this.STORE_NAME, { keyPath: 'id' })
        }
      }
    })
  }
  
  // 确保数据库已初始化
  private async ensureDB(): Promise<IDBDatabase> {
    if (!this.db) {
      await this.initDB()
    }
    if (!this.db) {
      throw new Error('Failed to initialize database')
    }
    return this.db
  }
  
  // 压缩方块数据 (RLE)
  private compressBlocks(blocks: WorldBlock[]): RLEBlock[] {
    if (blocks.length === 0) return []
    
    // 按位置排序
    const sorted = [...blocks].sort((a, b) => {
      if (a.position[1] !== b.position[1]) return a.position[1] - b.position[1]
      if (a.position[2] !== b.position[2]) return a.position[2] - b.position[2]
      return a.position[0] - b.position[0]
    })
    
    const compressed: RLEBlock[] = []
    let current: RLEBlock | null = null
    
    for (const block of sorted) {
      if (!current || current.type !== block.type) {
        if (current) compressed.push(current)
        current = {
          type: block.type,
          count: 1,
          startPos: block.position,
          endPos: block.position
        }
      } else {
        current.count++
        current.endPos = block.position
      }
    }
    
    if (current) compressed.push(current)
    return compressed
  }
  
  // 解压方块数据
  private decompressBlocks(compressed: RLEBlock[]): WorldBlock[] {
    const blocks: WorldBlock[] = []
    
    for (const rle of compressed) {
      // 简化处理：每个RLE块生成count个相同类型的方块
      for (let i = 0; i < rle.count; i++) {
        blocks.push({
          type: rle.type,
          position: [
            rle.startPos[0] + i,
            rle.startPos[1],
            rle.startPos[2]
          ]
        })
      }
    }
    
    return blocks
  }
  
  // 保存游戏
  async saveGame(
    id: string,
    name: string,
    data: Omit<SaveData, 'timestamp' | 'version'>
  ): Promise<void> {
    const db = await this.ensureDB()
    
    const saveData: SaveData = {
      ...data,
      version: '1.0.0',
      timestamp: Date.now()
    }
    
    // 压缩方块数据
    const compressedBlocks = this.compressBlocks(saveData.world.blocks)
    const dataToStore = {
      ...saveData,
      world: {
        ...saveData.world,
        blocks: compressedBlocks
      }
    }
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.STORE_NAME], 'readwrite')
      const store = transaction.objectStore(this.STORE_NAME)
      
      const saveRecord = {
        id,
        name,
        timestamp: saveData.timestamp,
        version: saveData.version,
        data: dataToStore
      }
      
      const request = store.put(saveRecord)
      
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }
  
  // 加载游戏
  async loadGame(id: string): Promise<SaveData | null> {
    const db = await this.ensureDB()
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.STORE_NAME], 'readonly')
      const store = transaction.objectStore(this.STORE_NAME)
      const request = store.get(id)
      
      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        const record = request.result
        if (!record) {
          resolve(null)
          return
        }
        
        const data = record.data as SaveData
        
        // 解压方块数据
        if (Array.isArray(data.world.blocks) && data.world.blocks.length > 0 && 'count' in data.world.blocks[0]) {
          data.world.blocks = this.decompressBlocks(data.world.blocks as unknown as RLEBlock[])
        }
        
        resolve(data)
      }
    })
  }
  
  // 获取所有存档列表
  async getSaveList(): Promise<SaveMetadata[]> {
    const db = await this.ensureDB()
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.STORE_NAME], 'readonly')
      const store = transaction.objectStore(this.STORE_NAME)
      const request = store.getAll()
      
      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        const records = request.result
        const metadata: SaveMetadata[] = records.map(r => ({
          id: r.id,
          name: r.name,
          timestamp: r.timestamp,
          playTime: r.data.stats?.playTime || 0,
          version: r.version,
          size: JSON.stringify(r).length
        }))
        
        // 按时间排序
        metadata.sort((a, b) => b.timestamp - a.timestamp)
        resolve(metadata)
      }
    })
  }
  
  // 删除存档
  async deleteSave(id: string): Promise<void> {
    const db = await this.ensureDB()
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.STORE_NAME], 'readwrite')
      const store = transaction.objectStore(this.STORE_NAME)
      const request = store.delete(id)
      
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }
  
  // 导出存档为JSON
  async exportSave(id: string): Promise<string> {
    const data = await this.loadGame(id)
    if (!data) throw new Error('Save not found')
    
    return JSON.stringify(data, null, 2)
  }
  
  // 导入存档
  async importSave(id: string, name: string, jsonData: string): Promise<void> {
    const data = JSON.parse(jsonData) as SaveData
    await this.saveGame(id, name, data)
  }
  
  // 自动保存（使用LocalStorage作为备份）
  autoSaveToLocal(data: Omit<SaveData, 'timestamp' | 'version'>): void {
    try {
      const saveData: SaveData = {
        ...data,
        version: '1.0.0',
        timestamp: Date.now()
      }
      
      // 压缩后存储
      const compressed = this.compressBlocks(saveData.world.blocks)
      const toStore = {
        ...saveData,
        world: {
          ...saveData.world,
          blocks: compressed
        }
      }
      
      localStorage.setItem('minecraft_web_autosave', JSON.stringify(toStore))
      localStorage.setItem('minecraft_web_autosave_time', Date.now().toString())
    } catch (e) {
      console.warn('Auto-save failed:', e)
    }
  }
  
  // 从LocalStorage加载自动保存
  loadAutoSave(): SaveData | null {
    try {
      const data = localStorage.getItem('minecraft_web_autosave')
      if (!data) return null
      
      const parsed = JSON.parse(data) as SaveData
      
      // 解压方块
      if (Array.isArray(parsed.world.blocks) && parsed.world.blocks.length > 0 && 'count' in parsed.world.blocks[0]) {
        parsed.world.blocks = this.decompressBlocks(parsed.world.blocks as unknown as RLEBlock[])
      }
      
      return parsed
    } catch (e) {
      console.warn('Load auto-save failed:', e)
      return null
    }
  }
  
  // 清除自动保存
  clearAutoSave(): void {
    localStorage.removeItem('minecraft_web_autosave')
    localStorage.removeItem('minecraft_web_autosave_time')
  }
  
  // 获取存储使用情况
  async getStorageUsage(): Promise<{ used: number; quota: number; percent: number }> {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate()
      const used = estimate.usage || 0
      const quota = estimate.quota || 1
      return {
        used,
        quota,
        percent: Math.round((used / quota) * 100)
      }
    }
    return { used: 0, quota: 0, percent: 0 }
  }
}

// 创建全局存档管理器实例
export const saveManager = new SaveManager()

// 生成存档ID
export function generateSaveId(): string {
  return `save_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// 格式化时间
export function formatPlayTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  
  if (hours > 0) {
    return `${hours}小时${minutes}分`
  } else if (minutes > 0) {
    return `${minutes}分${secs}秒`
  }
  return `${secs}秒`
}

// 格式化日期
export function formatDate(timestamp: number): string {
  const date = new Date(timestamp)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}
