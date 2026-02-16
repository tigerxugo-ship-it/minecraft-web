import { useState, useCallback, useRef } from 'react';
import { VirtualJoystick } from './VirtualJoystick';
import { ActionButtons } from './ActionButtons';
import { HotbarMobile } from './HotbarMobile';
import { useGameStore } from '../engine/gameStore';
import { useDeviceOrientation } from './touchUtils';

export function TouchControls() {
  const {
    setTouchMoveInput,
    setTouchLookInput,
    triggerTouchJump,
    triggerTouchMine,
    triggerTouchPlace,
    setPaused,
    setOpenCraftingStation,
    setSelectedSlot,
    selectedSlot,
    inventory,
    isLocked,
  } = useGameStore();

  const [lookActive, setLookActive] = useState(false);
  const lastTouchRef = useRef({ x: 0, y: 0 });
  const { isLandscape, isIPad } = useDeviceOrientation();

  const layout = isLandscape || isIPad ? 'landscape' : 'portrait';

  const handleJoystickChange = useCallback((x: number, y: number) => {
    setTouchMoveInput(x, y);
  }, [setTouchMoveInput]);

  const handleJoystickEnd = useCallback(() => {
    setTouchMoveInput(0, 0);
  }, [setTouchMoveInput]);

  const handleLookStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    lastTouchRef.current = { x: touch.clientX, y: touch.clientY };
    setLookActive(true);
  }, []);

  const handleLookMove = useCallback((e: React.TouchEvent) => {
    if (!lookActive) return;

    const touch = e.touches[0];
    const deltaX = touch.clientX - lastTouchRef.current.x;
    const deltaY = touch.clientY - lastTouchRef.current.y;

    // 灵敏度调整
    const sensitivity = 0.5;
    setTouchLookInput(deltaX * sensitivity, deltaY * sensitivity);

    lastTouchRef.current = { x: touch.clientX, y: touch.clientY };
  }, [lookActive, setTouchLookInput]);

  const handleLookEnd = useCallback(() => {
    setLookActive(false);
  }, []);

  const handleJump = useCallback(() => {
    triggerTouchJump();
  }, [triggerTouchJump]);

  const handleMine = useCallback(() => {
    triggerTouchMine();
  }, [triggerTouchMine]);

  const handlePlace = useCallback(() => {
    triggerTouchPlace();
  }, [triggerTouchPlace]);

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
    <>
      {/* 左下角 - 虚拟摇杆 */}
      <div
        style={{
          position: 'fixed',
          bottom: layout === 'landscape' ? 120 : 100,
          left: 20,
          zIndex: 100,
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
        style={{
          position: 'fixed',
          bottom: layout === 'landscape' ? 120 : 100,
          right: 20,
          zIndex: 100,
        }}
      >
        <ActionButtons
          onMine={handleMine}
          onPlace={handlePlace}
          onJump={handleJump}
          onInventory={handleOpenInventory}
          onPause={handlePause}
          layout={layout}
        />
      </div>

      {/* 右半屏幕 - 视角控制区域 */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '50%',
          height: '60%',
          zIndex: 50,
          touchAction: 'none',
        }}
        onTouchStart={handleLookStart}
        onTouchMove={handleLookMove}
        onTouchEnd={handleLookEnd}
        onTouchCancel={handleLookEnd}
      />

      {/* 底部快捷栏 */}
      <HotbarMobile
        inventory={inventory}
        selectedSlot={selectedSlot}
        onSlotChange={handleSlotChange}
      />

      {/* 移动端提示 */}
      <div
        style={{
          position: 'fixed',
          top: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          color: 'white',
          padding: '8px 16px',
          borderRadius: 8,
          fontSize: 14,
          zIndex: 100,
          textAlign: 'center',
        }}
      >
        📱 触摸控制模式
      </div>
    </>
  );
}
