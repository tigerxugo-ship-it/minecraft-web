import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Mob, getMobConfig } from './MobAI'
import { HostileMob, getHostileMobConfig } from './HostileMobAI'

interface MobRendererProps {
  mobs: Mob[]
  hostileMobs?: HostileMob[]
  onMobClick?: (mob: Mob) => void
  onHostileMobClick?: (mob: HostileMob) => void
}

// 单个动物组件
function SingleMob({ mob, onClick }: { mob: Mob; onClick?: () => void }) {
  const groupRef = useRef<THREE.Group>(null)
  const config = getMobConfig(mob.type)
  
  // 身体颜色 (羊可以是不同颜色)
  const bodyColor = useMemo(() => {
    if (mob.type === 'sheep') {
      const colors = ['#F5F5DC', '#FFFFFF', '#E0E0E0', '#D3D3D3']
      const index = mob.id.charCodeAt(0) % colors.length
      return colors[index]
    }
    return config.color
  }, [mob.type, mob.id, config.color])
  
  useFrame(() => {
    if (!groupRef.current) return
    
    groupRef.current.position.copy(mob.position)
    groupRef.current.rotation.y = mob.rotation
    
    // 行走动画
    if (mob.state === 'wander' || mob.state === 'flee') {
      const walkCycle = mob.animationTime * 8
      groupRef.current.position.y = mob.position.y + Math.abs(Math.sin(walkCycle)) * 0.1
      
      const legs = groupRef.current.children.filter(child => child.name.includes('leg'))
      legs.forEach((leg, index) => {
        leg.rotation.x = Math.sin(walkCycle + index * Math.PI) * 0.3
      })
    }
  })
  
  const renderMobGeometry = () => {
    switch (mob.type) {
      case 'pig':
        return (
          <>
            <mesh position={[0, 0.45, 0]} castShadow>
              <boxGeometry args={[0.9, 0.6, 1.3]} />
              <meshStandardMaterial color={bodyColor} />
            </mesh>
            <mesh position={[0, 0.6, 0.7]} castShadow>
              <boxGeometry args={[0.6, 0.5, 0.5]} />
              <meshStandardMaterial color={bodyColor} />
            </mesh>
            <mesh position={[0, 0.55, 1.0]} castShadow>
              <boxGeometry args={[0.3, 0.2, 0.1]} />
              <meshStandardMaterial color='#FF69B4' />
            </mesh>
            <mesh name='leg_0' position={[-0.25, 0.15, 0.4]} castShadow>
              <boxGeometry args={[0.2, 0.3, 0.2]} />
              <meshStandardMaterial color={bodyColor} />
            </mesh>
            <mesh name='leg_1' position={[0.25, 0.15, 0.4]} castShadow>
              <boxGeometry args={[0.2, 0.3, 0.2]} />
              <meshStandardMaterial color={bodyColor} />
            </mesh>
            <mesh name='leg_2' position={[-0.25, 0.15, -0.4]} castShadow>
              <boxGeometry args={[0.2, 0.3, 0.2]} />
              <meshStandardMaterial color={bodyColor} />
            </mesh>
            <mesh name='leg_3' position={[0.25, 0.15, -0.4]} castShadow>
              <boxGeometry args={[0.2, 0.3, 0.2]} />
              <meshStandardMaterial color={bodyColor} />
            </mesh>
          </>
        )
        
      case 'cow':
        return (
          <>
            <mesh position={[0, 0.7, 0]} castShadow>
              <boxGeometry args={[1.4, 0.9, 2.0]} />
              <meshStandardMaterial color={bodyColor} />
            </mesh>
            <mesh position={[0, 1.0, 1.2]} castShadow>
              <boxGeometry args={[0.7, 0.7, 0.6]} />
              <meshStandardMaterial color={bodyColor} />
            </mesh>
            <mesh position={[-0.4, 1.3, 1.2]} castShadow>
              <boxGeometry args={[0.1, 0.3, 0.1]} />
              <meshStandardMaterial color='#D2B48C' />
            </mesh>
            <mesh position={[0.4, 1.3, 1.2]} castShadow>
              <boxGeometry args={[0.1, 0.3, 0.1]} />
              <meshStandardMaterial color='#D2B48C' />
            </mesh>
            <mesh name='leg_0' position={[-0.5, 0.2, 0.7]} castShadow>
              <boxGeometry args={[0.25, 0.4, 0.25]} />
              <meshStandardMaterial color={bodyColor} />
            </mesh>
            <mesh name='leg_1' position={[0.5, 0.2, 0.7]} castShadow>
              <boxGeometry args={[0.25, 0.4, 0.25]} />
              <meshStandardMaterial color={bodyColor} />
            </mesh>
            <mesh name='leg_2' position={[-0.5, 0.2, -0.7]} castShadow>
              <boxGeometry args={[0.25, 0.4, 0.25]} />
              <meshStandardMaterial color={bodyColor} />
            </mesh>
            <mesh name='leg_3' position={[0.5, 0.2, -0.7]} castShadow>
              <boxGeometry args={[0.25, 0.4, 0.25]} />
              <meshStandardMaterial color={bodyColor} />
            </mesh>
          </>
        )
        
      case 'sheep':
        return (
          <>
            <mesh position={[0, 0.65, 0]} castShadow>
              <boxGeometry args={[1.0, 0.7, 1.5]} />
              <meshStandardMaterial color={bodyColor} />
            </mesh>
            <mesh position={[0, 0.9, 0.9]} castShadow>
              <boxGeometry args={[0.6, 0.6, 0.5]} />
              <meshStandardMaterial color='#333333' />
            </mesh>
            <mesh name='leg_0' position={[-0.3, 0.15, 0.5]} castShadow>
              <boxGeometry args={[0.18, 0.3, 0.18]} />
              <meshStandardMaterial color='#333333' />
            </mesh>
            <mesh name='leg_1' position={[0.3, 0.15, 0.5]} castShadow>
              <boxGeometry args={[0.18, 0.3, 0.18]} />
              <meshStandardMaterial color='#333333' />
            </mesh>
            <mesh name='leg_2' position={[-0.3, 0.15, -0.5]} castShadow>
              <boxGeometry args={[0.18, 0.3, 0.18]} />
              <meshStandardMaterial color='#333333' />
            </mesh>
            <mesh name='leg_3' position={[0.3, 0.15, -0.5]} castShadow>
              <boxGeometry args={[0.18, 0.3, 0.18]} />
              <meshStandardMaterial color='#333333' />
            </mesh>
          </>
        )
        
      default:
        return null
    }
  }
  
  return (
    <group 
      ref={groupRef}
      onClick={(e) => {
        e.stopPropagation()
        onClick?.()
      }}
    >
      {renderMobGeometry()}
      {mob.health < mob.maxHealth && (
        <mesh position={[0, config.size.height + 0.3, 0]}>
          <planeGeometry args={[1, 0.1]} />
          <meshBasicMaterial color='#FF0000' />
          <mesh position={[-(1 - mob.health / mob.maxHealth) / 2, 0, 0.01]}>
            <planeGeometry args={[mob.health / mob.maxHealth, 0.08]} />
            <meshBasicMaterial color='#00FF00' />
          </mesh>
        </mesh>
      )}
    </group>
  )
}

