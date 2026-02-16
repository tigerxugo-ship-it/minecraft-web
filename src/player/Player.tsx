import { useRef, useEffect, useMemo } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { useSphere } from '@react-three/cannon'
import * as THREE from 'three'
import { useGameStore } from '../engine/gameStore'
import { getMiningTime, isCorrectTool } from '../tools/ToolSystem'
import { BLOCK_PROPERTIES, BlockType } from '../blocks/Block'

const SPEED = 5
const JUMP_FORCE = 8

export function Player() {
  const { camera, scene, gl } = useThree()
  const { 
    isLocked, setLocked, removeBlock, addBlock, getBlockAt, 
    selectedSlot, inventory, removeFromInventory, addToInventory: _addToInventory,
    miningState, startMining, updateMiningProgress, stopMining, completeMining,
    getEquippedTool
  } = useGameStore()
  
  // 物理体
  const [ref, api] = useSphere(() => ({
    mass: 1,
    type: 'Dynamic',
    position: [0, 5, 0],
    args: [0.5],
    fixedRotation: true,
    linearDamping: 0.9,
  }))

  // 移动状态
  const moveState = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false
  })
  
  const velocity = useRef([0, 0, 0])
  const isGrounded = useRef(false)
  
  // 挖掘状态
  const isMouseDown = useRef(false)
  const currentMiningTarget = useRef<[number, number, number] | null>(null)
  
  // 监听速度变化
  useEffect(() => {
    const unsubscribe = api.velocity.subscribe((v) => {
      velocity.current = v
    })
    return unsubscribe
  }, [api])

  // 键盘控制
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW': moveState.current.forward = true; break
        case 'KeyS': moveState.current.backward = true; break
        case 'KeyA': moveState.current.left = true; break
        case 'KeyD': moveState.current.right = true; break
        case 'Space': 
          if (isGrounded.current) {
            moveState.current.jump = true
          }
          break
        case 'Digit1': useGameStore.getState().setSelectedSlot(0); break
        case 'Digit2': useGameStore.getState().setSelectedSlot(1); break
        case 'Digit3': useGameStore.getState().setSelectedSlot(2); break
        case 'Digit4': useGameStore.getState().setSelectedSlot(3); break
        case 'Digit5': useGameStore.getState().setSelectedSlot(4); break
        case 'Digit6': useGameStore.getState().setSelectedSlot(5); break
        case 'Digit7': useGameStore.getState().setSelectedSlot(6); break
        case 'Digit8': useGameStore.getState().setSelectedSlot(7); break
        case 'Digit9': useGameStore.getState().setSelectedSlot(8); break
      }
    }
    
    const onKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW': moveState.current.forward = false; break
        case 'KeyS': moveState.current.backward = false; break
        case 'KeyA': moveState.current.left = false; break
        case 'KeyD': moveState.current.right = false; break
        case 'Space': moveState.current.jump = false; break
      }
    }
    
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [])
  
  // 鼠标滚轮切换
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (!isLocked) return
      const currentSlot = useGameStore.getState().selectedSlot
      const delta = e.deltaY > 0 ? 1 : -1
      const newSlot = Math.max(0, Math.min(8, currentSlot + delta))
      useGameStore.getState().setSelectedSlot(newSlot)
    }
    
    window.addEventListener('wheel', onWheel)
    return () => window.removeEventListener('wheel', onWheel)
  }, [isLocked])

  // 鼠标锁定
  useEffect(() => {
    const canvas = gl.domElement
    
    const onClick = () => {
      if (!isLocked) {
        canvas.requestPointerLock()
      }
    }
    
    const onPointerLockChange = () => {
      setLocked(document.pointerLockElement === canvas)
    }
    
    canvas.addEventListener('click', onClick)
    document.addEventListener('pointerlockchange', onPointerLockChange)
    
    return () => {
      canvas.removeEventListener('click', onClick)
      document.removeEventListener('pointerlockchange', onPointerLockChange)
    }
  }, [gl, isLocked, setLocked])

  // 鼠标移动（视角控制）
  useEffect(() => {
    let euler = new THREE.Euler(0, 0, 0, 'YXZ')
    
    const onMouseMove = (e: MouseEvent) => {
      if (!isLocked) return
      
      euler.setFromQuaternion(camera.quaternion)
      euler.y -= e.movementX * 0.002
      euler.x -= e.movementY * 0.002
      euler.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, euler.x))
      camera.quaternion.setFromEuler(euler)
    }
    
    window.addEventListener('mousemove', onMouseMove)
    return () => window.removeEventListener('mousemove', onMouseMove)
  }, [camera, isLocked])

  // 鼠标点击（挖掘/放置）
  const raycaster = useMemo(() => new THREE.Raycaster(), [])
  const mouse = new THREE.Vector2(0, 0)
  
  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      if (!isLocked) return
      
      isMouseDown.current = true
      
      raycaster.setFromCamera(mouse, camera)
      const intersects = raycaster.intersectObjects(scene.children, true)
      
      if (e.button === 0) {
        // 左键 - 开始挖掘
        for (const hit of intersects) {
          if (hit.distance < 5 && (hit.object as any).userData?.type) {
            const hitPoint = hit.point
            const normal = hit.face?.normal || new THREE.Vector3()
            
            // 计算方块中心位置
            const blockPos: [number, number, number] = [
              Math.round(hitPoint.x - normal.x * 0.1),
              Math.round(hitPoint.y - normal.y * 0.1),
              Math.round(hitPoint.z - normal.z * 0.1)
            ]
            
            const block = getBlockAt(blockPos)
            if (block) {
              currentMiningTarget.current = blockPos
              startMining(blockPos)
            }
            break
          }
        }
      } else if (e.button === 2) {
        // 右键 - 放置
        e.preventDefault()
        
        const item = inventory[selectedSlot]
        if (!item || item.count <= 0) return
        
        // 不能放置工具
        if (item.type === 'tool') return
        
        for (const hit of intersects) {
          if (hit.distance < 5) {
            const normal = hit.face?.normal || new THREE.Vector3()
            const placePos: [number, number, number] = [
              Math.round(hit.point.x + normal.x * 0.5),
              Math.round(hit.point.y + normal.y * 0.5),
              Math.round(hit.point.z + normal.z * 0.5)
            ]
            
            // 检查是否与玩家位置重叠
            const playerPos = ref.current?.position
            if (playerPos) {
              const dx = Math.abs(playerPos.x - placePos[0])
              const dy = Math.abs(playerPos.y - placePos[1])
              const dz = Math.abs(playerPos.z - placePos[2])
              if (dx < 1 && dy < 1.5 && dz < 1) continue
            }
            
            // 检查该位置是否已有方块
            if (!getBlockAt(placePos)) {
              addBlock({ type: item.type as BlockType, position: placePos })
              removeFromInventory(selectedSlot)
            }
            break
          }
        }
      }
    }
    
    const onMouseUp = () => {
      isMouseDown.current = false
      currentMiningTarget.current = null
      stopMining()
    }
    
    window.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mouseup', onMouseUp)
    window.addEventListener('contextmenu', (e) => e.preventDefault())
    return () => {
      window.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [isLocked, camera, gl, raycaster, removeBlock, addBlock, getBlockAt, selectedSlot, inventory, removeFromInventory, ref, startMining, stopMining])

  // 物理更新和挖掘进度
  useFrame(() => {
    if (!ref.current) return
    
    // 移动逻辑
    const direction = new THREE.Vector3()
    const frontVector = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion)
    frontVector.y = 0
    frontVector.normalize()
    
    const sideVector = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion)
    sideVector.y = 0
    sideVector.normalize()
    
    if (moveState.current.forward) direction.add(frontVector)
    if (moveState.current.backward) direction.sub(frontVector)
    if (moveState.current.left) direction.sub(sideVector)
    if (moveState.current.right) direction.add(sideVector)
    
    direction.normalize().multiplyScalar(SPEED)
    
    // 跳跃
    if (moveState.current.jump && isGrounded.current) {
      api.velocity.set(velocity.current[0], JUMP_FORCE, velocity.current[2])
      isGrounded.current = false
    } else {
      api.velocity.set(direction.x, velocity.current[1], direction.z)
    }
    
    // 更新相机位置
    const pos = ref.current.position
    camera.position.set(pos.x, pos.y + 0.5, pos.z)
    
    // 简单的地面检测
    if (Math.abs(velocity.current[1]) < 0.1) {
      isGrounded.current = true
    }
    
    // 挖掘进度更新
    if (miningState.isMining && isMouseDown.current && currentMiningTarget.current) {
      const block = getBlockAt(currentMiningTarget.current)
      if (block) {
        const equippedTool = getEquippedTool()
        const isRightTool = equippedTool ? isCorrectTool(equippedTool.type, block.type) : false
        const blockProps = BLOCK_PROPERTIES[block.type]
        if (!blockProps) return
        const miningTime = getMiningTime(
          blockProps.hardness,
          equippedTool,
          block.type,
          isRightTool
        )
        
        const elapsed = (Date.now() - miningState.startTime) / 1000
        const progress = Math.min(100, (elapsed / miningTime) * 100)
        
        updateMiningProgress(progress)
        
        if (progress >= 100) {
          completeMining()
          currentMiningTarget.current = null
        }
      } else {
        stopMining()
        currentMiningTarget.current = null
      }
    }
  })

  return (
    <mesh ref={ref as any} visible={false}>
      <sphereGeometry args={[0.5]} />
      <meshBasicMaterial transparent opacity={0} />
    </mesh>
  )
}
