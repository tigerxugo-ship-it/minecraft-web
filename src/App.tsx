import { Canvas } from '@react-three/fiber'
import { Physics } from '@react-three/cannon'
import { World } from './world/World'
import { Player } from './player/Player'
import { Hotbar } from './inventory/Hotbar'
import { DayNightCycle } from './environment/DayNightCycle'
import { useGameStore } from './engine/gameStore'
import { CraftingUI } from './crafting/CraftingUI'
import { FurnaceUI } from './crafting/FurnaceUI'
import { SaveManagerUI } from './save/SaveManagerUI'
import { useState, useEffect, useCallback } from 'react'
import { isMobile, getRecommendedGLConfig, getMobileOptimizations, applyIOSFixes, isWebGLSupported } from './tools/deviceUtils'
import { TouchControls } from './mobile/TouchControls'
import { isIPad, preventDefaultTouchBehavior, restoreDefaultTouchBehavior } from './mobile/touchUtils'
import './App.css'

// WebGL 错误边界组件
function WebGLErrorFallback() {
  const isMobileDevice = isMobile()
  
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#1a1a1a',
      color: 'white',
      fontFamily: 'Arial, sans-serif',
      textAlign: 'center',
      padding: '20px',
      zIndex: 9999
    }}>
      <div>
        <h2>WebGL 渲染错误</h2>
        <p>您的设备或浏览器无法正常渲染 3D 内容。</p>
        {isMobileDevice && (
          <p style={{ fontSize: '14px', color: '#ffaa00', marginTop: '15px' }}>
            检测到移动设备，请尝试：<br/>
            • 更新 iOS/Android 系统到最新版本<br/>
            • 使用 Safari (iOS) 或 Chrome (Android)<br/>
            • 确保在设置中启用了 JavaScript
          </p>
        )}
        <p style={{ fontSize: '14px', color: '#aaa', marginTop: '20px' }}>
          建议：使用桌面版 Chrome 或 Firefox 获得最佳体验
        </p>
      </div>
    </div>
  )
}

