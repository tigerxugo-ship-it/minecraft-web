import { useRef, useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { BlockType } from './Block'
import { isMobile, isIOS } from '../tools/deviceUtils'

interface BlockInstanceProps {
  blocks: { type: BlockType; position: [number, number, number] }[]
}

// 方块颜色映射
const BLOCK_COLORS: Partial<Record<BlockType, string>> = {
  // 基础方块
  grass: '#567D46',
  dirt: '#8B7355',
  stone: '#808080',
  cobblestone: '#696969',
  wood: '#8B4513',
  sand: '#E6C288',
  leaves: '#3D8C40',
  planks: '#C4A77D',
  gravel: '#8B8680',
  clay: '#A9A9A9',
  glass: '#AADDFF',
  ice: '#B0E0E6',
  packed_ice: '#A5F2F3',
  snow: '#FFFFFF',
  snow_block: '#F0F8FF',
  bedrock: '#555555',
  obsidian: '#1A0A24',
  netherrack: '#8B4513',
  soul_sand: '#4A3728',
  soul_soil: '#3D3D3D',
  basalt: '#4A4A4A',
  blackstone: '#2A2A2A',
  glowstone: '#FFEE88',
  nether_wart_block: '#8B0000',
  warped_wart_block: '#00CED1',
  // 木头类型
  oak_log: '#8B4513',
  birch_log: '#F5F5DC',
  spruce_log: '#4A3728',
  jungle_log: '#8B6914',
  acacia_log: '#D2691E',
  dark_oak_log: '#3D2817',
  oak_planks: '#C4A77D',
  birch_planks: '#E3DCC2',
  spruce_planks: '#8B6914',
  jungle_planks: '#B8860B',
  acacia_planks: '#D2691E',
  dark_oak_planks: '#4A3728',
  oak_leaves: '#3D8C40',
  birch_leaves: '#6B8E23',
  spruce_leaves: '#2E5D2E',
  jungle_leaves: '#228B22',
  acacia_leaves: '#6B8E23',
  dark_oak_leaves: '#2E5D2E',
  azalea_leaves: '#6B8E23',
  // 矿石
  coal_ore: '#2F2F2F',
  iron_ore: '#B87333',
  gold_ore: '#FFD700',
  diamond_ore: '#00CED1',
  emerald_ore: '#50C878',
  redstone_ore: '#8B0000',
  lapis_ore: '#1E90FF',
  nether_gold_ore: '#FFD700',
  ancient_debris: '#5C4033',
  nether_quartz_ore: '#E8E8E8',
  // 功能方块
  crafting_table: '#8B6914',
  furnace: '#5A5A5A',
  furnace_lit: '#7A5A3A',
  chest: '#D2691E',
  ender_chest: '#2C1B2E',
  enchanting_table: '#8B4513',
  anvil: '#404040',
  chipped_anvil: '#505050',
  damaged_anvil: '#606060',
  grindstone: '#808080',
  smithing_table: '#8B6914',
  // 树苗和作物
  oak_sapling: '#4CAF50',
  birch_sapling: '#7CB342',
  spruce_sapling: '#388E3C',
  jungle_sapling: '#228B22',
  acacia_sapling: '#D2691E',
  dark_oak_sapling: '#4A3728',
  wheat_seeds: '#8B4513',
  wheat: '#FFD700',
  carrots: '#FFA500',
  potatoes: '#D2691E',
  beetroot_seeds: '#8B0000',
  beetroot: '#8B0000',
  melon_seeds: '#FFD700',
  pumpkin_seeds: '#FFA500',
  sugar_cane: '#228B22',
  cactus: '#228B22',
  bamboo: '#32CD32',
  // 食物和掉落物
  raw_porkchop: '#FFB6C1',
  raw_beef: '#FF6347',
  raw_mutton: '#FFA07A',
  raw_chicken: '#F5F5DC',
  raw_rabbit: '#D2691E',
  raw_cod: '#FFA07A',
  raw_salmon: '#FF6347',
  cooked_porkchop: '#CD853F',
  cooked_beef: '#8B4513',
  cooked_mutton: '#8B4513',
  cooked_chicken: '#CD853F',
  cooked_rabbit: '#8B4513',
  apple: '#FF0000',
  golden_apple: '#FFD700',
  enchanted_golden_apple: '#FFD700',
  bread: '#D2691E',
  cake: '#F5F5DC',
  cookie: '#D2691E',
  melon_slice: '#FF6347',
  sweet_berries: '#DC143C',
  glow_berries: '#FFD700',
  wool: '#F5F5DC',
  leather: '#8B4513',
  feather: '#FFFFFF',
  egg: '#FFF8DC',
  bone: '#F5F5DC',
  gunpowder: '#808080',
  string: '#F5F5DC',
  spider_eye: '#8B0000',
  // 矿物和材料
  coal: '#1C1C1C',
  charcoal: '#2F2F2F',
  iron_ingot: '#C0C0C0',
  gold_ingot: '#FFD700',
  diamond: '#00CED1',
  emerald: '#50C878',
  redstone_dust: '#8B0000',
  lapis_lazuli: '#1E90FF',
  quartz: '#E8E8E8',
  netherite_ingot: '#2C2C2C',
  netherite_scrap: '#4A3728',
  stick: '#DEB887',
  bowl: '#8B4513',
  flint: '#2F2F2F',
  brick: '#B22222',
  nether_brick: '#2F2F2F',
  paper: '#FFFFFF',
  book: '#D2691E',
  slime_ball: '#32CD32',
  blaze_rod: '#FFD700',
  ghast_tear: '#F0F8FF',
  ender_pearl: '#2E8B57',
  eye_of_ender: '#2E8B57',
  prismarine_shard: '#66CDAA',
  prismarine_crystals: '#7FFFD4',
  // 工具和武器
  wooden_sword: '#8B4513',
  wooden_pickaxe: '#8B4513',
  wooden_axe: '#8B4513',
  wooden_shovel: '#8B4513',
  wooden_hoe: '#8B4513',
  stone_sword: '#808080',
  stone_pickaxe: '#808080',
  stone_axe: '#808080',
  stone_shovel: '#808080',
  stone_hoe: '#808080',
  iron_sword: '#C0C0C0',
  iron_pickaxe: '#C0C0C0',
  iron_axe: '#C0C0C0',
  iron_shovel: '#C0C0C0',
  iron_hoe: '#C0C0C0',
  gold_sword: '#FFD700',
  gold_pickaxe: '#FFD700',
  gold_axe: '#FFD700',
  gold_shovel: '#FFD700',
  gold_hoe: '#FFD700',
  diamond_sword: '#00CED1',
  diamond_pickaxe: '#00CED1',
  diamond_axe: '#00CED1',
  diamond_shovel: '#00CED1',
  diamond_hoe: '#00CED1',
  netherite_sword: '#2C2C2C',
  netherite_pickaxe: '#2C2C2C',
  netherite_axe: '#2C2C2C',
  netherite_shovel: '#2C2C2C',
  netherite_hoe: '#2C2C2C',
  bow: '#8B4513',
  arrow: '#8B7355',
  crossbow: '#8B4513',
  trident: '#00CED1',
  shield: '#8B4513',
  // 护甲
  leather_helmet: '#8B4513',
  leather_chestplate: '#8B4513',
  leather_leggings: '#8B4513',
  leather_boots: '#8B4513',
  iron_helmet: '#C0C0C0',
  iron_chestplate: '#C0C0C0',
  iron_leggings: '#C0C0C0',
  iron_boots: '#C0C0C0',
  gold_helmet: '#FFD700',
  gold_chestplate: '#FFD700',
  gold_leggings: '#FFD700',
  gold_boots: '#FFD700',
  diamond_helmet: '#00CED1',
  diamond_chestplate: '#00CED1',
  diamond_leggings: '#00CED1',
  diamond_boots: '#00CED1',
  netherite_helmet: '#2C2C2C',
  netherite_chestplate: '#2C2C2C',
  netherite_leggings: '#2C2C2C',
  netherite_boots: '#2C2C2C',
  // 红石组件
  redstone_torch: '#FF4500',
  redstone_block: '#DC143C',
  redstone_repeater: '#A0522D',
  redstone_comparator: '#D2691E',
  piston: '#A0A0A0',
  sticky_piston: '#8FBC8F',
  dispenser: '#606060',
  dropper: '#707070',
  observer: '#696969',
  hopper: '#4A4A4A',
  lever: '#8B7355',
  stone_button: '#808080',
  wooden_button: '#8B4513',
  stone_pressure_plate: '#808080',
  wooden_pressure_plate: '#8B4513',
  heavy_weighted_pressure_plate: '#FFD700',
  light_weighted_pressure_plate: '#FFA500',
  tripwire_hook: '#8B7355',
  note_block: '#8B6914',
  redstone_lamp: '#4A3728',
  tnt: '#FF6347',
  daylight_detector: '#D2691E',
  trapped_chest: '#D2691E',
  target: '#FF6B6B',
  // 门和活板门
  oak_door: '#8B4513',
  birch_door: '#F5F5DC',
  spruce_door: '#4A3728',
  jungle_door: '#8B6914',
  acacia_door: '#D2691E',
  dark_oak_door: '#3D2817',
  iron_door: '#C0C0C0',
  wooden_door: '#8B4513',
  oak_trapdoor: '#8B4513',
  birch_trapdoor: '#F5F5DC',
  spruce_trapdoor: '#4A3728',
  jungle_trapdoor: '#8B6914',
  acacia_trapdoor: '#D2691E',
  dark_oak_trapdoor: '#3D2817',
  iron_trapdoor: '#C0C0C0',
  wooden_trapdoor: '#8B4513',
  oak_fence_gate: '#8B4513',
  birch_fence_gate: '#F5F5DC',
  spruce_fence_gate: '#4A3728',
  jungle_fence_gate: '#8B6914',
  acacia_fence_gate: '#D2691E',
  dark_oak_fence_gate: '#3D2817',
  fence_gate: '#8B4513',
  // 装饰方块
  torch: '#FFD700',
  soul_torch: '#4ECDC4',
  redstone_torch_lit: '#FF6347',
  lantern: '#FFA500',
  soul_lantern: '#4ECDC4',
  sea_lantern: '#E0FFFF',
  jack_o_lantern: '#FF8C00',
  shroomlight: '#FF8C00',
  ochre_froglight: '#FFF8DC',
  verdant_froglight: '#98FB98',
  pearlescent_froglight: '#DDA0DD',
  flower: '#FF69B4',
  dandelion: '#FFD700',
  poppy: '#FF0000',
  blue_orchid: '#4169E1',
  allium: '#DA70D6',
  azure_bluet: '#F0F8FF',
  tulip: '#FF6347',
  oxeye_daisy: '#FFFFF0',
  cornflower: '#6495ED',
  lily_of_the_valley: '#FFFFFF',
  sunflower: '#FFD700',
  lilac: '#C8A2C8',
  rose_bush: '#FF0000',
  peony: '#FFB6C1',
  lily_pad: '#228B22',
  sea_pickle: '#32CD32',
  kelp: '#228B22',
  seagrass: '#32CD32',
  dead_bush: '#8B4513',
  fern: '#228B22',
  large_fern: '#228B22',
  grass_plant: '#32CD32',
  tall_grass: '#228B22',
  vine: '#228B22',
  mushroom: '#8B4513',
  brown_mushroom: '#8B4513',
  red_mushroom: '#DC143C',
  mushroom_stem: '#F5F5DC',
  mushroom_block: '#8B0000',
  // 下界和末地
  crimson_stem: '#8B0000',
  warped_stem: '#00CED1',
  crimson_planks: '#A0522D',
  warped_planks: '#20B2AA',
  crimson_nylium: '#8B0000',
  warped_nylium: '#00CED1',
  weeping_vines: '#8B0000',
  twisting_vines: '#00CED1',
  nether_bricks: '#2F2F2F',
  red_nether_bricks: '#8B0000',
  nether_brick_fence: '#2F2F2F',
  nether_brick_slab: '#2F2F2F',
  nether_brick_stairs: '#2F2F2F',
  soul_fire: '#4ECDC4',
  fire: '#FF4500',
  end_stone: '#F5F5DC',
  end_stone_bricks: '#E8E8D0',
  purpur_block: '#9370DB',
  purpur_pillar: '#9370DB',
  chorus_plant: '#9370DB',
  chorus_flower: '#DDA0DD',
  dragon_head: '#2E8B57',
  dragon_egg: '#9932CC',
  // 其他
  spawner: '#2F2F2F',
  command_block: '#9932CC',
  structure_block: '#8B4513',
  jigsaw: '#4A4A4A',
  barrier: '#FF0000',
  light: '#FFFFFF',
  hay_block: '#DAA520',
  sponge: '#F0E68C',
  wet_sponge: '#9ACD32',
  bookshelf: '#8B4513',
  cobweb: '#F5F5F5',
  shulker_box: '#9370DB',
  white_shulker_box: '#FFFFFF',
  orange_shulker_box: '#FFA500',
  magenta_shulker_box: '#FF00FF',
  light_blue_shulker_box: '#87CEEB',
  yellow_shulker_box: '#FFFF00',
  lime_shulker_box: '#32CD32',
  pink_shulker_box: '#FFB6C1',
  gray_shulker_box: '#808080',
  light_gray_shulker_box: '#D3D3D3',
  cyan_shulker_box: '#00FFFF',
  purple_shulker_box: '#9370DB',
  blue_shulker_box: '#0000FF',
  brown_shulker_box: '#8B4513',
  green_shulker_box: '#008000',
  red_shulker_box: '#FF0000',
  black_shulker_box: '#000000',
  // 村民职业方块
  composter: '#8B6914',
  barrel: '#8B4513',
  smoker: '#5A5A5A',
  blast_furnace: '#404040',
  cartography_table: '#8B6914',
  fletching_table: '#D2691E',
  brewing_stand: '#2F2F2F',
  cauldron: '#2F2F2F',
  lectern: '#8B6914',
  loom: '#8B4513',
  stonecutter: '#808080',
  bell: '#FFD700',
  bee_nest: '#D2691E',
  beehive: '#8B6914',
  lodestone: '#4682B4',
  respawn_anchor: '#2F2F2F',
  // 空气
  air: '#000000'
}

// 为每种方块类型创建单独的 InstancedMesh
export function BlockInstances({ blocks }: BlockInstanceProps) {
  // 按类型分组
  const groupedBlocks = useMemo(() => {
    const groups: Partial<Record<BlockType, { type: BlockType; position: [number, number, number] }[]>> = {}
    
    blocks.forEach(block => {
      if (!groups[block.type]) {
        groups[block.type] = []
      }
      groups[block.type]!.push(block)
    })
    
    return groups as Record<BlockType, { type: BlockType; position: [number, number, number] }[]>
  }, [blocks])

  return (
    <>
      {Object.entries(groupedBlocks).map(([type, typeBlocks]) => {
        if (!typeBlocks || typeBlocks.length === 0) return null
        const color = BLOCK_COLORS[type as BlockType] || '#888888'
        return (
          <BlockTypeInstances 
            key={type}
            type={type as BlockType} 
            blocks={typeBlocks} 
            color={color} 
          />
        )
      })}
    </>
  )
}

interface BlockTypeInstancesProps {
  type: BlockType
  blocks: { type: BlockType; position: [number, number, number] }[]
  color: string
}

function BlockTypeInstances({ type, blocks, color }: BlockTypeInstancesProps) {
  if (blocks.length === 0) return null
  return <BlockInstancedMesh blocks={blocks} color={color} type={type} />
}

function BlockInstancedMesh({ 
  blocks, 
  color,
  type
}: { 
  blocks: { type: BlockType; position: [number, number, number] }[]
  color: string
  type: BlockType
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const isMobileDevice = useMemo(() => isMobile() || isIOS(), [])

  useEffect(() => {
    if (!meshRef.current) return
    
    try {
      blocks.forEach((block, i) => {
        dummy.position.set(...block.position)
        dummy.updateMatrix()
        meshRef.current!.setMatrixAt(i, dummy.matrix)
      })
      meshRef.current.instanceMatrix.needsUpdate = true
    } catch (error) {
      console.warn('Error updating instanced mesh:', error)
    }
  }, [blocks, dummy])

  // 根据方块类型决定材质属性
  const isTransparent = ['leaves', 'oak_sapling', 'birch_sapling', 'spruce_sapling'].includes(type)
  const emissive = type === 'furnace_lit' ? '#FF6600' : undefined
  const emissiveIntensity = type === 'furnace_lit' ? 0.5 : 0

  // 移动端简化渲染
  if (isMobileDevice && blocks.length > 100) {
    // 对于大量方块，使用简化的材质
    return (
      <instancedMesh 
        ref={meshRef} 
        args={[undefined, undefined, blocks.length]}
        userData={{ type }}
        frustumCulled={true}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshLambertMaterial 
          color={color} 
          transparent={isTransparent}
          opacity={isTransparent ? 0.8 : 1}
          emissive={emissive}
          emissiveIntensity={emissiveIntensity}
        />
      </instancedMesh>
    )
  }

  return (
    <instancedMesh 
      ref={meshRef} 
      args={[undefined, undefined, blocks.length]}
      userData={{ type }}
      frustumCulled={true}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial 
        color={color} 
        transparent={isTransparent}
        opacity={isTransparent ? 0.8 : 1}
        emissive={emissive}
        emissiveIntensity={emissiveIntensity}
      />
    </instancedMesh>
  )
}