// 单个敌对生物组件
function SingleHostileMob({ mob, onClick }: { mob: HostileMob; onClick?: () => void }) {
  const groupRef = useRef<THREE.Group>(null)
  const config = getHostileMobConfig(mob.type)
  
  useFrame(() => {
    if (!groupRef.current) return
    
    groupRef.current.position.copy(mob.position)
    groupRef.current.rotation.y = mob.rotation
    
    // 行走动画
    if (mob.state === 'chase') {
      const walkCycle = mob.animationTime * 10
      groupRef.current.position.y = mob.position.y + Math.abs(Math.sin(walkCycle)) * 0.05
      
      const legs = groupRef.current.children.filter(child => child.name.includes('leg'))
      legs.forEach((leg, index) => {
        leg.rotation.x = Math.sin(walkCycle + index * Math.PI) * 0.4
      })
    }
    
    // 苦力怕充能效果（膨胀）
    if (mob.type === 'creeper' && mob.isCharged) {
      const scale = 1 + (mob.chargeTime / 1.5) * 0.3
      groupRef.current.scale.setScalar(scale)
    } else {
      groupRef.current.scale.setScalar(1)
    }
  })
  
  const renderHostileMobGeometry = () => {
    switch (mob.type) {
      case 'zombie':
        return (
          <>
            <mesh position={[0, 0.975, 0]} castShadow>
              <boxGeometry args={[0.6, 1.95, 0.6]} />
              <meshStandardMaterial color={config.color} />
            </mesh>
            <mesh position={[0, 1.8, 0.35]} castShadow>
              <boxGeometry args={[0.5, 0.5, 0.5]} />
              <meshStandardMaterial color={config.color} />
            </mesh>
            <mesh name='leg_0' position={[-0.15, 0.4875, 0]} castShadow>
              <boxGeometry args={[0.2, 0.975, 0.2]} />
              <meshStandardMaterial color={config.color} />
            </mesh>
            <mesh name='leg_1' position={[0.15, 0.4875, 0]} castShadow>
              <boxGeometry args={[0.2, 0.975, 0.2]} />
              <meshStandardMaterial color={config.color} />
            </mesh>
            <mesh position={[-0.35, 1.3, 0]} castShadow>
              <boxGeometry args={[0.2, 0.6, 0.2]} />
              <meshStandardMaterial color={config.color} />
            </mesh>
            <mesh position={[0.35, 1.3, 0]} castShadow>
              <boxGeometry args={[0.2, 0.6, 0.2]} />
              <meshStandardMaterial color={config.color} />
            </mesh>
          </>
        )
        
      case 'skeleton':
        return (
          <>
            <mesh position={[0, 0.995, 0]} castShadow>
              <boxGeometry args={[0.5, 1.99, 0.3]} />
              <meshStandardMaterial color={config.color} />
            </mesh>
            <mesh position={[0, 1.9, 0.25]} castShadow>
              <boxGeometry args={[0.4, 0.4, 0.4]} />
              <meshStandardMaterial color={config.color} />
            </mesh>
            <mesh name='leg_0' position={[-0.12, 0.4975, 0]} castShadow>
              <boxGeometry args={[0.12, 0.995, 0.12]} />
              <meshStandardMaterial color={config.color} />
            </mesh>
            <mesh name='leg_1' position={[0.12, 0.4975, 0]} castShadow>
              <boxGeometry args={[0.12, 0.995, 0.12]} />
              <meshStandardMaterial color={config.color} />
            </mesh>
            <mesh position={[-0.3, 1.4, 0.2]} castShadow>
              <boxGeometry args={[0.1, 0.5, 0.1]} />
              <meshStandardMaterial color={config.color} />
            </mesh>
            <mesh position={[0.3, 1.4, 0.2]} castShadow>
              <boxGeometry args={[0.1, 0.5, 0.1]} />
              <meshStandardMaterial color={config.color} />
            </mesh>
          </>
        )
        
      case 'creeper':
        return (
          <>
            <mesh position={[0, 0.85, 0]} castShadow>
              <boxGeometry args={[0.6, 1.7, 0.6]} />
              <meshStandardMaterial color={mob.isCharged ? '#FF0000' : config.color} />
            </mesh>
            <mesh position={[0, 1.55, 0.35]} castShadow>
              <boxGeometry args={[0.4, 0.4, 0.5]} />
              <meshStandardMaterial color={mob.isCharged ? '#FF4444' : config.color} />
            </mesh>
            <mesh name='leg_0' position={[-0.15, 0.2125, 0.15]} castShadow>
              <boxGeometry args={[0.15, 0.425, 0.15]} />
              <meshStandardMaterial color={config.color} />
            </mesh>
            <mesh name='leg_1' position={[0.15, 0.2125, 0.15]} castShadow>
              <boxGeometry args={[0.15, 0.425, 0.15]} />
              <meshStandardMaterial color={config.color} />
            </mesh>
            <mesh name='leg_2' position={[-0.15, 0.2125, -0.15]} castShadow>
              <boxGeometry args={[0.15, 0.425, 0.15]} />
              <meshStandardMaterial color={config.color} />
            </mesh>
            <mesh name='leg_3' position={[0.15, 0.2125, -0.15]} castShadow>
              <boxGeometry args={[0.15, 0.425, 0.15]} />
              <meshStandardMaterial color={config.color} />
            </mesh>
          </>
        )
        
      case 'spider':
        return (
          <>
            <mesh position={[0, 0.45, 0]} castShadow>
              <boxGeometry args={[1.4, 0.9, 1.4]} />
              <meshStandardMaterial color={config.color} />
            </mesh>
            <mesh name='leg_0' position={[-0.8, 0.2, 0.8]} castShadow>
              <boxGeometry args={[0.15, 0.4, 0.15]} />
              <meshStandardMaterial color={config.color} />
            </mesh>
            <mesh name='leg_1' position={[0.8, 0.2, 0.8]} castShadow>
              <boxGeometry args={[0.15, 0.4, 0.15]} />
              <meshStandardMaterial color={config.color} />
            </mesh>
            <mesh name='leg_2' position={[-0.8, 0.2, -0.8]} castShadow>
              <boxGeometry args={[0.15, 0.4, 0.15]} />
              <meshStandardMaterial color={config.color} />
            </mesh>
            <mesh name='leg_3' position={[0.8, 0.2, -0.8]} castShadow>
              <boxGeometry args={[0.15, 0.4, 0.15]} />
              <meshStandardMaterial color={config.color} />
            </mesh>
            <mesh position={[-0.6, 0.3, 0.6]} castShadow rotation={[0, 0, 0.5]}>
              <boxGeometry args={[0.12, 0.6, 0.12]} />
              <meshStandardMaterial color={config.color} />
            </mesh>
            <mesh position={[0.6, 0.3, 0.6]} castShadow rotation={[0, 0, -0.5]}>
              <boxGeometry args={[0.12, 0.6, 0.12]} />
              <meshStandardMaterial color={config.color} />
            </mesh>
            <mesh position={[-0.6, 0.3, -0.6]} castShadow rotation={[0, 0, 0.5]}>
              <boxGeometry args={[0.12, 0.6, 0.12]} />
              <meshStandardMaterial color={config.color} />
            </mesh>
            <mesh position={[0.6, 0.3, -0.6]} castShadow rotation={[0, 0, -0.5]}>
              <boxGeometry args={[0.12, 0.6, 0.12]} />
              <meshStandardMaterial color={config.color} />
            </mesh>
          </>
        )
        
      default:
        return null
    }
  }
  
  return (
    <group 
      ref={groupRef}
      onClick={(e) => {
        e.stopPropagation()
        onClick?.()
      }}
    >
      {renderHostileMobGeometry()}
      
      {/* 血条 */}
      <mesh position={[0, config.size.height + 0.3, 0]}>
        <planeGeometry args={[1, 0.1]} />
        <meshBasicMaterial color='#FF0000' />
        <mesh position={[-(1 - mob.health / mob.maxHealth) / 2, 0, 0.01]}>
          <planeGeometry args={[mob.health / mob.maxHealth, 0.08]} />
          <meshBasicMaterial color='#00FF00' />
        </mesh>
      </mesh>
      
      {/* 状态指示器 */}
      {mob.isBurning && (
        <mesh position={[0, config.size.height + 0.5, 0]}>
          <planeGeometry args={[0.3, 0.3]} />
          <meshBasicMaterial color='#FF5722' />
        </mesh>
      )}
      
      {mob.isCharged && (
        <mesh position={[0, config.size.height + 0.5, 0]}>
          <planeGeometry args={[0.3, 0.3]} />
          <meshBasicMaterial color='#FFFF00' transparent opacity={0.8} />
        </mesh>
      )}
    </group>
  )
}

// 生物渲染组件
export function MobRenderer({ mobs, hostileMobs = [], onMobClick, onHostileMobClick }: MobRendererProps) {
  return (
    <>
      {mobs.map((mob) => (
        <SingleMob 
          key={mob.id} 
          mob={mob} 
          onClick={() => onMobClick?.(mob)}
        />
      ))}
      {hostileMobs.map((mob) => (
        <SingleHostileMob 
          key={mob.id} 
          mob={mob} 
          onClick={() => onHostileMobClick?.(mob)}
        />
      ))}
    </>
  )
}

export default MobRenderer
