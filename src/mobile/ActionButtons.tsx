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

  const handleMineStart = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setMining(true);
    onMine();
    
    // 持续挖掘
    const interval = setInterval(() => {
      onMine();
    }, 200);
    
    const handleEnd = () => {
      setMining(false);
      clearInterval(interval);
    };
    
    const cleanup = () => {
      handleEnd();
      document.removeEventListener('touchend', cleanup);
      document.removeEventListener('mouseup', cleanup);
    };
    
    document.addEventListener('touchend', cleanup);
    document.addEventListener('mouseup', cleanup);
  }, [onMine]);

  const buttonStyle = (isPressed: boolean = false): React.CSSProperties => ({
    width: buttonSize,
    height: buttonSize,
    borderRadius: '50%',
    backgroundColor: isPressed ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.3)',
    border: '2px solid rgba(255, 255, 255, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize,
    cursor: 'pointer',
    touchAction: 'none',
    userSelect: 'none',
    WebkitUserSelect: 'none',
    margin: layout === 'landscape' ? 8 : 6,
    boxShadow: isPressed ? '0 0 15px rgba(255, 255, 255, 0.4)' : 'none',
    transition: 'all 0.1s ease',
  });

  const MineButton = (
    <button
      onTouchStart={handleMineStart}
      onMouseDown={handleMineStart}
      style={buttonStyle(mining)}
      aria-label="挖掘"
    >
      ⛏️
    </button>
  );

  const PlaceButton = (
    <button
      onTouchStart={(e) => {
        e.preventDefault();
        onPlace();
      }}
      onMouseDown={(e) => {
        e.preventDefault();
        onPlace();
      }}
      style={buttonStyle()}
      aria-label="放置"
    >
      🧱
    </button>
  );

  const JumpButton = onJump ? (
    <button
      onTouchStart={(e) => {
        e.preventDefault();
        onJump();
      }}
      onMouseDown={(e) => {
        e.preventDefault();
        onJump();
      }}
      style={buttonStyle()}
      aria-label="跳跃"
    >
      ⬆️
    </button>
  ) : null;

  const InventoryButton = (
    <button
      onTouchStart={(e) => {
        e.preventDefault();
        onInventory();
      }}
      onMouseDown={(e) => {
        e.preventDefault();
        onInventory();
      }}
      style={buttonStyle()}
      aria-label="背包"
    >
      📦
    </button>
  );

  const PauseButton = (
    <button
      onTouchStart={(e) => {
        e.preventDefault();
        onPause();
      }}
      onMouseDown={(e) => {
        e.preventDefault();
        onPause();
      }}
      style={buttonStyle()}
      aria-label="暂停"
    >
      ⏸️
    </button>
  );

  if (layout === 'landscape') {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 12,
        }}
      >
        {/* 上排 */}
        <div style={{ display: 'flex', gap: 12 }}>
          {MineButton}
          {PlaceButton}
        </div>
        {/* 中排 - 跳跃 */}
        {JumpButton && <div style={{ display: 'flex', gap: 12 }}>{JumpButton}</div>}
        {/* 下排 */}
        <div style={{ display: 'flex', gap: 12 }}>
          {InventoryButton}
          {PauseButton}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        flexWrap: 'wrap',
        justifyContent: 'center',
        maxWidth: 200,
      }}
    >
      {MineButton}
      {PlaceButton}
      {JumpButton}
      {InventoryButton}
      {PauseButton}
    </div>
  );
}
