import React, { useState, useCallback } from 'react'
import { BlockType } from '../blocks/Block'
import { Tool } from '../tools/ToolSystem'
import { 
  findShapedRecipe, 
  getQuickCraftRecipes,
  QuickCraftRecipe
} from './CraftingSystem'
import { useGameStore } from '../engine/gameStore'

// 合成网格 3x3
interface CraftingGridProps {
  isOpen: boolean
  onClose: () => void
  gridSize?: number  // 2 for inventory, 3 for crafting table
}

export const CraftingUI: React.FC<CraftingGridProps> = ({ isOpen, onClose, gridSize = 3 }) => {
  const [grid, setGrid] = useState<(BlockType | null)[][]>(
    Array(3).fill(null).map(() => Array(3).fill(null))
  )
  const [result, setResult] = useState<{ type: BlockType | 'tool'; count: number; tool?: Tool } | null>(null)
  const [draggedItem, setDraggedItem] = useState<{ type: BlockType | 'tool'; slot?: number } | null>(null)
  
  const { inventory, hasItem, consumeItem, addToInventory, addToolToInventory, selectedSlot } = useGameStore()
  
  // 更新合成结果
  const updateResult = useCallback((newGrid: (BlockType | null)[][]) => {
    const matchedRecipe = findShapedRecipe(newGrid)
    
    if (matchedRecipe) {
      if (matchedRecipe.result.tool) {
        const tool = matchedRecipe.result.tool()
        setResult({ type: 'tool', count: 1, tool })
      } else {
        setResult({ type: matchedRecipe.result.type as BlockType, count: matchedRecipe.result.count })
      }
    } else {
      setResult(null)
    }
  }, [])
  
  // 处理网格点击
  const handleGridClick = (row: number, col: number) => {
    if (draggedItem) {
      // 放置物品
      const newGrid = grid.map(r => [...r])
      newGrid[row][col] = draggedItem.type as BlockType
      setGrid(newGrid)
      updateResult(newGrid)
      
      // 消耗物品
      if (draggedItem.slot !== undefined) {
        const { removeFromInventory } = useGameStore.getState()
        removeFromInventory(draggedItem.slot, 1)
      }
      setDraggedItem(null)
    } else if (grid[row][col]) {
      // 拾取物品
      const item = grid[row][col]
      setDraggedItem({ type: item! })
      
      const newGrid = grid.map(r => [...r])
      newGrid[row][col] = null
      setGrid(newGrid)
      updateResult(newGrid)
    }
  }
  
  // 处理快捷栏点击
  const handleSlotClick = (index: number) => {
    const item = inventory[index]
    if (item.count > 0 && item.type !== 'tool') {
      setDraggedItem({ type: item.type, slot: index })
    }
  }
  
  // 完成合成
  const handleCraft = () => {
    if (!result) return
    
    // 添加结果到背包
    if (result.type === 'tool' && result.tool) {
      addToolToInventory(result.tool)
    } else {
      addToInventory(result.type as BlockType, result.count)
    }
    
    // 清空网格并消耗材料
    const newGrid = Array(3).fill(null).map(() => Array(3).fill(null))
    setGrid(newGrid)
    setResult(null)
  }
  
  // 快捷合成
  const handleQuickCraft = (recipe: QuickCraftRecipe) => {
    if (!recipe.canCraft(hasItem)) return
    
    // 消耗材料
    for (const ingredient of recipe.ingredients) {
      consumeItem(ingredient.type, ingredient.count)
    }
    
    // 添加结果
    if (recipe.result.type === 'tool' && recipe.result.tool) {
      addToolToInventory(recipe.result.tool())
    } else {
      addToInventory(recipe.result.type as BlockType, recipe.result.count)
    }
  }
  
  // 获取快捷合成列表
  const quickCrafts = getQuickCraftRecipes()
  
  if (!isOpen) return null
  
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: '#C6C6C6',
        border: '4px solid #373737',
        borderRadius: '4px',
        padding: '20px',
        display: 'flex',
        gap: '20px',
        maxWidth: '800px'
      }}>
        {/* 左侧：合成网格 */}
        <div>
          <h3 style={{ margin: '0 0 10px 0', fontFamily: 'Minecraft, monospace' }}>
            {gridSize === 3 ? '🔨 工作台' : '🎒 背包合成'}
          </h3>
          
          {/* 3x3 合成网格 */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 50px)',
            gap: '4px',
            backgroundColor: '#8B8B8B',
            padding: '8px',
            border: '2px inset #C6C6C6'
          }}>
            {grid.map((row, y) => 
              row.map((cell, x) => (
                <div
                  key={`${y}-${x}`}
                  onClick={() => handleGridClick(y, x)}
                  style={{
                    width: '50px',
                    height: '50px',
                    backgroundColor: cell ? getBlockColor(cell) : '#8B8B8B',
                    border: '2px outset #C6C6C6',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    opacity: x >= gridSize || y >= gridSize ? 0.3 : 1
                  }}
                >
                  {cell && getBlockEmoji(cell)}
                </div>
              ))
            )}
          </div>
          
          {/* 结果槽 */}
          <div style={{
            marginTop: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <span>➡️</span>
            <div
              onClick={handleCraft}
              style={{
                width: '60px',
                height: '60px',
                backgroundColor: result ? '#9E9E9E' : '#8B8B8B',
                border: result ? '3px outset #4CAF50' : '2px outset #C6C6C6',
                cursor: result ? 'pointer' : 'default',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px',
                position: 'relative'
              }}
            >
              {result && (
                <>
                  {result.type === 'tool' ? '⛏' : getBlockEmoji(result.type)}
                  <span style={{
                    position: 'absolute',
                    bottom: '2px',
                    right: '2px',
                    fontSize: '14px',
                    color: 'white',
                    textShadow: '1px 1px 2px black'
                  }}>
                    {result.count > 1 && result.count}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* 右侧：快捷合成和背包 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* 快捷合成 */}
          <div>
            <h4 style={{ margin: '0 0 8px 0' }}>⚡ 快捷合成</h4>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 70px)',
              gap: '8px'
            }}>
              {quickCrafts.map((recipe, i) => {
                const canCraft = recipe.canCraft(hasItem)
                return (
                  <button
                    key={i}
                    onClick={() => handleQuickCraft(recipe)}
                    disabled={!canCraft}
                    style={{
                      padding: '8px',
                      backgroundColor: canCraft ? '#4CAF50' : '#9E9E9E',
                      border: '2px outset #C6C6C6',
                      borderRadius: '4px',
                      cursor: canCraft ? 'pointer' : 'not-allowed',
                      fontSize: '12px'
                    }}
                    title={recipe.name}
                  >
                    <div>{recipe.icon}</div>
                    <div>{recipe.name}</div>
                  </button>
                )
              })}
            </div>
          </div>
          
          {/* 背包快捷栏 */}
          <div>
            <h4 style={{ margin: '10px 0 8px 0' }}>🎒 点击选择材料</h4>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(9, 40px)',
              gap: '2px',
              backgroundColor: '#8B8B8B',
              padding: '4px'
            }}>
              {inventory.slice(0, 9).map((item, i) => (
                <div
                  key={i}
                  onClick={() => handleSlotClick(i)}
                  style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: item.count > 0 ? getBlockColor(item.type) : '#8B8B8B',
                    border: selectedSlot === i ? '2px solid #FFD700' : '1px solid #555',
                    cursor: item.count > 0 && item.type !== 'tool' ? 'pointer' : 'default',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                    position: 'relative'
                  }}
                >
                  {item.count > 0 && (
                    <>
                      {item.type === 'tool' ? '⛏' : getBlockEmoji(item.type)}
                      {item.count > 1 && (
                        <span style={{
                          position: 'absolute',
                          bottom: '1px',
                          right: '1px',
                          fontSize: '10px',
                          color: 'white',
                          textShadow: '1px 1px 1px black'
                        }}>
                          {item.count}
                        </span>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* 关闭按钮 */}
          <button
            onClick={onClose}
            style={{
              marginTop: '10px',
              padding: '10px 20px',
              backgroundColor: '#f44336',
              color: 'white',
              border: '2px outset #f44336',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            ❌ 关闭
          </button>
        </div>
      </div>
      
      {/* 拖拽中的物品 */}
      {draggedItem && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          padding: '20px',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          borderRadius: '8px',
          pointerEvents: 'none',
          zIndex: 1001
        }}>
          点击网格放置: {getBlockEmoji(draggedItem.type)}
        </div>
      )}
    </div>
  )
}

// 获取方块颜色
function getBlockColor(type: BlockType | 'tool'): string {
  const colors: Record<string, string> = {
    grass: '#567D46',
    dirt: '#8B7355',
    stone: '#808080',
    cobblestone: '#696969',
    wood: '#8B4513',
    planks: '#C4A77D',
    leaves: '#3D8C40',
    sand: '#E6C288',
    coal_ore: '#2F2F2F',
    iron_ore: '#B87333',
    gold_ore: '#FFD700',
    diamond_ore: '#00CED1',
    crafting_table: '#8B6914',
    furnace: '#5A5A5A',
    furnace_lit: '#7A5A3A',
    stick: '#DEB887',
    coal: '#1C1C1C',
    iron_ingot: '#C0C0C0',
    gold_ingot: '#FFD700',
    diamond: '#00CED1',
    tool: '#9E9E9E'
  }
  return colors[type] || '#888'
}

// 获取方块表情
function getBlockEmoji(type: BlockType | 'tool'): string {
  const emojis: Record<string, string> = {
    grass: '🟩',
    dirt: '🟫',
    stone: '⬜',
    cobblestone: '🪨',
    wood: '🪵',
    planks: '📦',
    leaves: '🍃',
    sand: '🏖️',
    coal_ore: '⚫',
    iron_ore: '🟤',
    gold_ore: '🟡',
    diamond_ore: '💎',
    crafting_table: '🔨',
    furnace: '🔥',
    furnace_lit: '🔥',
    stick: '🥢',
    coal: '⚫',
    iron_ingot: '🔘',
    gold_ingot: '🥇',
    diamond: '💎',
    tool: '⛏',
    oak_sapling: '🌱',
    birch_sapling: '🌿',
    spruce_sapling: '🌲'
  }
  return emojis[type] || '⬜'
}
