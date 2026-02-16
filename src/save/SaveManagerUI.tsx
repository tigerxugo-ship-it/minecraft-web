import React, { useState, useEffect } from 'react'
import { SaveManager, SaveMetadata, formatDate, formatPlayTime, generateSaveId } from './SaveSystem'
import { useGameStore } from '../engine/gameStore'
import { generateOres } from '../world/OreGenerator'
import { BlockType } from '../blocks/Block'

interface SaveManagerUIProps {
  isOpen: boolean
  onClose: () => void
  onLoadGame: (saveId: string) => void
}

export const SaveManagerUI: React.FC<SaveManagerUIProps> = ({ isOpen, onClose, onLoadGame }) => {
  const [saves, setSaves] = useState<SaveMetadata[]>([])
  const [selectedSave, setSelectedSave] = useState<string | null>(null)
  const [newSaveName, setNewSaveName] = useState('')
  const [message, setMessage] = useState('')
  const [storageInfo, setStorageInfo] = useState({ used: 0, quota: 0, percent: 0 })
  
  const saveManager = new SaveManager()
  const { blocks, inventory, player, gameTime, isDay, setBlocks, setPlayerHealth, setPlayerHunger, setPlayerPosition } = useGameStore()
  
  // 加载存档列表
  useEffect(() => {
    if (isOpen) {
      loadSaveList()
      loadStorageInfo()
    }
  }, [isOpen])
  
  const loadSaveList = async () => {
    try {
      const list = await saveManager.getSaveList()
      setSaves(list)
    } catch (e) {
      setMessage('加载存档列表失败')
    }
  }
  
  const loadStorageInfo = async () => {
    try {
      const info = await saveManager.getStorageUsage()
      setStorageInfo(info)
    } catch (e) {
      console.warn('无法获取存储信息')
    }
  }
  
  // 保存游戏
  const handleSave = async () => {
    if (!newSaveName.trim()) {
      setMessage('请输入存档名称')
      return
    }
    
    try {
      const saveId = generateSaveId()
      
      await saveManager.saveGame(saveId, newSaveName, {
        player: {
          position: player.position,
          health: player.health,
          hunger: player.hunger,
          inventory,
          selectedSlot: 0
        },
        world: {
          blocks,
          gameTime,
          isDay,
          seed: 12345
        },
        entities: {
          mobs: []
        },
        stats: {
          blocksMined: 0,
          blocksPlaced: 0,
          playTime: 0,
          deaths: 0
        }
      })
      
      setMessage('保存成功！')
      setNewSaveName('')
      loadSaveList()
    } catch (e) {
      setMessage('保存失败: ' + (e as Error).message)
    }
  }
  
  // 加载游戏
  const handleLoad = async (saveId: string) => {
    try {
      const data = await saveManager.loadGame(saveId)
      if (data) {
        // 恢复游戏状态
        setBlocks(data.world.blocks)
        setPlayerHealth(data.player.health)
        setPlayerHunger(data.player.hunger)
        setPlayerPosition(data.player.position)
        
        // 恢复背包
        const { inventory: currentInventory } = useGameStore.getState()
        const newInventory = [...currentInventory]
        data.player.inventory.forEach((item, i) => {
          if (i < newInventory.length) {
            newInventory[i] = item as typeof newInventory[0]
          }
        })
        
        setMessage('加载成功！')
        onLoadGame(saveId)
        onClose()
      } else {
        setMessage('存档不存在')
      }
    } catch (e) {
      setMessage('加载失败: ' + (e as Error).message)
    }
  }
  
  // 删除存档
  const handleDelete = async (saveId: string) => {
    if (!confirm('确定要删除这个存档吗？')) return
    
    try {
      await saveManager.deleteSave(saveId)
      setMessage('删除成功')
      loadSaveList()
    } catch (e) {
      setMessage('删除失败')
    }
  }
  
  // 新建世界
  const handleNewWorld = () => {
    if (!confirm('确定要创建新世界吗？当前进度将丢失。')) return
    
    // 生成新的世界
    const newBlocks = generateInitialWorld()
    const blocksWithOres = generateOres(newBlocks)
    
    setBlocks(blocksWithOres)
    setPlayerHealth(20)
    setPlayerHunger(20)
    setPlayerPosition([0, 10, 0])
    
    setMessage('新世界已创建！')
    onClose()
  }
  
  // 生成初始世界
  const generateInitialWorld = (): { type: BlockType; position: [number, number, number] }[] => {
    const blocks: { type: BlockType; position: [number, number, number] }[] = []
    
    // 生成地面
    for (let x = -20; x <= 20; x++) {
      for (let z = -20; z <= 20; z++) {
        // 顶层草地
        blocks.push({ type: 'grass', position: [x, 0, z] })
        // 下层泥土
        blocks.push({ type: 'dirt', position: [x, -1, z] })
        blocks.push({ type: 'dirt', position: [x, -2, z] })
        // 底层石头
        for (let y = -3; y >= -10; y--) {
          blocks.push({ type: 'stone', position: [x, y, z] })
        }
      }
    }
    
    return blocks
  }
  
  // 导出存档
  const handleExport = async (saveId: string) => {
    try {
      const json = await saveManager.exportSave(saveId)
      const blob = new Blob([json], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `minecraft_save_${saveId}.json`
      a.click()
      URL.revokeObjectURL(url)
      setMessage('导出成功')
    } catch (e) {
      setMessage('导出失败')
    }
  }
  
  if (!isOpen) return null
  
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 2000
    }}>
      <div style={{
        backgroundColor: '#1a1a2e',
        border: '4px solid #4a4a6a',
        borderRadius: '8px',
        width: '700px',
        maxHeight: '80vh',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* 标题 */}
        <div style={{
          padding: '20px',
          borderBottom: '2px solid #4a4a6a',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h2 style={{ margin: 0, color: '#fff' }}>💾 存档管理</h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#fff',
              fontSize: '24px',
              cursor: 'pointer'
            }}
          >
            ✕
          </button>
        </div>
        
        {/* 内容区 */}
        <div style={{
          padding: '20px',
          overflow: 'auto',
          flex: 1
        }}>
          {/* 新建存档 */}
          <div style={{
            backgroundColor: '#2a2a4a',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '20px'
          }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#fff' }}>📝 保存当前游戏</h3>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                value={newSaveName}
                onChange={(e) => setNewSaveName(e.target.value)}
                placeholder="输入存档名称..."
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '4px',
                  border: '2px solid #4a4a6a',
                  backgroundColor: '#1a1a2e',
                  color: '#fff'
                }}
              />
              <button
                onClick={handleSave}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                💾 保存
              </button>
            </div>
          </div>
          
          {/* 存档列表 */}
          <div>
            <h3 style={{ color: '#fff', margin: '0 0 15px 0' }}>📂 存档列表 ({saves.length})</h3>
            
            {saves.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '40px',
                color: '#888'
              }}>
                暂无存档
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {saves.map((save) => (
                  <div
                    key={save.id}
                    onClick={() => setSelectedSave(save.id)}
                    style={{
                      backgroundColor: selectedSave === save.id ? '#3a3a5a' : '#2a2a4a',
                      padding: '15px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      border: selectedSave === save.id ? '2px solid #4CAF50' : '2px solid transparent'
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div>
                        <div style={{ color: '#fff', fontSize: '18px', fontWeight: 'bold' }}>
                          {save.name}
                        </div>
                        <div style={{ color: '#888', fontSize: '12px', marginTop: '5px' }}>
                          保存时间: {formatDate(save.timestamp)} |
                          游戏时长: {formatPlayTime(save.playTime)} |
                          版本: {save.version}
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleLoad(save.id)
                          }}
                          style={{
                            padding: '8px 16px',
                            backgroundColor: '#2196F3',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          加载
                        </button>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleExport(save.id)
                          }}
                          style={{
                            padding: '8px 16px',
                            backgroundColor: '#FF9800',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          导出
                        </button>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDelete(save.id)
                          }}
                          style={{
                            padding: '8px 16px',
                            backgroundColor: '#f44336',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          删除
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* 存储信息 */}
          <div style={{
            marginTop: '20px',
            padding: '15px',
            backgroundColor: '#2a2a4a',
            borderRadius: '8px',
            color: '#888'
          }}>
            存储使用: {(storageInfo.used / 1024 / 1024).toFixed(2)} MB / 
            {(storageInfo.quota / 1024 / 1024).toFixed(0)} MB 
            ({storageInfo.percent}%)
          </div>
          
          {/* 消息提示 */}
          {message && (
            <div style={{
              marginTop: '15px',
              padding: '12px',
              backgroundColor: message.includes('成功') ? '#4CAF50' : '#f44336',
              color: 'white',
              borderRadius: '4px',
              textAlign: 'center'
            }}>
              {message}
            </div>
          )}
        </div>
        
        {/* 底部按钮 */}
        <div style={{
          padding: '20px',
          borderTop: '2px solid #4a4a6a',
          display: 'flex',
          justifyContent: 'center',
          gap: '15px'
        }}>
          <button
            onClick={handleNewWorld}
            style={{
              padding: '12px 30px',
              backgroundColor: '#9C27B0',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            🌍 新建世界
          </button>
          
          <button
            onClick={onClose}
            style={{
              padding: '12px 30px',
              backgroundColor: '#666',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            返回游戏
          </button>
        </div>
      </div>
    </div>
  )
}
