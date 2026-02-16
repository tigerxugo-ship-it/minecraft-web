import { useState, useCallback } from 'react';

interface ActionButtonsProps {
  onMine: () => void;
  onPlace: () => void;
  onJump?: () => void;
  onInventory: () => void;
  onPause: () => void;
  layout?: 'portrait' | 'landscape';
}

export function ActionButtons({
  onMine,
  onPlace,
  onJump,
  onInventory,
  onPause,
  layout = 'portrait'
}: ActionButtonsProps) {
  const [mining, setMining] = useState(false);
  const buttonSize = layout === 'landscape' ? 60 : 50;
  const fontSize = layout === 'landscape' ? 24 : 20;

  // iOS 兼容的点击处理
  const handleMine = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setMining(true);
    onMine();
  }, [onMine]);

  const handleMineEnd = useCallback(() => {
    setMining(false);
  }, []);

  const handlePlace = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onPlace();
  }, [onPlace]);

  const handleInventory = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onInventory();
  }, [onInventory]);

  const handlePause = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onPause();
  }, [onPause]);

  const handleJump = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onJump?.();
  }, [onJump]);

  const buttonStyle = (isPressed: boolean = false): React.CSSProperties => ({
    width: buttonSize,
    height: buttonSize,
    borderRadius: '50%',
    backgroundColor: isPressed ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 255, 255, 0.35)',
    border: '3px solid rgba(255, 255, 255, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize,
    cursor: 'pointer',
    touchAction: 'none',
    userSelect: 'none',
    WebkitUserSelect: 'none',
    WebkitTouchCallout: 'none',
    margin: layout === 'landscape' ? 8 : 6,
    boxShadow: isPressed 
      ? '0 0 20px rgba(255, 255, 255, 0.6), inset 0 0 10px rgba(255, 255, 255, 0.3)' 
      : '0 4px 10px rgba(0, 0, 0, 0.3)',
    transition: 'all 0.05s ease',
    // iOS 特定优化
    WebkitTapHighlightColor: 'transparent',
  });

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: layout === 'landscape' ? 'column' : 'row',
        alignItems: 'center',
        gap: layout === 'landscape' ? 12 : 8,
        flexWrap: layout === 'portrait' ? 'wrap' : 'nowrap',
        justifyContent: 'center',
        maxWidth: layout === 'portrait' ? 280 : undefined,
      }}
    >
      {/* 挖掘按钮 */}
      <button
        onTouchStart={handleMine}
        onTouchEnd={handleMineEnd}
        onMouseDown={handleMine}
        onMouseUp={handleMineEnd}
        onMouseLeave={handleMineEnd}
        style={buttonStyle(mining)}
        aria-label="挖掘"
      >
        ⛏️
      </button>

      {/* 放置按钮 */}
      <button
        onTouchStart={handlePlace}
        onClick={handlePlace}
        style={buttonStyle()}
        aria-label="放置"
      >
        🧱
      </button>

      {/* 跳跃按钮 (可选) */}
      {onJump && (
        <button
          onTouchStart={handleJump}
          onClick={handleJump}
          style={buttonStyle()}
          aria-label="跳跃"
        >
          ⬆️
        </button>
      )}

      {/* 背包按钮 */}
      <button
        onTouchStart={handleInventory}
        onClick={handleInventory}
        style={buttonStyle()}
        aria-label="背包"
      >
        📦
      </button>

      {/* 暂停按钮 */}
      <button
        onTouchStart={handlePause}
        onClick={handlePause}
        style={buttonStyle()}
        aria-label="暂停"
      >
        ⏸️
      </button>
    </div>
  );
}
