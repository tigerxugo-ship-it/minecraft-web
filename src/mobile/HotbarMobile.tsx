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
      style={{
        position: 'fixed',
        bottom: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: 4,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: '8px 12px',
        borderRadius: 12,
        zIndex: 100,
      }}
    >
      {slots.map((item, index) => {
        const isSelected = index === selectedSlot;
        const icon = BLOCK_ICONS[item.type] || BLOCK_ICONS.default;
        
        return (
          <button
            key={index}
            onTouchStart={(e) => {
              e.preventDefault();
              onSlotChange(index);
            }}
            onClick={(e) => {
              e.preventDefault();
              onSlotChange(index);
            }}
            style={{
              width: 44,
              height: 44,
              borderRadius: 6,
              backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.15)',
              border: isSelected 
                ? '3px solid rgba(255, 255, 255, 0.8)' 
                : '2px solid rgba(255, 255, 255, 0.3)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
              cursor: 'pointer',
              touchAction: 'none',
              userSelect: 'none',
              position: 'relative',
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
                  fontSize: 10,
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
                color: 'rgba(255, 255, 255, 0.7)',
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
