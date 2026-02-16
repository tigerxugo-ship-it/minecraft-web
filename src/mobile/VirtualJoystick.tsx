import { useState, useRef, useCallback, useEffect } from 'react';

interface VirtualJoystickProps {
  onChange: (x: number, y: number) => void;
  onEnd: () => void;
  size?: number;
  maxDistance?: number;
}

export function VirtualJoystick({ 
  onChange, 
  onEnd, 
  size = 150, 
  maxDistance = 50 
}: VirtualJoystickProps) {
  const [active, setActive] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const touchIdRef = useRef<number | null>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const touch = e.touches[0];
    if (!touch) return;
    
    touchIdRef.current = touch.identifier;
    setActive(true);
    
    const container = containerRef.current;
    if (container) {
      const rect = container.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const deltaX = touch.clientX - centerX;
      const deltaY = touch.clientY - centerY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      
      const clampedDistance = Math.min(distance, maxDistance);
      const angle = Math.atan2(deltaY, deltaX);
      
      const x = Math.cos(angle) * clampedDistance;
      const y = Math.sin(angle) * clampedDistance;
      
      setPosition({ x, y });
      onChange(x / maxDistance, -y / maxDistance);
    }
  }, [maxDistance, onChange]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    if (!active || touchIdRef.current === null) return;
    
    const touch = Array.from(e.touches).find(t => t.identifier === touchIdRef.current);
    if (!touch) return;
    
    const container = containerRef.current;
    if (container) {
      const rect = container.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const deltaX = touch.clientX - centerX;
      const deltaY = touch.clientY - centerY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      
      const clampedDistance = Math.min(distance, maxDistance);
      const angle = Math.atan2(deltaY, deltaX);
      
      const x = Math.cos(angle) * clampedDistance;
      const y = Math.sin(angle) * clampedDistance;
      
      setPosition({ x, y });
      onChange(x / maxDistance, -y / maxDistance);
    }
  }, [active, maxDistance, onChange]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    const touch = Array.from(e.changedTouches).find(t => t.identifier === touchIdRef.current);
    if (touch) {
      touchIdRef.current = null;
      setActive(false);
      setPosition({ x: 0, y: 0 });
      onEnd();
    }
  }, [onEnd]);

  useEffect(() => {
    return () => {
      if (active) {
        onEnd();
      }
    };
  }, [active, onEnd]);

  return (
    <div
      ref={containerRef}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        border: '3px solid rgba(255, 255, 255, 0.5)',
        position: 'relative',
        touchAction: 'none',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        WebkitTouchCallout: 'none',
        WebkitTapHighlightColor: 'transparent',
        cursor: 'pointer',
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      {/* 中心点 */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: 10,
          height: 10,
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 255, 255, 0.6)',
          transform: 'translate(-50%, -50%)',
        }}
      />
      {/* 摇杆 */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: size * 0.4,
          height: size * 0.4,
          borderRadius: '50%',
          backgroundColor: active ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.5)',
          border: '3px solid rgba(255, 255, 255, 0.8)',
          transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`,
          transition: active ? 'none' : 'transform 0.1s ease-out',
          boxShadow: active 
            ? '0 0 20px rgba(255, 255, 255, 0.8)' 
            : '0 4px 10px rgba(0, 0, 0, 0.3)',
        }}
      />
    </div>
  );
}
