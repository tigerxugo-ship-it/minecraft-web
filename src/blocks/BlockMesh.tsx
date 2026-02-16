import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { BlockType } from '../blocks/Block'

interface BlockMeshProps {
  blocks: { type: BlockType; position: [number, number, number] }[]
}

export function BlockMesh({ blocks }: BlockMeshProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  
  // 按方块类型分组
  const groupedBlocks = useMemo(() => {
    const groups: Partial<Record<BlockType, { type: BlockType; position: [number, number, number] }[]>> = {}
    blocks.forEach(block => {
      if (!groups[block.type]) {
        groups[block.type] = []
      }
      groups[block.type]!.push(block)
    })
    return groups
  }, [blocks])

  useFrame(() => {
    if (!meshRef.current) return
    
    let index = 0
    Object.entries(groupedBlocks).forEach(([, typeBlocks]) => {
      typeBlocks.forEach(block => {
        dummy.position.set(...block.position)
        dummy.updateMatrix()
        meshRef.current!.setMatrixAt(index, dummy.matrix)
        index++
      })
    })
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  if (blocks.length === 0) return null

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, blocks.length]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial />
    </instancedMesh>
  )
}
