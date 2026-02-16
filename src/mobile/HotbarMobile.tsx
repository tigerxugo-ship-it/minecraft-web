import type { InventoryItem } from '../engine/gameStore';

interface HotbarMobileProps {
  inventory: InventoryItem[];
  selectedSlot: number;
  onSlotChange: (slot: number) => void;
}

const BLOCK_ICONS: Record<string, string> = {
  grass: '🟩',
  dirt: '🟫',
  stone: '⬜',
  wood: '🪵',
  sand: '🟨',
  planks: '📦',
  crafting_table: '🔧',
  furnace: '🔥',
  coal_ore: '⬛',
  iron_ore: '⚙️',
  gold_ore: '👑',
  diamond_ore: '💎',
  default: '⬜',
};

export function HotbarMobile({ inventory, selectedSlot, onSlotChange }: HotbarMobileProps) {
  const slots = inventory.slice(0, 9);

  return (
    <div
      data-touch-control
      style={{
        position: 'fixed',
        bottom: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: 6,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        padding: '10px 14px',
        borderRadius: 14,
        zIndex: 1000,
        pointerEvents: 'auto',
      }}
    >
      {slots.map((item, index) => {
        const isSelected = index === selectedSlot;
        const icon = BLOCK_ICONS[item.type] || BLOCK_ICONS.default;
        
        const handleSelect = (e: React.TouchEvent | React.MouseEvent) => {
          e.preventDefault();
          e.stopPropagation();
          onSlotChange(index);
        };
        
        return (
          <button
            key={index}
            onTouchStart={handleSelect}
            onClick={handleSelect}
            style={{
              width: 48,
              height: 48,
              borderRadius: 8,
              backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.2)',
              border: isSelected 
                ? '3px solid rgba(255, 255, 255, 0.9)' 
                : '2px solid rgba(255, 255, 255, 0.4)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 22,
              cursor: 'pointer',
              touchAction: 'none',
              userSelect: 'none',
              WebkitUserSelect: 'none',
              WebkitTouchCallout: 'none',
              WebkitTapHighlightColor: 'transparent',
              position: 'relative',
              boxShadow: isSelected 
                ? '0 0 15px rgba(255, 255, 255, 0.5)' 
                : '0 2px 5px rgba(0, 0, 0, 0.3)',
              transition: 'all 0.05s ease',
            }}
            aria-label={`槽位 ${index + 1}`}
          >
            <span>{icon}</span>
            {item.count > 1 && (
              <span
                style={{
                  position: 'absolute',
                  bottom: 2,
                  right: 4,
                  fontSize: 11,
                  color: 'white',
                  fontWeight: 'bold',
                  textShadow: '1px 1px 2px black',
                }}
              >
                {item.count}
              </span>
            )}
            <span
              style={{
                position: 'absolute',
                top: 2,
                left: 4,
                fontSize: 10,
                color: 'rgba(255, 255, 255, 0.8)',
                fontWeight: 'bold',
              }}
            >
              {index + 1}
            </span>
          </button>
        );
      })}
    </div>
  );
}
