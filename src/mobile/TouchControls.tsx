import { useRef, useCallback } from 'react';
import { VirtualJoystick } from './VirtualJoystick';
import { ActionButtons } from './ActionButtons';
import { HotbarMobile } from './HotbarMobile';
import { useGameStore } from '../engine/gameStore';
import { useDeviceOrientation } from './touchUtils';

// 直接使用 ref 存储输入状态，避免 React 状态更新延迟
const touchInputRef = {
  moveX: 0,
  moveY: 0,
  lookDeltaX: 0,
  lookDeltaY: 0,
  jump: false,
  mine: false,
  place: false,
  minePressed: false,
  placePressed: false,
};

// 导出给 Player 组件使用
export function getTouchInput() {
  return touchInputRef;
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

  const lookActiveRef = useRef(false);
  const lastTouchRef = useRef({ x: 0, y: 0 });
  const { isLandscape, isIPad } = useDeviceOrientation();

  const layout = isLandscape || isIPad ? 'landscape' : 'portrait';

  // 摇杆移动
  const handleJoystickChange = useCallback((x: number, y: number) => {
    touchInputRef.moveX = x;
    touchInputRef.moveY = y;
  }, []);

  const handleJoystickEnd = useCallback(() => {
    touchInputRef.moveX = 0;
    touchInputRef.moveY = 0;
  }, []);

  // 视角控制
  const handleLookStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (touch) {
      lastTouchRef.current = { x: touch.clientX, y: touch.clientY };
      lookActiveRef.current = true;
    }
  }, []);

  const handleLookMove = useCallback((e: React.TouchEvent) => {
    if (!lookActiveRef.current) return;

    const touch = e.touches[0];
    if (!touch) return;

    const deltaX = touch.clientX - lastTouchRef.current.x;
    const deltaY = touch.clientY - lastTouchRef.current.y;

    touchInputRef.lookDeltaX = deltaX * 0.8;
    touchInputRef.lookDeltaY = deltaY * 0.8;

    lastTouchRef.current = { x: touch.clientX, y: touch.clientY };
  }, []);

  const handleLookEnd = useCallback(() => {
    lookActiveRef.current = false;
    touchInputRef.lookDeltaX = 0;
    touchInputRef.lookDeltaY = 0;
  }, []);

  // 按钮操作 - 使用按压状态而非触发器
  const handleJump = useCallback(() => {
    touchInputRef.jump = true;
    // 100ms 后自动重置
    setTimeout(() => { touchInputRef.jump = false; }, 100);
  }, []);

  const handleMineStart = useCallback(() => {
    touchInputRef.minePressed = true;
    touchInputRef.mine = true;
  }, []);

  const handleMineEnd = useCallback(() => {
    touchInputRef.minePressed = false;
    touchInputRef.mine = false;
  }, []);

  const handlePlaceStart = useCallback(() => {
    touchInputRef.placePressed = true;
    touchInputRef.place = true;
  }, []);

  const handlePlaceEnd = useCallback(() => {
    touchInputRef.placePressed = false;
    touchInputRef.place = false;
  }, []);

  const handleOpenInventory = useCallback(() => {
    setOpenCraftingStation('inventory');
    setPaused(true);
  }, [setOpenCraftingStation, setPaused]);

  const handlePause = useCallback(() => {
    setPaused(true);
  }, [setPaused]);

  const handleSlotChange = useCallback((slot: number) => {
    setSelectedSlot(slot);
  }, [setSelectedSlot]);

  if (!isLocked) {
    return null;
  }

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
      {/* 左下角 - 虚拟摇杆 */}
      <div
        onTouchStart={(e) => e.stopPropagation()}
        style={{
          position: 'absolute',
          bottom: layout === 'landscape' ? 140 : 120,
          left: 20,
          zIndex: 10000,
          pointerEvents: 'auto',
          touchAction: 'none',
        }}
      >
        <VirtualJoystick
          onChange={handleJoystickChange}
          onEnd={handleJoystickEnd}
          size={layout === 'landscape' ? 150 : 130}
          maxDistance={50}
        />
      </div>

      {/* 右下角 - 动作按钮 */}
      <div
        onTouchStart={(e) => e.stopPropagation()}
        style={{
          position: 'absolute',
          bottom: layout === 'landscape' ? 140 : 120,
          right: 20,
          zIndex: 10000,
          pointerEvents: 'auto',
          touchAction: 'none',
        }}
      >
        <ActionButtons
          onMineStart={handleMineStart}
          onMineEnd={handleMineEnd}
          onPlaceStart={handlePlaceStart}
          onPlaceEnd={handlePlaceEnd}
          onJump={handleJump}
          onInventory={handleOpenInventory}
          onPause={handlePause}
          layout={layout}
        />
      </div>

      {/* 右半屏幕 - 视角控制区域 */}
      <div
        style={{
          position: 'absolute',
          top: 80,
          right: 0,
          width: '50%',
          height: '50%',
          zIndex: 9000,
          touchAction: 'none',
          pointerEvents: 'auto',
        }}
        onTouchStart={handleLookStart}
        onTouchMove={handleLookMove}
        onTouchEnd={handleLookEnd}
        onTouchCancel={handleLookEnd}
      />

      {/* 底部快捷栏 */}
      <div
        onTouchStart={(e) => e.stopPropagation()}
        style={{
          position: 'absolute',
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10000,
          pointerEvents: 'auto',
          touchAction: 'none',
        }}
      >
        <HotbarMobile
          inventory={inventory}
          selectedSlot={selectedSlot}
          onSlotChange={handleSlotChange}
        />
      </div>

      {/* 移动端提示 */}
      <div
        style={{
          position: 'absolute',
          top: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          padding: '10px 20px',
          borderRadius: 20,
          fontSize: 14,
          zIndex: 11000,
          textAlign: 'center',
          pointerEvents: 'none',
          fontWeight: 'bold',
        }}
      >
        📱 触摸控制模式
      </div>
    </div>
  );
}