function App() {
  const { isLocked, setGameTime, openCraftingStation, setPaused } = useGameStore()
  const [showCrafting, setShowCrafting] = useState(false)
  const [showFurnace, setShowFurnace] = useState(false)
  const [showSaveManager, setShowSaveManager] = useState(false)
  const [webglError, setWebglError] = useState(false)

  // 移动端检测和初始化
  const mobile = isMobile()
  const isIPadDevice = isIPad()
  const glConfig = getRecommendedGLConfig()
  const mobileOptimizations = getMobileOptimizations()

  // iOS 特定修复和 WebGL 检测
  useEffect(() => {
    applyIOSFixes()
    
    // 检测 WebGL 支持
    if (!isWebGLSupported()) {
      console.error('WebGL not supported')
      setWebglError(true)
    }

    // 移动端防止默认触摸行为
    if (mobile || isIPadDevice) {
      preventDefaultTouchBehavior()
    }

    return () => {
      if (mobile || isIPadDevice) {
        restoreDefaultTouchBehavior()
      }
    }
  }, [mobile, isIPadDevice])

  // 键盘事件监听
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isLocked) return
      
      switch (e.key.toLowerCase()) {
        case 'e':
          // E键打开背包/合成
          if (openCraftingStation === 'crafting_table') {
            setShowCrafting(true)
          } else {
            // 打开背包合成（2x2）
            setShowCrafting(true)
          }
          setPaused(true)
          break
        case 'q':
          // Q键打开存档管理
          setShowSaveManager(true)
          setPaused(true)
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isLocked, openCraftingStation, setPaused])

  // 关闭界面时恢复游戏
  const handleCloseCrafting = useCallback(() => {
    setShowCrafting(false)
    setPaused(false)
  }, [setPaused])

  const handleCloseFurnace = useCallback(() => {
    setShowFurnace(false)
    setPaused(false)
  }, [setPaused])

  const handleCloseSaveManager = useCallback(() => {
    setShowSaveManager(false)
    setPaused(false)
  }, [setPaused])

  const handleLoadGame = useCallback(() => {
    // 游戏加载后的回调
    setShowSaveManager(false)
    setPaused(false)
  }, [setPaused])

  if (webglError) {
    return <WebGLErrorFallback />
  }

  return (
    <>
      {/* 3D Canvas */}
      <Canvas
        camera={{ fov: mobile ? 75 : 70, near: 0.1, far: 1000 }}
        gl={glConfig}
        dpr={mobileOptimizations.dpr || Math.min(window.devicePixelRatio, 2)}
        frameloop="always"
        style={{ 
          width: '100vw', 
          height: '100vh',
          display: (showSaveManager || showCrafting || showFurnace) ? 'none' : 'block'
        }}
        onError={(e) => {
          console.error('Canvas error:', e)
          setWebglError(true)
        }}
      >
        {/* 昼夜循环系统 */}
        <DayNightCycle onTimeChange={(time, isDay, lightIntensity) => {
          setGameTime(time, isDay, lightIntensity)
        }} />
        
        <Physics gravity={[0, -20, 0]} iterations={mobile ? 5 : 10}>
          <World />
          <Player />
        </Physics>
      </Canvas>

      {/* UI 覆盖层 */}
      {!showSaveManager && !showCrafting && !showFurnace && isLocked && <div className="crosshair" />}
      
      {!showSaveManager && !showCrafting && !showFurnace && <Hotbar />}
      
      {!isLocked && !showSaveManager && !showCrafting && !showFurnace && (
        <div className="start-screen">
          <h1>Minecraft Web</h1>
          <p>点击屏幕开始游戏</p>
          {mobile && (
            <p style={{ fontSize: '14px', color: '#ffaa00', marginTop: '15px' }}>
              ⚠️ 移动端支持有限，建议使用桌面浏览器
            </p>
          )}
          <p style={{ fontSize: '12px', marginTop: '10px', opacity: 0.7 }}>
            推荐：使用 Chrome 或 Firefox 浏览器
          </p>
        </div>
      )}
      
      {!showSaveManager && !showCrafting && !showFurnace && (
        <>
          <ControlsHint />
          <Phase3Controls />
        </>
      )}
      
      {/* 游戏状态显示 */}
      {!showSaveManager && !showCrafting && !showFurnace && <GameStatus />}
      
      {/* 合成界面 */}
      <CraftingUI 
        isOpen={showCrafting} 
        onClose={handleCloseCrafting}
        gridSize={openCraftingStation === 'crafting_table' ? 3 : 2}
      />
      
      {/* 移动端触摸控制 */}
      {(mobile || isIPadDevice) && (
        <TouchControls />
      )}
      
      {/* 熔炉界面 */}
      <FurnaceUI 
        isOpen={showFurnace} 
        onClose={handleCloseFurnace}
      />
      
      {/* 存档管理界面 */}
      <SaveManagerUI 
        isOpen={showSaveManager}
        onClose={handleCloseSaveManager}
        onLoadGame={handleLoadGame}
      />
    </>
  )
}

// 控制说明组件
function ControlsHint() {
  const mobile = isMobile()
  const isIPadDevice = isIPad()
  
  if (mobile || isIPadDevice) {
    return (
      <div style={{
        position: 'fixed',
        top: '60px',
        left: '20px',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        color: 'white',
        padding: '15px',
        borderRadius: '8px',
        fontSize: '14px',
        zIndex: 100,
        maxWidth: '200px'
      }}>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>📱 触摸控制</h3>
        <p style={{ margin: '4px 0' }}>👈 左摇杆 - 移动</p>
        <p style={{ margin: '4px 0' }}>👉 右滑 - 视角</p>
        <p style={{ margin: '4px 0' }}>⛏️ 挖掘按钮</p>
        <p style={{ margin: '4px 0' }}>🧱 放置按钮</p>
        <p style={{ margin: '4px 0' }}>📦 背包按钮</p>
      </div>
    )
  }
  
  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      left: '20px',
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      color: 'white',
      padding: '15px',
      borderRadius: '8px',
      fontSize: '14px',
      zIndex: 100,
      maxWidth: '200px'
    }}>
      <h3 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>控制说明</h3>
      <p style={{ margin: '4px 0' }}>WASD - 移动</p>
      <p style={{ margin: '4px 0' }}>空格 - 跳跃</p>
      <p style={{ margin: '4px 0' }}>鼠标 - 视角</p>
      <p style={{ margin: '4px 0' }}>左键 - 挖掘</p>
      <p style={{ margin: '4px 0' }}>右键 - 放置</p>
      <p style={{ margin: '4px 0' }}>1-9 / 滚轮 - 切换</p>
      <p style={{ margin: '4px 0' }}>ESC - 释放鼠标</p>
    </div>
  )
}

