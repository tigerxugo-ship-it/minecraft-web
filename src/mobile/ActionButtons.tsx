import { useState } from 'react';

interface ActionButtonsProps {
  onMineStart: () => void;
  onMineEnd: () => void;
  onPlaceStart: () => void;
  onPlaceEnd: () => void;
  onJump: () => void;
  onInventory: () => void;
  onPause: () => void;
  layout?: 'portrait' | 'landscape';
}

export function ActionButtons({
  onMineStart,
  onMineEnd,
  onPlaceStart,
  onPlaceEnd,
  onJump,
  onInventory,
  onPause,
  layout = 'portrait'
}: ActionButtonsProps) {
  const [mining, setMining] = useState(false);
  const [placing, setPlacing] = useState(false);
  const buttonSize = layout === 'landscape' ? 60 : 50;
  const fontSize = layout === 'landscape' ? 24 : 20;

  const buttonStyle = (isPressed: boolean = false): React.CSSProperties => ({
    width: buttonSize,
    height: buttonSize,
    borderRadius: '50%',
    backgroundColor: isPressed ? 'rgba(255, 255, 255, 0.7)' : 'rgba(255, 255, 255, 0.4)',
    border: '3px solid rgba(255, 255, 255, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize,
    cursor: 'pointer',
    touchAction: 'none',
    userSelect: 'none',
    WebkitUserSelect: 'none',
    WebkitTouchCallout: 'none',
    WebkitTapHighlightColor: 'transparent',
    margin: layout === 'landscape' ? 8 : 6,
    boxShadow: isPressed 
      ? '0 0 20px rgba(255, 255, 255, 0.8)' 
      : '0 4px 10px rgba(0, 0, 0, 0.3)',
    transition: 'all 0.05s ease',
  });

  const handleMineTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setMining(true);
    onMineStart();
  };

  const handleMineTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setMining(false);
    onMineEnd();
  };

  const handlePlaceTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setPlacing(true);
    onPlaceStart();
  };

  const handlePlaceTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setPlacing(false);
    onPlaceEnd();
  };

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
        onTouchStart={handleMineTouchStart}
        onTouchEnd={handleMineTouchEnd}
        onMouseDown={() => { setMining(true); onMineStart(); }}
        onMouseUp={() => { setMining(false); onMineEnd(); }}
        onMouseLeave={() => { setMining(false); onMineEnd(); }}
        style={buttonStyle(mining)}
        aria-label="挖掘"
      >
        ⛏️
      </button>

      {/* 放置按钮 */}
      <button
        onTouchStart={handlePlaceTouchStart}
        onTouchEnd={handlePlaceTouchEnd}
        onMouseDown={() => { setPlacing(true); onPlaceStart(); }}
        onMouseUp={() => { setPlacing(false); onPlaceEnd(); }}
        onMouseLeave={() => { setPlacing(false); onPlaceEnd(); }}
        style={buttonStyle(placing)}
        aria-label="放置"
      >
        🧱
      </button>

      {/* 跳跃按钮 */}
      <button
        onTouchStart={(e) => { e.preventDefault(); onJump(); }}
        onClick={onJump}
        style={buttonStyle()}
        aria-label="跳跃"
      >
        ⬆️
      </button>

      {/* 背包按钮 */}
      <button
        onTouchStart={(e) => { e.preventDefault(); onInventory(); }}
        onClick={onInventory}
        style={buttonStyle()}
        aria-label="背包"
      >
        📦
      </button>

      {/* 暂停按钮 */}
      <button
        onTouchStart={(e) => { e.preventDefault(); onPause(); }}
        onClick={onPause}
        style={buttonStyle()}
        aria-label="暂停"
      >
        ⏸️
      </button>
    </div>
  );
}
