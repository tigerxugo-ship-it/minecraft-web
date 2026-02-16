import { useGameStore, InventoryItem } from '../engine/gameStore'
import { BLOCK_PROPERTIES } from '../blocks/Block'
import { getDurabilityPercent, Tool } from '../tools/ToolSystem'

function ToolIcon({ tool }: { tool: Tool }) {
  const durabilityPercent = getDurabilityPercent(tool)
  
  // 根据工具类型显示不同图标
  const getToolIcon = () => {
    switch (tool.type) {
      case 'pickaxe':
        return '⛏️'
      case 'sword':
        return '⚔️'
      case 'axe':
        return '🪓'
      case 'shovel':
        return '🥄'
      default:
        return '🔧'
    }
  }
  
  return (
    <div className="tool-icon" style={{ position: 'relative', width: '100%', height: '100%' }}>
      <span style={{ 
        fontSize: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%'
      }}>
        {getToolIcon()}
      </span>
      {/* 耐久度条 */}
      <div style={{
        position: 'absolute',
        bottom: '2px',
        left: '2px',
        right: '2px',
        height: '3px',
        backgroundColor: '#333',
        borderRadius: '1px'
      }}>
        <div style={{
          width: `${durabilityPercent}%`,
          height: '100%',
          backgroundColor: durabilityPercent > 30 ? '#0F0' : '#F00',
          borderRadius: '1px',
          transition: 'width 0.2s'
        }} />
      </div>
    </div>
  )
}

function BlockIcon({ type, count }: { type: string; count: number }) {
  const color = BLOCK_PROPERTIES[type as keyof typeof BLOCK_PROPERTIES]?.color || '#888'
  
  return (
    <>
      <div
        className="block-preview"
        style={{ 
          backgroundColor: color,
          width: '32px',
          height: '32px',
          border: '2px solid rgba(0,0,0,0.3)',
          borderRadius: '4px'
        }}
      />
      <span className="item-count" style={{
        position: 'absolute',
        bottom: '2px',
        right: '2px',
        fontSize: '12px',
        fontWeight: 'bold',
        color: 'white',
        textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
      }}>
        {count}
      </span>
    </>
  )
}

function SlotItem({ item, isActive, onClick, slotNumber }: { 
  item: InventoryItem; 
  isActive: boolean; 
  onClick: () => void;
  slotNumber: number;
}) {
  const isEmpty = item.count === 0
  const isTool = item.type === 'tool'
  
  return (
    <div
      className={`hotbar-slot ${isActive ? 'active' : ''}`}
      onClick={onClick}
      style={{
        width: '50px',
        height: '50px',
        backgroundColor: isActive ? '#88CCFF' : 'rgba(0, 0, 0, 0.5)',
        border: isActive ? '3px solid #FFF' : '2px solid #666',
        borderRadius: '6px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        position: 'relative',
        transition: 'all 0.1s'
      }}
    >
      {!isEmpty && (
        <>
          {isTool && item.tool ? (
            <ToolIcon tool={item.tool} />
          ) : (
            <BlockIcon type={item.type} count={item.count} />
          )}
        </>
      )}
      <span style={{
        position: 'absolute',
        top: '2px',
        left: '4px',
        fontSize: '10px',
        color: 'rgba(255,255,255,0.7)',
        fontWeight: 'bold'
      }}>
        {slotNumber}
      </span>
    </div>
  )
}

export function Hotbar() {
  const { inventory, selectedSlot, setSelectedSlot } = useGameStore()
  const hotbarItems = inventory.slice(0, 9)

  return (
    <div className="hotbar" style={{
      position: 'fixed',
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      gap: '8px',
      padding: '10px',
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      borderRadius: '12px',
      zIndex: 100
    }}>
      {hotbarItems.map((item, index) => (
        <SlotItem
          key={index}
          item={item}
          isActive={selectedSlot === index}
          onClick={() => setSelectedSlot(index)}
          slotNumber={index + 1}
        />
      ))}
    </div>
  )
}

export default Hotbar