// Phase 3 新功能控制
function Phase3Controls() {
  const mobile = isMobile()
  if (mobile) return null
  
  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      left: '240px',
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      color: 'white',
      padding: '15px',
      borderRadius: '8px',
      fontSize: '14px',
      zIndex: 100,
      maxWidth: '200px'
    }}>
      <h3 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>Phase 3 功能</h3>
      <p style={{ margin: '4px 0' }}>E - 打开合成</p>
      <p style={{ margin: '4px 0' }}>Q - 存档管理</p>
      <p style={{ margin: '4px 0' }}>⛏️ 挖掘等级系统</p>
      <p style={{ margin: '4px 0' }}>💎 矿石生成</p>
      <p style={{ margin: '4px 0' }}>🧟 敌对生物</p>
      <p style={{ margin: '4px 0' }}>🔥 熔炉冶炼</p>
    </div>
  )
}

// 游戏状态组件
function GameStatus() {
  const { gameTime, isDay, getEquippedTool, selectedSlot, inventory, player } = useGameStore()
  const mobile = isMobile()
  
  const formatTime = (time: number) => {
    const hours = Math.floor((time * 24) % 24)
    const minutes = Math.floor(((time * 24 * 60) % 60))
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
  }
  
  const equippedTool = getEquippedTool()
  const currentItem = inventory[selectedSlot]
  
  // 移动端简化显示
  if (mobile) {
    return (
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        color: 'white',
        padding: '10px',
        borderRadius: '8px',
        fontSize: '12px',
        zIndex: 100,
      }}>
        <div>
          <span style={{ 
            color: isDay ? '#FFD700' : '#87CEEB',
            fontWeight: 'bold'
          }}>
            {isDay ? '☀️' : '🌙'} {formatTime(gameTime)}
          </span>
        </div>
        <div style={{ marginTop: '5px' }}>
          <span style={{ color: '#f44336' }}>❤️</span> {player.health}
        </div>
      </div>
    )
  }
  
  return (
    <>
      {/* 时间和工具状态 */}
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        color: 'white',
        padding: '15px',
        borderRadius: '8px',
        fontSize: '14px',
        zIndex: 100,
        minWidth: '150px'
      }}>
        <div style={{ marginBottom: '8px' }}>
          <span style={{ 
            color: isDay ? '#FFD700' : '#87CEEB',
            fontWeight: 'bold'
          }}>
            {isDay ? '☀️' : '🌙'} {formatTime(gameTime)}
          </span>
        </div>
        
        {equippedTool && (
          <div style={{ marginBottom: '8px', fontSize: '12px' }}>
            <div>🔧 {equippedTool.name}</div>
            <div style={{ 
              color: equippedTool.durability > equippedTool.maxDurability * 0.3 ? '#0F0' : '#F00'
            }}>
              耐久: {equippedTool.durability}/{equippedTool.maxDurability}
            </div>
          </div>
        )}
        
        {currentItem && currentItem.type !== 'tool' && currentItem.count > 0 && (
          <div style={{ fontSize: '12px' }}>
            📦 {currentItem.type} x{currentItem.count}
          </div>
        )}
      </div>
      
      {/* 玩家状态 */}
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '180px',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        color: 'white',
        padding: '15px',
        borderRadius: '8px',
        fontSize: '14px',
        zIndex: 100,
        minWidth: '120px'
      }}>
        <div style={{ marginBottom: '5px' }}>
          <span style={{ color: '#f44336' }}>❤️</span> {player.health}/{player.maxHealth}
        </div>
        <div>
          <span style={{ color: '#FF9800' }}>🍗</span> {player.hunger}/{player.maxHunger}
        </div>
      </div>
    </>
  )
}

export default App
