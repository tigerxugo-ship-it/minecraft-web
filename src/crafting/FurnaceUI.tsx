import React, { useState, useEffect } from 'react'
import { BlockType } from '../blocks/Block'
import { 
  findFurnaceRecipe, 
  isValidFuel, 
  getFuelBurnTime
} from './CraftingSystem'
import { useGameStore } from '../engine/gameStore'

interface FurnaceUIProps {
  isOpen: boolean
  onClose: () => void
}

export const FurnaceUI: React.FC<FurnaceUIProps> = ({ isOpen, onClose }) => {
  const [input, setInput] = useState<BlockType | null>(null)
  const [fuel, setFuel] = useState<BlockType | null>(null)
  const [output, setOutput] = useState<{ type: BlockType; count: number } | null>(null)
  
  const [cookProgress, setCookProgress] = useState(0)
  const [burnProgress, setBurnProgress] = useState(0)
  const [isCooking, setIsCooking] = useState(false)
  const [burnTime, setBurnTime] = useState(0)
  
  const { hasItem, consumeItem, addToInventory } = useGameStore()
  
  // 检查并开始冶炼
  useEffect(() => {
    if (!isOpen) return
    
    const interval = setInterval(() => {
      if (!input || !fuel) {
        setIsCooking(false)
        return
      }
      
      const recipe = findFurnaceRecipe(input)
      if (!recipe) {
        setIsCooking(false)
        return
      }
      
      // 检查燃料
      if (burnTime <= 0) {
        if (isValidFuel(fuel)) {
          setBurnTime(getFuelBurnTime(fuel))
          // 消耗燃料
          consumeItem(fuel, 1)
          if (fuel === 'coal' && !hasItem('coal', 1)) setFuel(null)
          else if (fuel === 'wood' && !hasItem('wood', 1)) setFuel(null)
          else if (fuel === 'planks' && !hasItem('planks', 1)) setFuel(null)
        } else {
          setIsCooking(false)
          return
        }
      }
      
      setIsCooking(true)
      
      // 更新燃烧进度
      setBurnTime(prev => {
        const newTime = prev - 0.1
        const maxBurnTime = getFuelBurnTime(fuel)
        setBurnProgress((newTime / maxBurnTime) * 100)
        return newTime
      })
      
      // 更新烹饪进度
      setCookProgress(prev => {
        const newProgress = prev + (100 / (recipe.cookTime * 10))
        
        if (newProgress >= 100) {
          // 完成烹饪
          addToInventory(recipe.result.type, recipe.result.count)
          
          // 消耗输入
          consumeItem(input, 1)
          if (!hasItem(input, 1)) {
            setInput(null)
          }
          
          return 0
        }
        
        return newProgress
      })
    }, 100)
    
    return () => clearInterval(interval)
  }, [isOpen, input, fuel, hasItem, consumeItem, addToInventory])
  
  // 处理槽位点击
  const handleInputClick = () => {
    if (input) {
      // 取出
      addToInventory(input, 1)
      setInput(null)
    } else {
      // 查找背包中的矿石
      const ores: BlockType[] = ['iron_ore', 'gold_ore']
      for (const ore of ores) {
        if (hasItem(ore, 1)) {
          consumeItem(ore, 1)
          setInput(ore)
          break
        }
      }
    }
  }
  
  const handleFuelClick = () => {
    if (fuel) {
      // 取出
      addToInventory(fuel, 1)
      setFuel(null)
    } else {
      // 查找背包中的燃料
      for (const f of ['coal', 'wood', 'planks'] as BlockType[]) {
        if (hasItem(f, 1)) {
          consumeItem(f, 1)
          setFuel(f)
          break
        }
      }
    }
  }
  
  // 预测输出
  useEffect(() => {
    if (input) {
      const recipe = findFurnaceRecipe(input)
      if (recipe) {
        setOutput(recipe.result)
      } else {
        setOutput(null)
      }
    } else {
      setOutput(null)
    }
  }, [input])
  
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
        flexDirection: 'column',
        alignItems: 'center',
        gap: '15px'
      }}>
        <h3 style={{ margin: 0, fontFamily: 'Minecraft, monospace' }}>
          🔥 熔炉
        </h3>
        
        {/* 熔炉界面 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          padding: '20px',
          backgroundColor: '#8B8B8B',
          borderRadius: '4px'
        }}>
          {/* 输入槽 */}
          <div style={{ textAlign: 'center' }}>
            <div>输入</div>
            <div
              onClick={handleInputClick}
              style={{
                width: '60px',
                height: '60px',
                backgroundColor: input ? getBlockColor(input) : '#666',
                border: '3px inset #C6C6C6',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px',
                marginTop: '5px'
              }}
            >
              {input && getBlockEmoji(input)}
            </div>
          </div>
          
          {/* 燃烧指示器 */}
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '30px',
              height: '60px',
              backgroundColor: '#444',
              border: '2px inset #C6C6C6',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* 火焰 */}
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: `${burnProgress}%`,
                backgroundColor: isCooking ? '#FF5722' : '#666',
                transition: 'height 0.1s linear'
              }} />
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontSize: '16px'
              }}>
                🔥
              </div>
            </div>
          </div>
          
          {/* 燃料槽 */}
          <div style={{ textAlign: 'center' }}>
            <div>燃料</div>
            <div
              onClick={handleFuelClick}
              style={{
                width: '60px',
                height: '60px',
                backgroundColor: fuel ? getBlockColor(fuel) : '#666',
                border: '3px inset #C6C6C6',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px',
                marginTop: '5px'
              }}
            >
              {fuel && getBlockEmoji(fuel)}
            </div>
          </div>
          
          {/* 进度箭头 */}
          <div style={{
            width: '40px',
            height: '30px',
            backgroundColor: '#666',
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '4px'
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              width: `${cookProgress}%`,
              backgroundColor: '#4CAF50',
              transition: 'width 0.1s linear'
            }} />
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: '16px'
            }}>
              ➡️
            </div>
          </div>
          
          {/* 输出槽 */}
          <div style={{ textAlign: 'center' }}>
            <div>输出</div>
            <div style={{
              width: '60px',
              height: '60px',
              backgroundColor: output ? getBlockColor(output.type) : '#666',
              border: '3px outset #C6C6C6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
              marginTop: '5px',
              position: 'relative'
            }}>
              {output && (
                <>
                  {getBlockEmoji(output.type)}
                  <span style={{
                    position: 'absolute',
                    bottom: '2px',
                    right: '2px',
                    fontSize: '14px',
                    color: 'white',
                    textShadow: '1px 1px 2px black'
                  }}>
                    {output.count}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* 说明 */}
        <div style={{
          fontSize: '12px',
          color: '#555',
          textAlign: 'center'
        }}>
          点击输入槽放入矿石，点击燃料槽放入燃料<br/>
          支持: 铁矿石→铁锭, 金矿石→金锭<br/>
          燃料: 煤炭(80秒), 木头/木板(15秒)
        </div>
        
        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          style={{
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
  )
}

// 获取方块颜色
function getBlockColor(type: BlockType): string {
  const colors: Record<string, string> = {
    iron_ore: '#B87333',
    gold_ore: '#FFD700',
    iron_ingot: '#C0C0C0',
    gold_ingot: '#FFD700',
    coal: '#1C1C1C',
    wood: '#8B4513',
    planks: '#C4A77D'
  }
  return colors[type] || '#888'
}

// 获取方块表情
function getBlockEmoji(type: BlockType): string {
  const emojis: Record<string, string> = {
    iron_ore: '🟤',
    gold_ore: '🟡',
    iron_ingot: '🔘',
    gold_ingot: '🥇',
    coal: '⚫',
    wood: '🪵',
    planks: '📦'
  }
  return emojis[type] || '⬜'
}
