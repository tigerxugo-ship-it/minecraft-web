import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// 昼夜循环配置
const DAY_DURATION = 600 // 10分钟 = 600秒
const DAY_NIGHT_CYCLE = DAY_DURATION * 1000 // 毫秒

// 天空颜色配置
const SKY_COLORS = {
  day: new THREE.Color(0x87CEEB),      // 天蓝色
  sunset: new THREE.Color(0xFF6B35),   // 橙红色
  night: new THREE.Color(0x0A0A1A),    // 深蓝黑色
  sunrise: new THREE.Color(0xFFB347),  // 金黄色
}

interface DayNightCycleProps {
  onTimeChange?: (time: number, isDay: boolean, lightIntensity: number) => void
}

export function DayNightCycle({ onTimeChange }: DayNightCycleProps) {
  const sunRef = useRef<THREE.DirectionalLight>(null)
  const moonRef = useRef<THREE.DirectionalLight>(null)
  const ambientRef = useRef<THREE.AmbientLight>(null)
  const starsRef = useRef<THREE.Points>(null)
  
  // 创建星星粒子系统
  const starsGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry()
    const count = 1800 // 1500-2000颗星星
    const positions = new Float32Array(count * 3)
    const sizes = new Float32Array(count)
    
    for (let i = 0; i < count; i++) {
      // 在球面上随机分布
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const radius = 80 + Math.random() * 20 // 天空穹顶半径
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = Math.abs(radius * Math.sin(phi) * Math.sin(theta)) // 只在上半球
      positions[i * 3 + 2] = radius * Math.cos(phi)
      
      sizes[i] = Math.random() * 2 + 0.5
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
    return geometry
  }, [])
  
  // 星星材质
  const starsMaterial = useMemo(() => {
    return new THREE.PointsMaterial({
      color: 0xFFFFFF,
      size: 0.5,
      transparent: true,
      opacity: 0,
      sizeAttenuation: true,
    })
  }, [])

  useFrame(({ scene }) => {
    // 计算当前时间 (0-1, 0=正午, 0.5=午夜)
    const elapsed = (Date.now() % DAY_NIGHT_CYCLE) / DAY_NIGHT_CYCLE
    const cycle = elapsed * Math.PI * 2 // 0 to 2PI
    
    // 太阳位置 (弧形轨迹)
    const sunX = Math.cos(cycle - Math.PI / 2) * 100
    const sunY = Math.sin(cycle - Math.PI / 2) * 80 + 20
    const sunZ = 30
    
    // 月亮位置 (与太阳相对)
    const moonX = Math.cos(cycle + Math.PI / 2) * 100
    const moonY = Math.sin(cycle + Math.PI / 2) * 80 + 20
    const moonZ = 30
    
    // 更新太阳位置
    if (sunRef.current) {
      sunRef.current.position.set(sunX, sunY, sunZ)
      sunRef.current.intensity = Math.max(0, Math.sin(cycle - Math.PI / 2) * 1.5)
    }
    
    // 更新月亮位置
    if (moonRef.current) {
      moonRef.current.position.set(moonX, moonY, moonZ)
      moonRef.current.intensity = Math.max(0, -Math.sin(cycle - Math.PI / 2) * 0.5)
    }
    
    // 计算天空颜色
    let skyColor: THREE.Color
    const normalizedTime = (elapsed + 0.25) % 1 // 调整为6:00是白天开始
    
    if (normalizedTime < 0.2) {
      // 日出 (5:00-7:00)
      skyColor = SKY_COLORS.night.clone().lerp(SKY_COLORS.sunrise, normalizedTime / 0.2)
    } else if (normalizedTime < 0.3) {
      // 日出过渡到白天 (7:00-9:00)
      skyColor = SKY_COLORS.sunrise.clone().lerp(SKY_COLORS.day, (normalizedTime - 0.2) / 0.1)
    } else if (normalizedTime < 0.7) {
      // 白天 (9:00-17:00)
      skyColor = SKY_COLORS.day
    } else if (normalizedTime < 0.8) {
      // 日落开始 (17:00-19:00)
      skyColor = SKY_COLORS.day.clone().lerp(SKY_COLORS.sunset, (normalizedTime - 0.7) / 0.1)
    } else if (normalizedTime < 0.9) {
      // 日落到夜晚 (19:00-21:00)
      skyColor = SKY_COLORS.sunset.clone().lerp(SKY_COLORS.night, (normalizedTime - 0.8) / 0.1)
    } else {
      // 夜晚 (21:00-5:00)
      skyColor = SKY_COLORS.night
    }
    
    // 应用天空颜色到场景背景
    scene.background = skyColor
    
    // 更新环境光
    if (ambientRef.current) {
      const dayIntensity = Math.max(0.1, Math.sin(cycle - Math.PI / 2) * 0.5 + 0.3)
      ambientRef.current.intensity = dayIntensity
    }
    
    // 更新星星可见度
    if (starsRef.current) {
      const starsOpacity = Math.max(0, -Math.sin(cycle - Math.PI / 2))
      ;(starsRef.current.material as THREE.PointsMaterial).opacity = starsOpacity
    }
    
    // 通知回调
    if (onTimeChange) {
      const isDay = normalizedTime > 0.25 && normalizedTime < 0.75
      const lightIntensity = Math.max(0, Math.sin(cycle - Math.PI / 2) * 1.5)
      onTimeChange(normalizedTime, isDay, lightIntensity)
    }
  })

  return (
    <>
      {/* 太阳光 */}
      <directionalLight
        ref={sunRef}
        color={0xFFFDF0}
        intensity={1}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.5}
        shadow-camera-far={200}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
      />
      
      {/* 月光 */}
      <directionalLight
        ref={moonRef}
        color={0xB0C4DE}
        intensity={0.3}
      />
      
      {/* 环境光 */}
      <ambientLight ref={ambientRef} intensity={0.5} />
      
      {/* 星星 */}
      <points ref={starsRef} geometry={starsGeometry} material={starsMaterial} />
    </>
  )
}

export { DAY_DURATION, DAY_NIGHT_CYCLE }
