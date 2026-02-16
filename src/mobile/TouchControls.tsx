import { useRef, useCallback, useState, useEffect } from 'react';
import { useGameStore } from '../engine/gameStore';
import { useDeviceOrientation } from './touchUtils';

// 全局触摸输入状态
export const touchInput = {
  moveX: 0,
  moveY: 0,
  lookDeltaX: 0,
  lookDeltaY: 0,
  jump: false,
  mine: false,
  place: false,
};

// 调试日志
let debugLog: string[] = [];
export function getDebugLog() {
  return debugLog.slice(-10);
}
function log(msg: string) {
  console.log(`[Touch] ${msg}`);
  debugLog.push(`${new Date().toLocaleTimeString()}: ${msg}`);
  if (debugLog.length > 20) debugLog.shift();
}

export function TouchControls() {
  const {
    setPaused,
    setOpenCraftingStation,
    setSelectedSlot,
    selectedSlot,
    inventory,
    isLocked,
  } = useGameStore();

  const [debugInfo, setDebugInfo] = useState({
    joystickActive: false,
    buttonsPressed: [] as string[],
    lastTouch: '',
  });

  const lookActiveRef = useRef(false);
  const lastTouchRef = useRef({ x: 0, y: 0 });
  const { isLandscape, isIPad } = useDeviceOrientation();

  const layout = isLandscape || isIPad ? 'landscape' : 'portrait';

  useEffect(() => {
    log('TouchControls mounted');
    return () => log('TouchControls unmounted');
  }, []);

  useEffect(() => {
    log(`isLocked changed: ${isLocked}`);
  }, [isLocked]);

  // 摇杆
  const handleJoystickStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const touch = e.touches[0];
    if (!touch) return;
    
    log(`Joystick START at ${touch.clientX}, ${touch.clientY}`);
    updateJoystick(touch.clientX, touch.clientY, true);
  }, []);

  const handleJoystickMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    if (!touch) return;
    
    updateJoystick(touch.clientX, touch.clientY, true);
  }, []);

  const handleJoystickEnd = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    log('Joystick END');
    touchInput.moveX = 0;
    touchInput.moveY = 0;
    setDebugInfo(prev => ({ ...prev, joystickActive: false }));
  }, []);

  function updateJoystick(x: number, y: number, active: boolean) {
    const centerX = 95; // 20 + 150/2
    const centerY = window.innerHeight - (layout === 'landscape' ? 140 : 120) - 75;
    
    const deltaX = x - centerX;
    const deltaY = y - centerY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const maxDistance = 50;
    
    const clampedDistance = Math.min(distance, maxDistance);
    const angle = Math.atan2(deltaY, deltaX);
    
    touchInput.moveX = Math.cos(angle) * clampedDistance / maxDistance;
    touchInput.moveY = -Math.sin(angle) * clampedDistance / maxDistance;
    
    setDebugInfo(prev => ({ 
      ...prev, 
      joystickActive: active,
      lastTouch: `Joy: ${touchInput.moveX.toFixed(2)}, ${touchInput.moveY.toFixed(2)}`
    }));
  }

  // 按钮
  const handleButton = useCallback((action: string, pressed: boolean) => {
    log(`${action} ${pressed ? 'PRESSED' : 'RELEASED'}`);
    
    switch (action) {
      case 'mine':
        touchInput.mine = pressed;
        break;
      case 'place':
        touchInput.place = pressed;
        break;
      case 'jump':
        if (pressed) touchInput.jump = true;
        break;
      case 'inventory':
        if (pressed) {
          setOpenCraftingStation('inventory');
          setPaused(true);
        }
        break;
      case 'pause':
        if (pressed) setPaused(true);
        break;
    }
    
    setDebugInfo(prev => ({
      ...prev,
      buttonsPressed: pressed 
        ? [...prev.buttonsPressed, action]
        : prev.buttonsPressed.filter(b => b !== action),
      lastTouch: `${action}: ${pressed}`
    }));
  }, [setOpenCraftingStation, setPaused]);

  // 视角
  const handleLookStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (touch) {
      lastTouchRef.current = { x: touch.clientX, y: touch.clientY };
      lookActiveRef.current = true;
      log('Look START');
    }
  }, []);

  const handleLookMove = useCallback((e: React.TouchEvent) => {
    if (!lookActiveRef.current) return;
    const touch = e.touches[0];
    if (!touch) return;

    touchInput.lookDeltaX = (touch.clientX - lastTouchRef.current.x) * 0.8;
    touchInput.lookDeltaY = (touch.clientY - lastTouchRef.current.y) * 0.8;

    lastTouchRef.current = { x: touch.clientX, y: touch.clientY };
  }, []);

  const handleLookEnd = useCallback(() => {
    lookActiveRef.current = false;
    touchInput.lookDeltaX = 0;
    touchInput.lookDeltaY = 0;
    log('Look END');
  }, []);

  const handleSlotChange = useCallback((slot: number) => {
    log(`Slot changed to ${slot}`);
    setSelectedSlot(slot);
  }, [setSelectedSlot]);

  if (!isLocked) {
    return null;
  }

  // 按钮样式
  const buttonStyle = (pressed: boolean): React.CSSProperties => ({
    width: layout === 'landscape' ? 60 : 50,
    height: layout === 'landscape' ? 60 : 50,
    borderRadius: '50%',
    backgroundColor: pressed ? 'rgba(255, 100, 100, 0.8)' : 'rgba(255, 255, 255, 0.5)',
    border: '3px solid rgba(255, 255, 255, 0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: layout === 'landscape' ? 24 : 20,
    cursor: 'pointer',
    touchAction: 'none',
    userSelect: 'none',
    WebkitUserSelect: 'none',
    WebkitTouchCallout: 'none',
    WebkitTapHighlightColor: 'transparent',
    margin: 6,
    boxShadow: pressed 
      ? '0 0 20px rgba(255, 100, 100, 0.8)' 
      : '0 4px 10px rgba(0, 0, 0, 0.3)',
  });

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 9999,
        pointerEvents: 'none',
      }}
    >
      {/* 调试信息 - 左上角 */}
      <div style={{
        position: 'absolute',
        top: 60,
        left: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        color: '#0f0',
        padding: 10,
        borderRadius: 8,
        fontSize: 12,
        fontFamily: 'monospace',
        zIndex: 99999,
        pointerEvents: 'none',
        maxWidth: 200,
      }}>
        <div>Joystick: {debugInfo.joystickActive ? 'ACTIVE' : 'idle'}</div>
        <div>Buttons: {debugInfo.buttonsPressed.join(', ') || 'none'}</div>
        <div>Move: {touchInput.moveX.toFixed(2)}, {touchInput.moveY.toFixed(2)}</div>
        <div>Last: {debugInfo.lastTouch}</div>
      </div>

      {/* 左下角 - 虚拟摇杆 */}
      <div
        onTouchStart={handleJoystickStart}
        onTouchMove={handleJoystickMove}
        onTouchEnd={handleJoystickEnd}
        style={{
          position: 'absolute',
          bottom: layout === 'landscape' ? 140 : 120,
          left: 20,
          width: 150,
          height: 150,
          borderRadius: '50%',
          backgroundColor: debugInfo.joystickActive ? 'rgba(100, 255, 100, 0.3)' : 'rgba(255, 255, 255, 0.2)',
          border: '3px solid rgba(255, 255, 255, 0.5)',
          zIndex: 10000,
          pointerEvents: 'auto',
          touchAction: 'none',
        }}
      >
        {/* 摇杆点 */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: 60,
          height: 60,
          borderRadius: '50%',
          backgroundColor: debugInfo.joystickActive ? 'rgba(100, 255, 100, 0.8)' : 'rgba(255, 255, 255, 0.5)',
          transform: `translate(calc(-50% + ${touchInput.moveX * 50}px), calc(-50% - ${touchInput.moveY * 50}px))`,
          transition: 'transform 0.05s ease-out',
        }} />
      </div>

      {/* 右下角 - 动作按钮 */}
      <div style={{
        position: 'absolute',
        bottom: layout === 'landscape' ? 140 : 120,
        right: 20,
        zIndex: 10000,
        pointerEvents: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}>
        {/* 第一排 */}
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onTouchStart={(e) => { e.preventDefault(); handleButton('mine', true); }}
            onTouchEnd={(e) => { e.preventDefault(); handleButton('mine', false); }}
            onMouseDown={() => handleButton('mine', true)}
            onMouseUp={() => handleButton('mine', false)}
            onMouseLeave={() => handleButton('mine', false)}
            style={buttonStyle(debugInfo.buttonsPressed.includes('mine'))}
          >
            ⛏️
          </button>
          <button
            onTouchStart={(e) => { e.preventDefault(); handleButton('place', true); }}
            onTouchEnd={(e) => { e.preventDefault(); handleButton('place', false); }}
            onMouseDown={() => handleButton('place', true)}
            onMouseUp={() => handleButton('place', false)}
            onMouseLeave={() => handleButton('place', false)}
            style={buttonStyle(debugInfo.buttonsPressed.includes('place'))}
          >
            🧱
          </button>
        </div>
        {/* 第二排 */}
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onTouchStart={(e) => { e.preventDefault(); handleButton('jump', true); }}
            onClick={() => handleButton('jump', true)}
            style={buttonStyle(false)}
          >
            ⬆️
          </button>
          <button
            onTouchStart={(e) => { e.preventDefault(); handleButton('inventory', true); }}
            onClick={() => handleButton('inventory', true)}
            style={buttonStyle(false)}
          >
            📦
          </button>
          <button
            onTouchStart={(e) => { e.preventDefault(); handleButton('pause', true); }}
            onClick={() => handleButton('pause', true)}
            style={buttonStyle(false)}
          >
            ⏸️
          </button>
        </div>
      </div>

      {/* 右半屏幕 - 视角控制 */}
      <div
        style={{
          position: 'absolute',
          top: 100,
          right: 0,
          width: '50%',
          height: '45%',
          zIndex: 9000,
          touchAction: 'none',
          pointerEvents: 'auto',
          backgroundColor: lookActiveRef.current ? 'rgba(255, 255, 0, 0.1)' : 'transparent',
        }}
        onTouchStart={handleLookStart}
        onTouchMove={handleLookMove}
        onTouchEnd={handleLookEnd}
      />

      {/* 底部快捷栏 */}
      <div style={{
        position: 'absolute',
        bottom: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10000,
        display: 'flex',
        gap: 6,
      }}>
        {inventory.slice(0, 9).map((_, index) => (
          <button
            key={index}
            onTouchStart={(e) => { e.preventDefault(); handleSlotChange(index); }}
            onClick={() => handleSlotChange(index)}
            style={{
              width: 48,
              height: 48,
              borderRadius: 8,
              backgroundColor: selectedSlot === index ? 'rgba(255, 255, 100, 0.5)' : 'rgba(255, 255, 255, 0.2)',
              border: selectedSlot === index ? '3px solid #ff0' : '2px solid rgba(255, 255, 255, 0.4)',
              fontSize: 20,
              touchAction: 'none',
              userSelect: 'none',
              cursor: 'pointer',
            }}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
