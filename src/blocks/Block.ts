// 方块类型扩展
export type BlockType = 
  // 基础方块
  | 'grass' | 'dirt' | 'stone' | 'wood' | 'sand' | 'leaves' | 'planks' | 'cobblestone'
  | 'gravel' | 'clay' | 'glass' | 'ice' | 'packed_ice' | 'snow' | 'snow_block'
  | 'bedrock' | 'obsidian' | 'netherrack' | 'soul_sand' | 'soul_soil'
  | 'basalt' | 'blackstone' | 'glowstone' | 'nether_wart_block' | 'warped_wart_block'
  // 木头类型
  | 'oak_log' | 'birch_log' | 'spruce_log' | 'jungle_log' | 'acacia_log' | 'dark_oak_log'
  | 'oak_planks' | 'birch_planks' | 'spruce_planks' | 'jungle_planks' | 'acacia_planks' | 'dark_oak_planks'
  | 'oak_leaves' | 'birch_leaves' | 'spruce_leaves' | 'jungle_leaves' | 'acacia_leaves' | 'dark_oak_leaves' | 'azalea_leaves'
  // 矿石
  | 'coal_ore' | 'iron_ore' | 'gold_ore' | 'diamond_ore' | 'emerald_ore' | 'redstone_ore' | 'lapis_ore'
  | 'nether_gold_ore' | 'ancient_debris' | 'nether_quartz_ore'
  // 功能方块
  | 'crafting_table' | 'furnace' | 'furnace_lit' | 'chest' | 'ender_chest' | 'enchanting_table'
  | 'anvil' | 'chipped_anvil' | 'damaged_anvil' | 'grindstone' | 'smithing_table'
  // 树苗和作物
  | 'oak_sapling' | 'birch_sapling' | 'spruce_sapling' | 'jungle_sapling' | 'acacia_sapling' | 'dark_oak_sapling'
  | 'wheat_seeds' | 'wheat' | 'carrots' | 'potatoes' | 'beetroot_seeds' | 'beetroot'
  | 'melon_seeds' | 'pumpkin_seeds' | 'sugar_cane' | 'cactus' | 'bamboo'
  // 食物和掉落物
  | 'raw_porkchop' | 'raw_beef' | 'raw_mutton' | 'raw_chicken' | 'raw_rabbit' | 'raw_cod' | 'raw_salmon'
  | 'cooked_porkchop' | 'cooked_beef' | 'cooked_mutton' | 'cooked_chicken' | 'cooked_rabbit'
  | 'apple' | 'golden_apple' | 'enchanted_golden_apple' | 'bread' | 'cake' | 'cookie'
  | 'melon_slice' | 'sweet_berries' | 'glow_berries'
  | 'wool' | 'leather' | 'feather' | 'egg' | 'bone' | 'gunpowder' | 'string' | 'spider_eye'
  // 矿物和材料
  | 'coal' | 'charcoal' | 'iron_ingot' | 'gold_ingot' | 'diamond' | 'emerald' | 'redstone_dust'
  | 'lapis_lazuli' | 'quartz' | 'netherite_ingot' | 'netherite_scrap' | 'stick' | 'bowl'
  | 'flint' | 'brick' | 'nether_brick' | 'paper' | 'book' | 'slime_ball' | 'blaze_rod'
  | 'ghast_tear' | 'ender_pearl' | 'eye_of_ender' | 'prismarine_shard' | 'prismarine_crystals'
  // 工具和武器
  | 'wooden_sword' | 'wooden_pickaxe' | 'wooden_axe' | 'wooden_shovel' | 'wooden_hoe'
  | 'stone_sword' | 'stone_pickaxe' | 'stone_axe' | 'stone_shovel' | 'stone_hoe'
  | 'iron_sword' | 'iron_pickaxe' | 'iron_axe' | 'iron_shovel' | 'iron_hoe'
  | 'gold_sword' | 'gold_pickaxe' | 'gold_axe' | 'gold_shovel' | 'gold_hoe'
  | 'diamond_sword' | 'diamond_pickaxe' | 'diamond_axe' | 'diamond_shovel' | 'diamond_hoe'
  | 'netherite_sword' | 'netherite_pickaxe' | 'netherite_axe' | 'netherite_shovel' | 'netherite_hoe'
  | 'bow' | 'arrow' | 'crossbow' | 'trident' | 'shield'
  // 护甲
  | 'leather_helmet' | 'leather_chestplate' | 'leather_leggings' | 'leather_boots'
  | 'iron_helmet' | 'iron_chestplate' | 'iron_leggings' | 'iron_boots'
  | 'gold_helmet' | 'gold_chestplate' | 'gold_leggings' | 'gold_boots'
  | 'diamond_helmet' | 'diamond_chestplate' | 'diamond_leggings' | 'diamond_boots'
  | 'netherite_helmet' | 'netherite_chestplate' | 'netherite_leggings' | 'netherite_boots'
  // 红石组件
  | 'redstone_torch' | 'redstone_block' | 'redstone_repeater' | 'redstone_comparator'
  | 'piston' | 'sticky_piston' | 'dispenser' | 'dropper' | 'observer' | 'hopper'
  | 'lever' | 'stone_button' | 'wooden_button' | 'stone_pressure_plate' | 'wooden_pressure_plate'
  | 'heavy_weighted_pressure_plate' | 'light_weighted_pressure_plate' | 'tripwire_hook'
  | 'note_block' | 'redstone_lamp' | 'tnt' | 'daylight_detector' | 'trapped_chest' | 'target'
  // 门和活板门
  | 'oak_door' | 'birch_door' | 'spruce_door' | 'jungle_door' | 'acacia_door' | 'dark_oak_door' | 'iron_door'
  | 'wooden_door'
  | 'oak_trapdoor' | 'birch_trapdoor' | 'spruce_trapdoor' | 'jungle_trapdoor' | 'acacia_trapdoor' | 'dark_oak_trapdoor' | 'iron_trapdoor'
  | 'wooden_trapdoor'
  | 'oak_fence_gate' | 'birch_fence_gate' | 'spruce_fence_gate' | 'jungle_fence_gate' | 'acacia_fence_gate' | 'dark_oak_fence_gate'
  | 'fence_gate'
  // 装饰方块
  | 'torch' | 'soul_torch' | 'redstone_torch_lit' | 'lantern' | 'soul_lantern' | 'sea_lantern'
  | 'jack_o_lantern' | 'glowstone' | 'shroomlight' | 'ochre_froglight' | 'verdant_froglight' | 'pearlescent_froglight'
  | 'flower' | 'dandelion' | 'poppy' | 'blue_orchid' | 'allium' | 'azure_bluet' | 'tulip'
  | 'oxeye_daisy' | 'cornflower' | 'lily_of_the_valley' | 'sunflower' | 'lilac' | 'rose_bush' | 'peony'
  | 'cactus' | 'sugar_cane' | 'vine' | 'lily_pad' | 'sea_pickle' | 'kelp' | 'seagrass'
  | 'dead_bush' | 'fern' | 'large_fern' | 'grass_plant' | 'tall_grass'
  | 'mushroom' | 'brown_mushroom' | 'red_mushroom' | 'mushroom_stem' | 'mushroom_block'
  // 下界和末地
  | 'crimson_stem' | 'warped_stem' | 'crimson_planks' | 'warped_planks'
  | 'crimson_nylium' | 'warped_nylium' | 'weeping_vines' | 'twisting_vines'
  | 'nether_bricks' | 'red_nether_bricks' | 'nether_brick_fence' | 'nether_brick_slab' | 'nether_brick_stairs'
  | 'soul_fire' | 'fire' | 'end_stone' | 'end_stone_bricks' | 'purpur_block' | 'purpur_pillar'
  | 'chorus_plant' | 'chorus_flower' | 'dragon_head' | 'dragon_egg'
  // 其他
  | 'spawner' | 'command_block' | 'structure_block' | 'jigsaw' | 'barrier' | 'light'
  | 'hay_block' | 'sponge' | 'wet_sponge' | 'bookshelf' | 'cobweb'
  | 'chest' | 'ender_chest' | 'trapped_chest' | 'shulker_box'
  | 'white_shulker_box' | 'orange_shulker_box' | 'magenta_shulker_box' | 'light_blue_shulker_box'
  | 'yellow_shulker_box' | 'lime_shulker_box' | 'pink_shulker_box' | 'gray_shulker_box'
  | 'light_gray_shulker_box' | 'cyan_shulker_box' | 'purple_shulker_box' | 'blue_shulker_box'
  | 'brown_shulker_box' | 'green_shulker_box' | 'red_shulker_box' | 'black_shulker_box'
  // 村民相关
  | 'composter' | 'barrel' | 'smoker' | 'blast_furnace' | 'cartography_table' | 'fletching_table'
  | 'brewing_stand' | 'cauldron' | 'lectern' | 'loom' | 'stonecutter'
  | 'bell' | 'bee_nest' | 'beehive' | 'lodestone' | 'respawn_anchor'
  // 空气
  | 'air'

// 工具材料等级
export type ToolMaterial = 'wood' | 'stone' | 'iron' | 'gold' | 'diamond' | 'netherite' | 'none'

// 挖掘等级
export enum MiningLevel {
  HAND = 0,      // 徒手
  WOOD = 1,      // 木镐
  STONE = 2,     // 石镐
  IRON = 3,      // 铁镐
  DIAMOND = 4,   // 钻石镐
  NETHERITE = 5  // 下界合金镐
}

export interface BlockProperties {
  hardness: number
  transparent: boolean
  color: string
  name: string
  miningLevel: MiningLevel
  dropItem?: BlockType
  isOre?: boolean
  isCraftingStation?: boolean
  isFurnace?: boolean
  isRedstone?: boolean
  emitsLight?: number
}

export const BLOCK_PROPERTIES: Partial<Record<BlockType, BlockProperties>> = {
  // 基础方块
  grass: { hardness: 1, transparent: false, color: '#567D46', name: '草方块', miningLevel: MiningLevel.HAND },
  dirt: { hardness: 1, transparent: false, color: '#8B7355', name: '泥土', miningLevel: MiningLevel.HAND },
  stone: { hardness: 3, transparent: false, color: '#808080', name: '石头', miningLevel: MiningLevel.WOOD, dropItem: 'cobblestone' },
  wood: { hardness: 2, transparent: false, color: '#8B4513', name: '木头', miningLevel: MiningLevel.HAND },
  sand: { hardness: 1, transparent: false, color: '#E6C288', name: '沙子', miningLevel: MiningLevel.HAND },
  leaves: { hardness: 0.5, transparent: true, color: '#3D8C40', name: '树叶', miningLevel: MiningLevel.HAND },
  planks: { hardness: 2, transparent: false, color: '#C4A77D', name: '木板', miningLevel: MiningLevel.HAND },
  cobblestone: { hardness: 2, transparent: false, color: '#696969', name: '圆石', miningLevel: MiningLevel.WOOD },
  gravel: { hardness: 0.6, transparent: false, color: '#A0A0A0', name: '沙砾', miningLevel: MiningLevel.HAND },
  glass: { hardness: 0.3, transparent: true, color: '#AADDFF', name: '玻璃', miningLevel: MiningLevel.HAND },
  bedrock: { hardness: -1, transparent: false, color: '#404040', name: '基岩', miningLevel: MiningLevel.NETHERITE },
  obsidian: { hardness: 50, transparent: false, color: '#1A0A24', name: '黑曜石', miningLevel: MiningLevel.DIAMOND },
  
  // 下界方块
  netherrack: { hardness: 0.4, transparent: false, color: '#8B4513', name: '下界岩', miningLevel: MiningLevel.WOOD },
  soul_sand: { hardness: 0.5, transparent: false, color: '#4A3728', name: '灵魂沙', miningLevel: MiningLevel.HAND },
  glowstone: { hardness: 0.3, transparent: true, color: '#FFEC8B', name: '荧石', miningLevel: MiningLevel.HAND, emitsLight: 15 },
  basalt: { hardness: 1.25, transparent: false, color: '#4A4A4A', name: '玄武岩', miningLevel: MiningLevel.WOOD },
  blackstone: { hardness: 2, transparent: false, color: '#2A2A2A', name: '黑石', miningLevel: MiningLevel.WOOD },
  ancient_debris: { hardness: 30, transparent: false, color: '#5C4033', name: '远古残骸', miningLevel: MiningLevel.DIAMOND, dropItem: 'netherite_scrap' },
  nether_quartz_ore: { hardness: 3, transparent: false, color: '#E8E8E8', name: '下界石英矿石', miningLevel: MiningLevel.WOOD, dropItem: 'quartz' },
  
  // 矿石
  coal_ore: { hardness: 3, transparent: false, color: '#2F2F2F', name: '煤矿石', miningLevel: MiningLevel.WOOD, dropItem: 'coal', isOre: true },
  iron_ore: { hardness: 3, transparent: false, color: '#B87333', name: '铁矿石', miningLevel: MiningLevel.STONE, isOre: true },
  gold_ore: { hardness: 3, transparent: false, color: '#FFD700', name: '金矿石', miningLevel: MiningLevel.IRON, isOre: true },
  diamond_ore: { hardness: 3, transparent: false, color: '#00CED1', name: '钻石矿石', miningLevel: MiningLevel.IRON, dropItem: 'diamond', isOre: true },
  redstone_ore: { hardness: 3, transparent: false, color: '#8B0000', name: '红石矿石', miningLevel: MiningLevel.IRON, dropItem: 'redstone_dust', isOre: true },
  emerald_ore: { hardness: 3, transparent: false, color: '#50C878', name: '绿宝石矿石', miningLevel: MiningLevel.IRON, isOre: true },
  lapis_ore: { hardness: 3, transparent: false, color: '#1E90FF', name: '青金石矿石', miningLevel: MiningLevel.STONE, dropItem: 'lapis_lazuli', isOre: true },
  nether_gold_ore: { hardness: 3, transparent: false, color: '#FFD700', name: '下界金矿石', miningLevel: MiningLevel.WOOD, dropItem: 'gold_ingot', isOre: true },
  
  // 功能方块
  crafting_table: { hardness: 2.5, transparent: false, color: '#8B6914', name: '工作台', miningLevel: MiningLevel.HAND, isCraftingStation: true },
  furnace: { hardness: 3.5, transparent: false, color: '#5A5A5A', name: '熔炉', miningLevel: MiningLevel.WOOD, isFurnace: true },
  furnace_lit: { hardness: 3.5, transparent: false, color: '#7A5A3A', name: '燃烧中的熔炉', miningLevel: MiningLevel.WOOD, isFurnace: true },
  chest: { hardness: 2.5, transparent: false, color: '#D2691E', name: '箱子', miningLevel: MiningLevel.HAND },
  ender_chest: { hardness: 22.5, transparent: true, color: '#2E8B57', name: '末影箱', miningLevel: MiningLevel.WOOD },
  enchanting_table: { hardness: 5, transparent: false, color: '#9932CC', name: '附魔台', miningLevel: MiningLevel.WOOD },
  anvil: { hardness: 5, transparent: false, color: '#404040', name: '铁砧', miningLevel: MiningLevel.WOOD },
  
  // 树苗
  oak_sapling: { hardness: 0, transparent: true, color: '#4CAF50', name: '橡树树苗', miningLevel: MiningLevel.HAND },
  birch_sapling: { hardness: 0, transparent: true, color: '#7CB342', name: '白桦树苗', miningLevel: MiningLevel.HAND },
  spruce_sapling: { hardness: 0, transparent: true, color: '#388E3C', name: '云杉树苗', miningLevel: MiningLevel.HAND },
  
  // 食物和掉落物
  raw_porkchop: { hardness: 0, transparent: true, color: '#FFB6C1', name: '生猪排', miningLevel: MiningLevel.HAND },
  raw_beef: { hardness: 0, transparent: true, color: '#FF6347', name: '生牛肉', miningLevel: MiningLevel.HAND },
  raw_mutton: { hardness: 0, transparent: true, color: '#FFA07A', name: '生羊肉', miningLevel: MiningLevel.HAND },
  cooked_porkchop: { hardness: 0, transparent: true, color: '#CD853F', name: '熟猪排', miningLevel: MiningLevel.HAND },
  cooked_beef: { hardness: 0, transparent: true, color: '#8B4513', name: '牛排', miningLevel: MiningLevel.HAND },
  apple: { hardness: 0, transparent: true, color: '#FF0000', name: '苹果', miningLevel: MiningLevel.HAND },
  golden_apple: { hardness: 0, transparent: true, color: '#FFD700', name: '金苹果', miningLevel: MiningLevel.HAND },
  bread: { hardness: 0, transparent: true, color: '#D2691E', name: '面包', miningLevel: MiningLevel.HAND },
  wool: { hardness: 0.5, transparent: false, color: '#F5F5DC', name: '羊毛', miningLevel: MiningLevel.HAND },
  leather: { hardness: 0, transparent: true, color: '#8B4513', name: '皮革', miningLevel: MiningLevel.HAND },
  feather: { hardness: 0, transparent: true, color: '#FFFFFF', name: '羽毛', miningLevel: MiningLevel.HAND },
  egg: { hardness: 0, transparent: true, color: '#FFF8DC', name: '鸡蛋', miningLevel: MiningLevel.HAND },
  
  // 矿物和材料
  coal: { hardness: 0, transparent: true, color: '#1C1C1C', name: '煤炭', miningLevel: MiningLevel.HAND },
  charcoal: { hardness: 0, transparent: true, color: '#2F2F2F', name: '木炭', miningLevel: MiningLevel.HAND },
  iron_ingot: { hardness: 0, transparent: true, color: '#C0C0C0', name: '铁锭', miningLevel: MiningLevel.HAND },
  gold_ingot: { hardness: 0, transparent: true, color: '#FFD700', name: '金锭', miningLevel: MiningLevel.HAND },
  diamond: { hardness: 0, transparent: true, color: '#00CED1', name: '钻石', miningLevel: MiningLevel.HAND },
  emerald: { hardness: 0, transparent: true, color: '#50C878', name: '绿宝石', miningLevel: MiningLevel.HAND },
  redstone_dust: { hardness: 0, transparent: true, color: '#8B0000', name: '红石粉', miningLevel: MiningLevel.HAND },
  lapis_lazuli: { hardness: 0, transparent: true, color: '#1E90FF', name: '青金石', miningLevel: MiningLevel.HAND },
  quartz: { hardness: 0, transparent: true, color: '#F5F5F5', name: '下界石英', miningLevel: MiningLevel.HAND },
  netherite_ingot: { hardness: 0, transparent: true, color: '#2C2C2C', name: '下界合金锭', miningLevel: MiningLevel.HAND },
  netherite_scrap: { hardness: 0, transparent: true, color: '#4A3728', name: '下界合金碎片', miningLevel: MiningLevel.HAND },
  stick: { hardness: 0, transparent: true, color: '#DEB887', name: '木棍', miningLevel: MiningLevel.HAND },
  flint: { hardness: 0, transparent: true, color: '#2F2F2F', name: '燧石', miningLevel: MiningLevel.HAND },
  
  // 红石组件
  redstone_torch: { hardness: 0, transparent: true, color: '#FF4500', name: '红石火把', miningLevel: MiningLevel.HAND, isRedstone: true, emitsLight: 7 },
  redstone_block: { hardness: 5, transparent: false, color: '#DC143C', name: '红石块', miningLevel: MiningLevel.WOOD, isRedstone: true },
  redstone_repeater: { hardness: 0, transparent: true, color: '#A0522D', name: '红石中继器', miningLevel: MiningLevel.HAND, isRedstone: true },
  redstone_comparator: { hardness: 0, transparent: true, color: '#D2691E', name: '红石比较器', miningLevel: MiningLevel.HAND, isRedstone: true },
  piston: { hardness: 0.5, transparent: false, color: '#A0A0A0', name: '活塞', miningLevel: MiningLevel.WOOD, isRedstone: true },
  sticky_piston: { hardness: 0.5, transparent: false, color: '#8FBC8F', name: '粘性活塞', miningLevel: MiningLevel.WOOD, isRedstone: true },
  dispenser: { hardness: 3.5, transparent: false, color: '#606060', name: '发射器', miningLevel: MiningLevel.WOOD, isRedstone: true },
  dropper: { hardness: 3.5, transparent: false, color: '#707070', name: '投掷器', miningLevel: MiningLevel.WOOD, isRedstone: true },
  observer: { hardness: 3, transparent: false, color: '#696969', name: '侦测器', miningLevel: MiningLevel.WOOD, isRedstone: true },
  hopper: { hardness: 3, transparent: false, color: '#4A4A4A', name: '漏斗', miningLevel: MiningLevel.WOOD, isRedstone: true },
  lever: { hardness: 0.5, transparent: true, color: '#8B7355', name: '拉杆', miningLevel: MiningLevel.HAND, isRedstone: true },
  stone_button: { hardness: 0.5, transparent: true, color: '#808080', name: '石质按钮', miningLevel: MiningLevel.HAND, isRedstone: true },
  wooden_button: { hardness: 0.5, transparent: true, color: '#8B4513', name: '木质按钮', miningLevel: MiningLevel.HAND, isRedstone: true },
  stone_pressure_plate: { hardness: 0.5, transparent: true, color: '#808080', name: '石质压力板', miningLevel: MiningLevel.HAND, isRedstone: true },
  wooden_pressure_plate: { hardness: 0.5, transparent: true, color: '#8B4513', name: '木质压力板', miningLevel: MiningLevel.HAND, isRedstone: true },
  note_block: { hardness: 0.8, transparent: false, color: '#8B6914', name: '音符盒', miningLevel: MiningLevel.HAND, isRedstone: true },
  redstone_lamp: { hardness: 0.3, transparent: true, color: '#4A3728', name: '红石灯', miningLevel: MiningLevel.HAND, isRedstone: true },
  tnt: { hardness: 0, transparent: false, color: '#FF6347', name: 'TNT', miningLevel: MiningLevel.HAND, isRedstone: true },
  daylight_detector: { hardness: 0.2, transparent: true, color: '#D2691E', name: '阳光探测器', miningLevel: MiningLevel.HAND, isRedstone: true },
  trapped_chest: { hardness: 2.5, transparent: false, color: '#D2691E', name: '陷阱箱', miningLevel: MiningLevel.HAND, isRedstone: true },
  target: { hardness: 0.5, transparent: false, color: '#FF6B6B', name: '标靶', miningLevel: MiningLevel.HAND, isRedstone: true },
  
  // 工具和武器（作为物品）
  wooden_sword: { hardness: 0, transparent: true, color: '#8B4513', name: '木剑', miningLevel: MiningLevel.HAND },
  wooden_pickaxe: { hardness: 0, transparent: true, color: '#8B4513', name: '木镐', miningLevel: MiningLevel.HAND },
  stone_sword: { hardness: 0, transparent: true, color: '#808080', name: '石剑', miningLevel: MiningLevel.HAND },
  stone_pickaxe: { hardness: 0, transparent: true, color: '#808080', name: '石镐', miningLevel: MiningLevel.HAND },
  iron_sword: { hardness: 0, transparent: true, color: '#C0C0C0', name: '铁剑', miningLevel: MiningLevel.HAND },
  iron_pickaxe: { hardness: 0, transparent: true, color: '#C0C0C0', name: '铁镐', miningLevel: MiningLevel.HAND },
  diamond_sword: { hardness: 0, transparent: true, color: '#00CED1', name: '钻石剑', miningLevel: MiningLevel.HAND },
  diamond_pickaxe: { hardness: 0, transparent: true, color: '#00CED1', name: '钻石镐', miningLevel: MiningLevel.HAND },
  netherite_sword: { hardness: 0, transparent: true, color: '#2C2C2C', name: '下界合金剑', miningLevel: MiningLevel.HAND },
  netherite_pickaxe: { hardness: 0, transparent: true, color: '#2C2C2C', name: '下界合金镐', miningLevel: MiningLevel.HAND },
  bow: { hardness: 0, transparent: true, color: '#8B4513', name: '弓', miningLevel: MiningLevel.HAND },
  arrow: { hardness: 0, transparent: true, color: '#8B7355', name: '箭', miningLevel: MiningLevel.HAND },
  shield: { hardness: 0, transparent: true, color: '#8B4513', name: '盾牌', miningLevel: MiningLevel.HAND },
  
  // 其他
  bookshelf: { hardness: 1.5, transparent: false, color: '#8B4513', name: '书架', miningLevel: MiningLevel.HAND },
  hay_block: { hardness: 0.5, transparent: false, color: '#FFD700', name: '干草块', miningLevel: MiningLevel.HAND },
  
  // 村民职业方块
  composter: { hardness: 0.6, transparent: false, color: '#8B6914', name: '堆肥桶', miningLevel: MiningLevel.HAND },
  barrel: { hardness: 2.5, transparent: false, color: '#8B4513', name: '木桶', miningLevel: MiningLevel.HAND },
  smoker: { hardness: 3.5, transparent: false, color: '#5A5A5A', name: '烟熏炉', miningLevel: MiningLevel.WOOD },
  blast_furnace: { hardness: 3.5, transparent: false, color: '#404040', name: '高炉', miningLevel: MiningLevel.WOOD },
  cartography_table: { hardness: 2.5, transparent: false, color: '#8B6914', name: '制图台', miningLevel: MiningLevel.HAND },
  fletching_table: { hardness: 2.5, transparent: false, color: '#D2691E', name: '制箭台', miningLevel: MiningLevel.HAND },
  brewing_stand: { hardness: 0.5, transparent: true, color: '#2F2F2F', name: '酿造台', miningLevel: MiningLevel.HAND },
  cauldron: { hardness: 2, transparent: true, color: '#2F2F2F', name: '炼药锅', miningLevel: MiningLevel.WOOD },
  lectern: { hardness: 2.5, transparent: true, color: '#8B6914', name: '讲台', miningLevel: MiningLevel.HAND },
  loom: { hardness: 2.5, transparent: false, color: '#8B4513', name: '织布机', miningLevel: MiningLevel.HAND },
  stonecutter: { hardness: 3.5, transparent: true, color: '#808080', name: '切石机', miningLevel: MiningLevel.WOOD },
  bell: { hardness: 5, transparent: true, color: '#FFD700', name: '钟', miningLevel: MiningLevel.HAND },
  
  // 末地
  end_stone: { hardness: 3, transparent: false, color: '#F5F5DC', name: '末地石', miningLevel: MiningLevel.WOOD },
  end_stone_bricks: { hardness: 3, transparent: false, color: '#E8E8D0', name: '末地石砖', miningLevel: MiningLevel.WOOD },
  purpur_block: { hardness: 1.5, transparent: false, color: '#9370DB', name: '紫珀块', miningLevel: MiningLevel.WOOD },
  dragon_egg: { hardness: 3, transparent: true, color: '#9932CC', name: '龙蛋', miningLevel: MiningLevel.HAND },
  
  // 其他需要定义的类型
  clay: { hardness: 0.6, transparent: false, color: '#A9A9A9', name: '粘土', miningLevel: MiningLevel.HAND },
  ice: { hardness: 0.5, transparent: true, color: '#A5F2F3', name: '冰', miningLevel: MiningLevel.HAND },
  packed_ice: { hardness: 0.5, transparent: true, color: '#A5F2F3', name: '浮冰', miningLevel: MiningLevel.HAND },
  snow: { hardness: 0.1, transparent: true, color: '#FFFFFF', name: '雪', miningLevel: MiningLevel.HAND },
  snow_block: { hardness: 0.2, transparent: false, color: '#FFFFFF', name: '雪块', miningLevel: MiningLevel.HAND },
  soul_soil: { hardness: 0.5, transparent: false, color: '#3D3D3D', name: '灵魂土', miningLevel: MiningLevel.HAND },
  nether_wart_block: { hardness: 1, transparent: false, color: '#8B0000', name: '下界疣块', miningLevel: MiningLevel.HAND },
  warped_wart_block: { hardness: 1, transparent: false, color: '#00CED1', name: '诡异疣块', miningLevel: MiningLevel.HAND },
  
  // 叶子
  oak_leaves: { hardness: 0.5, transparent: true, color: '#3D8C40', name: '橡树树叶', miningLevel: MiningLevel.HAND },
  birch_leaves: { hardness: 0.5, transparent: true, color: '#6B8E23', name: '白桦树叶', miningLevel: MiningLevel.HAND },
  spruce_leaves: { hardness: 0.5, transparent: true, color: '#2E5D2E', name: '云杉树叶', miningLevel: MiningLevel.HAND },
  jungle_leaves: { hardness: 0.5, transparent: true, color: '#228B22', name: '丛林树叶', miningLevel: MiningLevel.HAND },
  acacia_leaves: { hardness: 0.5, transparent: true, color: '#6B8E23', name: '金合欢树叶', miningLevel: MiningLevel.HAND },
  dark_oak_leaves: { hardness: 0.5, transparent: true, color: '#2E5D2E', name: '深色橡树树叶', miningLevel: MiningLevel.HAND },
  azalea_leaves: { hardness: 0.5, transparent: true, color: '#6B8E23', name: '杜鹃树叶', miningLevel: MiningLevel.HAND },
  
  // 木头变体
  oak_log: { hardness: 2, transparent: false, color: '#8B4513', name: '橡木原木', miningLevel: MiningLevel.HAND },
  birch_log: { hardness: 2, transparent: false, color: '#F5F5DC', name: '白桦原木', miningLevel: MiningLevel.HAND },
  spruce_log: { hardness: 2, transparent: false, color: '#4A3728', name: '云杉原木', miningLevel: MiningLevel.HAND },
  jungle_log: { hardness: 2, transparent: false, color: '#8B6914', name: '丛林原木', miningLevel: MiningLevel.HAND },
  acacia_log: { hardness: 2, transparent: false, color: '#D2691E', name: '金合欢原木', miningLevel: MiningLevel.HAND },
  dark_oak_log: { hardness: 2, transparent: false, color: '#3D2817', name: '深色橡木原木', miningLevel: MiningLevel.HAND },
  
  oak_planks: { hardness: 2, transparent: false, color: '#C4A77D', name: '橡木木板', miningLevel: MiningLevel.HAND },
  birch_planks: { hardness: 2, transparent: false, color: '#E3DCC2', name: '白桦木板', miningLevel: MiningLevel.HAND },
  spruce_planks: { hardness: 2, transparent: false, color: '#8B6914', name: '云杉木板', miningLevel: MiningLevel.HAND },
  jungle_planks: { hardness: 2, transparent: false, color: '#B8860B', name: '丛林木板', miningLevel: MiningLevel.HAND },
  acacia_planks: { hardness: 2, transparent: false, color: '#D2691E', name: '金合欢木板', miningLevel: MiningLevel.HAND },
  dark_oak_planks: { hardness: 2, transparent: false, color: '#4A3728', name: '深色橡木木板', miningLevel: MiningLevel.HAND },
  
  // 农作物
  wheat_seeds: { hardness: 0, transparent: true, color: '#8B4513', name: '小麦种子', miningLevel: MiningLevel.HAND },
  wheat: { hardness: 0, transparent: true, color: '#FFD700', name: '小麦', miningLevel: MiningLevel.HAND },
  carrots: { hardness: 0, transparent: true, color: '#FFA500', name: '胡萝卜', miningLevel: MiningLevel.HAND },
  potatoes: { hardness: 0, transparent: true, color: '#D2691E', name: '马铃薯', miningLevel: MiningLevel.HAND },
  
  // 武器和工具
  wooden_axe: { hardness: 0, transparent: true, color: '#8B4513', name: '木斧', miningLevel: MiningLevel.HAND },
  wooden_shovel: { hardness: 0, transparent: true, color: '#8B4513', name: '木锹', miningLevel: MiningLevel.HAND },
  wooden_hoe: { hardness: 0, transparent: true, color: '#8B4513', name: '木锄', miningLevel: MiningLevel.HAND },
  stone_axe: { hardness: 0, transparent: true, color: '#808080', name: '石斧', miningLevel: MiningLevel.HAND },
  stone_shovel: { hardness: 0, transparent: true, color: '#808080', name: '石锹', miningLevel: MiningLevel.HAND },
  stone_hoe: { hardness: 0, transparent: true, color: '#808080', name: '石锄', miningLevel: MiningLevel.HAND },
  iron_axe: { hardness: 0, transparent: true, color: '#C0C0C0', name: '铁斧', miningLevel: MiningLevel.HAND },
  iron_shovel: { hardness: 0, transparent: true, color: '#C0C0C0', name: '铁锹', miningLevel: MiningLevel.HAND },
  iron_hoe: { hardness: 0, transparent: true, color: '#C0C0C0', name: '铁锄', miningLevel: MiningLevel.HAND },
  gold_sword: { hardness: 0, transparent: true, color: '#FFD700', name: '金剑', miningLevel: MiningLevel.HAND },
  gold_pickaxe: { hardness: 0, transparent: true, color: '#FFD700', name: '金镐', miningLevel: MiningLevel.HAND },
  gold_axe: { hardness: 0, transparent: true, color: '#FFD700', name: '金斧', miningLevel: MiningLevel.HAND },
  gold_shovel: { hardness: 0, transparent: true, color: '#FFD700', name: '金锹', miningLevel: MiningLevel.HAND },
  gold_hoe: { hardness: 0, transparent: true, color: '#FFD700', name: '金锄', miningLevel: MiningLevel.HAND },
  diamond_axe: { hardness: 0, transparent: true, color: '#00CED1', name: '钻石斧', miningLevel: MiningLevel.HAND },
  diamond_shovel: { hardness: 0, transparent: true, color: '#00CED1', name: '钻石锹', miningLevel: MiningLevel.HAND },
  diamond_hoe: { hardness: 0, transparent: true, color: '#00CED1', name: '钻石锄', miningLevel: MiningLevel.HAND },
  netherite_axe: { hardness: 0, transparent: true, color: '#2C2C2C', name: '下界合金斧', miningLevel: MiningLevel.HAND },
  netherite_shovel: { hardness: 0, transparent: true, color: '#2C2C2C', name: '下界合金锹', miningLevel: MiningLevel.HAND },
  netherite_hoe: { hardness: 0, transparent: true, color: '#2C2C2C', name: '下界合金锄', miningLevel: MiningLevel.HAND },
  
  // 护甲
  leather_helmet: { hardness: 0, transparent: true, color: '#8B4513', name: '皮革帽子', miningLevel: MiningLevel.HAND },
  leather_chestplate: { hardness: 0, transparent: true, color: '#8B4513', name: '皮革外套', miningLevel: MiningLevel.HAND },
  leather_leggings: { hardness: 0, transparent: true, color: '#8B4513', name: '皮革裤子', miningLevel: MiningLevel.HAND },
  leather_boots: { hardness: 0, transparent: true, color: '#8B4513', name: '皮革靴子', miningLevel: MiningLevel.HAND },
  iron_helmet: { hardness: 0, transparent: true, color: '#C0C0C0', name: '铁头盔', miningLevel: MiningLevel.HAND },
  iron_chestplate: { hardness: 0, transparent: true, color: '#C0C0C0', name: '铁胸甲', miningLevel: MiningLevel.HAND },
  iron_leggings: { hardness: 0, transparent: true, color: '#C0C0C0', name: '铁护腿', miningLevel: MiningLevel.HAND },
  iron_boots: { hardness: 0, transparent: true, color: '#C0C0C0', name: '铁靴子', miningLevel: MiningLevel.HAND },
  gold_helmet: { hardness: 0, transparent: true, color: '#FFD700', name: '金头盔', miningLevel: MiningLevel.HAND },
  gold_chestplate: { hardness: 0, transparent: true, color: '#FFD700', name: '金胸甲', miningLevel: MiningLevel.HAND },
  gold_leggings: { hardness: 0, transparent: true, color: '#FFD700', name: '金护腿', miningLevel: MiningLevel.HAND },
  gold_boots: { hardness: 0, transparent: true, color: '#FFD700', name: '金靴子', miningLevel: MiningLevel.HAND },
  diamond_helmet: { hardness: 0, transparent: true, color: '#00CED1', name: '钻石头盔', miningLevel: MiningLevel.HAND },
  diamond_chestplate: { hardness: 0, transparent: true, color: '#00CED1', name: '钻石胸甲', miningLevel: MiningLevel.HAND },
  diamond_leggings: { hardness: 0, transparent: true, color: '#00CED1', name: '钻石护腿', miningLevel: MiningLevel.HAND },
  diamond_boots: { hardness: 0, transparent: true, color: '#00CED1', name: '钻石靴子', miningLevel: MiningLevel.HAND },
  netherite_helmet: { hardness: 0, transparent: true, color: '#2C2C2C', name: '下界合金头盔', miningLevel: MiningLevel.HAND },
  netherite_chestplate: { hardness: 0, transparent: true, color: '#2C2C2C', name: '下界合金胸甲', miningLevel: MiningLevel.HAND },
  netherite_leggings: { hardness: 0, transparent: true, color: '#2C2C2C', name: '下界合金护腿', miningLevel: MiningLevel.HAND },
  netherite_boots: { hardness: 0, transparent: true, color: '#2C2C2C', name: '下界合金靴子', miningLevel: MiningLevel.HAND },
  
  // 其他物品
  bowl: { hardness: 0, transparent: true, color: '#8B4513', name: '碗', miningLevel: MiningLevel.HAND },
  brick: { hardness: 0, transparent: true, color: '#B22222', name: '红砖', miningLevel: MiningLevel.HAND },
  nether_brick: { hardness: 0, transparent: true, color: '#2F2F2F', name: '下界砖', miningLevel: MiningLevel.HAND },
  paper: { hardness: 0, transparent: true, color: '#FFFFFF', name: '纸', miningLevel: MiningLevel.HAND },
  book: { hardness: 0, transparent: true, color: '#D2691E', name: '书', miningLevel: MiningLevel.HAND },
  slime_ball: { hardness: 0, transparent: true, color: '#32CD32', name: '粘液球', miningLevel: MiningLevel.HAND },
  blaze_rod: { hardness: 0, transparent: true, color: '#FFD700', name: '烈焰棒', miningLevel: MiningLevel.HAND },
  ghast_tear: { hardness: 0, transparent: true, color: '#F0F8FF', name: '恶魂之泪', miningLevel: MiningLevel.HAND },
  ender_pearl: { hardness: 0, transparent: true, color: '#2E8B57', name: '末影珍珠', miningLevel: MiningLevel.HAND },
  eye_of_ender: { hardness: 0, transparent: true, color: '#2E8B57', name: '末影之眼', miningLevel: MiningLevel.HAND },
  prismarine_shard: { hardness: 0, transparent: true, color: '#66CDAA', name: '海晶碎片', miningLevel: MiningLevel.HAND },
  prismarine_crystals: { hardness: 0, transparent: true, color: '#7FFFD4', name: '海晶砂粒', miningLevel: MiningLevel.HAND },
  
  crossbow: { hardness: 0, transparent: true, color: '#8B4513', name: '弩', miningLevel: MiningLevel.HAND },
  trident: { hardness: 0, transparent: true, color: '#00CED1', name: '三叉戟', miningLevel: MiningLevel.HAND },
  
  // 食物
  raw_chicken: { hardness: 0, transparent: true, color: '#F5F5DC', name: '生鸡肉', miningLevel: MiningLevel.HAND },
  raw_rabbit: { hardness: 0, transparent: true, color: '#D2691E', name: '生兔肉', miningLevel: MiningLevel.HAND },
  raw_cod: { hardness: 0, transparent: true, color: '#FFA07A', name: '生鳕鱼', miningLevel: MiningLevel.HAND },
  raw_salmon: { hardness: 0, transparent: true, color: '#FF6347', name: '生鲑鱼', miningLevel: MiningLevel.HAND },
  cooked_chicken: { hardness: 0, transparent: true, color: '#CD853F', name: '熟鸡肉', miningLevel: MiningLevel.HAND },
  cooked_rabbit: { hardness: 0, transparent: true, color: '#8B4513', name: '熟兔肉', miningLevel: MiningLevel.HAND },
  enchanted_golden_apple: { hardness: 0, transparent: true, color: '#FFD700', name: '附魔金苹果', miningLevel: MiningLevel.HAND },
  cake: { hardness: 0.5, transparent: false, color: '#F5F5DC', name: '蛋糕', miningLevel: MiningLevel.HAND },
  cookie: { hardness: 0, transparent: true, color: '#D2691E', name: '曲奇', miningLevel: MiningLevel.HAND },
  melon_slice: { hardness: 0, transparent: true, color: '#FF6347', name: '西瓜片', miningLevel: MiningLevel.HAND },
  sweet_berries: { hardness: 0, transparent: true, color: '#DC143C', name: '甜浆果', miningLevel: MiningLevel.HAND },
  glow_berries: { hardness: 0, transparent: true, color: '#FFD700', name: '发光浆果', miningLevel: MiningLevel.HAND },
  
  // 树苗和作物
  jungle_sapling: { hardness: 0, transparent: true, color: '#228B22', name: '丛林树苗', miningLevel: MiningLevel.HAND },
  acacia_sapling: { hardness: 0, transparent: true, color: '#D2691E', name: '金合欢树苗', miningLevel: MiningLevel.HAND },
  dark_oak_sapling: { hardness: 0, transparent: true, color: '#4A3728', name: '深色橡树树苗', miningLevel: MiningLevel.HAND },
  beetroot_seeds: { hardness: 0, transparent: true, color: '#8B0000', name: '甜菜种子', miningLevel: MiningLevel.HAND },
  beetroot: { hardness: 0, transparent: true, color: '#8B0000', name: '甜菜根', miningLevel: MiningLevel.HAND },
  melon_seeds: { hardness: 0, transparent: true, color: '#FFD700', name: '西瓜种子', miningLevel: MiningLevel.HAND },
  pumpkin_seeds: { hardness: 0, transparent: true, color: '#FFA500', name: '南瓜种子', miningLevel: MiningLevel.HAND },
  sugar_cane: { hardness: 0, transparent: true, color: '#228B22', name: '甘蔗', miningLevel: MiningLevel.HAND },
  cactus: { hardness: 0.4, transparent: false, color: '#228B22', name: '仙人掌', miningLevel: MiningLevel.HAND },
  bamboo: { hardness: 0, transparent: true, color: '#32CD32', name: '竹子', miningLevel: MiningLevel.HAND },
  
  // 其他材料
  gunpowder: { hardness: 0, transparent: true, color: '#696969', name: '火药', miningLevel: MiningLevel.HAND },
  string: { hardness: 0, transparent: true, color: '#F5F5DC', name: '线', miningLevel: MiningLevel.HAND },
  spider_eye: { hardness: 0, transparent: true, color: '#8B0000', name: '蜘蛛眼', miningLevel: MiningLevel.HAND },
  bone: { hardness: 0, transparent: true, color: '#F5F5DC', name: '骨头', miningLevel: MiningLevel.HAND },
  
  // 红石
  heavy_weighted_pressure_plate: { hardness: 0.5, transparent: true, color: '#FFD700', name: '重质测重压力板', miningLevel: MiningLevel.HAND, isRedstone: true },
  light_weighted_pressure_plate: { hardness: 0.5, transparent: true, color: '#FFA500', name: '轻质测重压力板', miningLevel: MiningLevel.HAND, isRedstone: true },
  tripwire_hook: { hardness: 0, transparent: true, color: '#8B7355', name: '绊线钩', miningLevel: MiningLevel.HAND, isRedstone: true },
  
  // 门和活板门
  oak_door: { hardness: 3, transparent: true, color: '#8B4513', name: '橡木门', miningLevel: MiningLevel.HAND },
  birch_door: { hardness: 3, transparent: true, color: '#F5F5DC', name: '白桦木门', miningLevel: MiningLevel.HAND },
  spruce_door: { hardness: 3, transparent: true, color: '#4A3728', name: '云杉木门', miningLevel: MiningLevel.HAND },
  jungle_door: { hardness: 3, transparent: true, color: '#8B6914', name: '丛林木门', miningLevel: MiningLevel.HAND },
  acacia_door: { hardness: 3, transparent: true, color: '#D2691E', name: '金合欢木门', miningLevel: MiningLevel.HAND },
  dark_oak_door: { hardness: 3, transparent: true, color: '#3D2817', name: '深色橡木门', miningLevel: MiningLevel.HAND },
  iron_door: { hardness: 5, transparent: true, color: '#C0C0C0', name: '铁门', miningLevel: MiningLevel.WOOD },
  wooden_door: { hardness: 3, transparent: true, color: '#8B4513', name: '木门', miningLevel: MiningLevel.HAND },
  
  oak_trapdoor: { hardness: 3, transparent: true, color: '#8B4513', name: '橡木活板门', miningLevel: MiningLevel.HAND },
  birch_trapdoor: { hardness: 3, transparent: true, color: '#F5F5DC', name: '白桦木活板门', miningLevel: MiningLevel.HAND },
  spruce_trapdoor: { hardness: 3, transparent: true, color: '#4A3728', name: '云杉木活板门', miningLevel: MiningLevel.HAND },
  jungle_trapdoor: { hardness: 3, transparent: true, color: '#8B6914', name: '丛林木活板门', miningLevel: MiningLevel.HAND },
  acacia_trapdoor: { hardness: 3, transparent: true, color: '#D2691E', name: '金合欢木活板门', miningLevel: MiningLevel.HAND },
  dark_oak_trapdoor: { hardness: 3, transparent: true, color: '#3D2817', name: '深色橡木活板门', miningLevel: MiningLevel.HAND },
  iron_trapdoor: { hardness: 5, transparent: true, color: '#C0C0C0', name: '铁活板门', miningLevel: MiningLevel.WOOD },
  wooden_trapdoor: { hardness: 3, transparent: true, color: '#8B4513', name: '木活板门', miningLevel: MiningLevel.HAND },
  
  oak_fence_gate: { hardness: 2, transparent: true, color: '#8B4513', name: '橡木栅栏门', miningLevel: MiningLevel.HAND },
  birch_fence_gate: { hardness: 2, transparent: true, color: '#F5F5DC', name: '白桦木栅栏门', miningLevel: MiningLevel.HAND },
  spruce_fence_gate: { hardness: 2, transparent: true, color: '#4A3728', name: '云杉木栅栏门', miningLevel: MiningLevel.HAND },
  jungle_fence_gate: { hardness: 2, transparent: true, color: '#8B6914', name: '丛林木栅栏门', miningLevel: MiningLevel.HAND },
  acacia_fence_gate: { hardness: 2, transparent: true, color: '#D2691E', name: '金合欢木栅栏门', miningLevel: MiningLevel.HAND },
  dark_oak_fence_gate: { hardness: 2, transparent: true, color: '#3D2817', name: '深色橡木栅栏门', miningLevel: MiningLevel.HAND },
  
  // 光源
  torch: { hardness: 0, transparent: true, color: '#FFD700', name: '火把', miningLevel: MiningLevel.HAND, emitsLight: 14 },
  soul_torch: { hardness: 0, transparent: true, color: '#4ECDC4', name: '灵魂火把', miningLevel: MiningLevel.HAND, emitsLight: 10 },
  redstone_torch_lit: { hardness: 0, transparent: true, color: '#FF6347', name: '红石火把(亮)', miningLevel: MiningLevel.HAND, isRedstone: true, emitsLight: 7 },
  lantern: { hardness: 3.5, transparent: true, color: '#FFA500', name: '灯笼', miningLevel: MiningLevel.HAND, emitsLight: 15 },
  soul_lantern: { hardness: 3.5, transparent: true, color: '#4ECDC4', name: '灵魂灯笼', miningLevel: MiningLevel.HAND, emitsLight: 10 },
  sea_lantern: { hardness: 0.3, transparent: true, color: '#E0FFFF', name: '海晶灯', miningLevel: MiningLevel.HAND, emitsLight: 15 },
  jack_o_lantern: { hardness: 1, transparent: false, color: '#FF8C00', name: '南瓜灯', miningLevel: MiningLevel.HAND, emitsLight: 15 },
  shroomlight: { hardness: 1, transparent: true, color: '#FF8C00', name: '菌光体', miningLevel: MiningLevel.HAND, emitsLight: 15 },
  ochre_froglight: { hardness: 0.3, transparent: true, color: '#FFF8DC', name: '赭黄蛙明灯', miningLevel: MiningLevel.HAND, emitsLight: 15 },
  verdant_froglight: { hardness: 0.3, transparent: true, color: '#98FB98', name: '青翠蛙明灯', miningLevel: MiningLevel.HAND, emitsLight: 15 },
  pearlescent_froglight: { hardness: 0.3, transparent: true, color: '#DDA0DD', name: '珠光蛙明灯', miningLevel: MiningLevel.HAND, emitsLight: 15 },
  
  // 花
  flower: { hardness: 0, transparent: true, color: '#FF69B4', name: '花', miningLevel: MiningLevel.HAND },
  dandelion: { hardness: 0, transparent: true, color: '#FFD700', name: '蒲公英', miningLevel: MiningLevel.HAND },
  poppy: { hardness: 0, transparent: true, color: '#FF0000', name: '罂粟', miningLevel: MiningLevel.HAND },
  blue_orchid: { hardness: 0, transparent: true, color: '#4169E1', name: '兰花', miningLevel: MiningLevel.HAND },
  allium: { hardness: 0, transparent: true, color: '#DA70D6', name: '绒球葱', miningLevel: MiningLevel.HAND },
  azure_bluet: { hardness: 0, transparent: true, color: '#F0F8FF', name: '蓝花美耳草', miningLevel: MiningLevel.HAND },
  tulip: { hardness: 0, transparent: true, color: '#FF6347', name: '郁金香', miningLevel: MiningLevel.HAND },
  oxeye_daisy: { hardness: 0, transparent: true, color: '#FFFFF0', name: '滨菊', miningLevel: MiningLevel.HAND },
  cornflower: { hardness: 0, transparent: true, color: '#6495ED', name: '矢车菊', miningLevel: MiningLevel.HAND },
  lily_of_the_valley: { hardness: 0, transparent: true, color: '#FFFFFF', name: '铃兰', miningLevel: MiningLevel.HAND },
  sunflower: { hardness: 0, transparent: true, color: '#FFD700', name: '向日葵', miningLevel: MiningLevel.HAND },
  lilac: { hardness: 0, transparent: true, color: '#C8A2C8', name: '丁香', miningLevel: MiningLevel.HAND },
  rose_bush: { hardness: 0, transparent: true, color: '#FF0000', name: '玫瑰丛', miningLevel: MiningLevel.HAND },
  peony: { hardness: 0, transparent: true, color: '#FFB6C1', name: '牡丹', miningLevel: MiningLevel.HAND },
  
  // 植物
  lily_pad: { hardness: 0, transparent: true, color: '#228B22', name: '睡莲', miningLevel: MiningLevel.HAND },
  sea_pickle: { hardness: 0, transparent: true, color: '#32CD32', name: '海泡菜', miningLevel: MiningLevel.HAND },
  kelp: { hardness: 0, transparent: true, color: '#228B22', name: '海带', miningLevel: MiningLevel.HAND },
  seagrass: { hardness: 0, transparent: true, color: '#32CD32', name: '海草', miningLevel: MiningLevel.HAND },
  dead_bush: { hardness: 0, transparent: true, color: '#8B4513', name: '枯萎的灌木', miningLevel: MiningLevel.HAND },
  fern: { hardness: 0, transparent: true, color: '#228B22', name: '蕨', miningLevel: MiningLevel.HAND },
  large_fern: { hardness: 0, transparent: true, color: '#228B22', name: '大型蕨', miningLevel: MiningLevel.HAND },
  grass_plant: { hardness: 0, transparent: true, color: '#32CD32', name: '草', miningLevel: MiningLevel.HAND },
  tall_grass: { hardness: 0, transparent: true, color: '#228B22', name: '高草丛', miningLevel: MiningLevel.HAND },
  vine: { hardness: 0.2, transparent: true, color: '#228B22', name: '藤蔓', miningLevel: MiningLevel.HAND },
  
  // 蘑菇
  mushroom: { hardness: 0, transparent: true, color: '#8B4513', name: '蘑菇', miningLevel: MiningLevel.HAND },
  brown_mushroom: { hardness: 0, transparent: true, color: '#8B4513', name: '棕色蘑菇', miningLevel: MiningLevel.HAND },
  red_mushroom: { hardness: 0, transparent: true, color: '#DC143C', name: '红色蘑菇', miningLevel: MiningLevel.HAND },
  mushroom_stem: { hardness: 0.2, transparent: false, color: '#F5F5DC', name: '蘑菇柄', miningLevel: MiningLevel.HAND },
  mushroom_block: { hardness: 0.2, transparent: false, color: '#8B0000', name: '蘑菇块', miningLevel: MiningLevel.HAND },
  
  // 下界
  crimson_stem: { hardness: 2, transparent: false, color: '#8B0000', name: '绯红菌柄', miningLevel: MiningLevel.HAND },
  warped_stem: { hardness: 2, transparent: false, color: '#00CED1', name: '诡异菌柄', miningLevel: MiningLevel.HAND },
  crimson_planks: { hardness: 2, transparent: false, color: '#A0522D', name: '绯红木板', miningLevel: MiningLevel.HAND },
  warped_planks: { hardness: 2, transparent: false, color: '#20B2AA', name: '诡异木板', miningLevel: MiningLevel.HAND },
  crimson_nylium: { hardness: 0.4, transparent: false, color: '#8B0000', name: '绯红菌岩', miningLevel: MiningLevel.HAND },
  warped_nylium: { hardness: 0.4, transparent: false, color: '#00CED1', name: '诡异菌岩', miningLevel: MiningLevel.HAND },
  weeping_vines: { hardness: 0, transparent: true, color: '#8B0000', name: '垂泪藤', miningLevel: MiningLevel.HAND },
  twisting_vines: { hardness: 0, transparent: true, color: '#00CED1', name: '缠怨藤', miningLevel: MiningLevel.HAND },
  
  nether_bricks: { hardness: 2, transparent: false, color: '#2F2F2F', name: '下界砖块', miningLevel: MiningLevel.WOOD },
  red_nether_bricks: { hardness: 2, transparent: false, color: '#8B0000', name: '红色下界砖块', miningLevel: MiningLevel.WOOD },
  nether_brick_fence: { hardness: 2, transparent: true, color: '#2F2F2F', name: '下界砖栅栏', miningLevel: MiningLevel.WOOD },
  nether_brick_slab: { hardness: 2, transparent: true, color: '#2F2F2F', name: '下界砖台阶', miningLevel: MiningLevel.WOOD },
  nether_brick_stairs: { hardness: 2, transparent: true, color: '#2F2F2F', name: '下界砖楼梯', miningLevel: MiningLevel.WOOD },
  
  soul_fire: { hardness: 0, transparent: true, color: '#4ECDC4', name: '灵魂火', miningLevel: MiningLevel.HAND, emitsLight: 10 },
  fire: { hardness: 0, transparent: true, color: '#FF4500', name: '火', miningLevel: MiningLevel.HAND, emitsLight: 15 },
  purpur_pillar: { hardness: 1.5, transparent: false, color: '#9370DB', name: '紫珀柱', miningLevel: MiningLevel.WOOD },
  chorus_plant: { hardness: 0.4, transparent: false, color: '#9370DB', name: '紫颂植株', miningLevel: MiningLevel.HAND },
  chorus_flower: { hardness: 0.4, transparent: false, color: '#DDA0DD', name: '紫颂花', miningLevel: MiningLevel.HAND },
  dragon_head: { hardness: 1, transparent: true, color: '#2E8B57', name: '龙首', miningLevel: MiningLevel.HAND },
  
  // 其他方块
  spawner: { hardness: 5, transparent: true, color: '#2F2F2F', name: '刷怪笼', miningLevel: MiningLevel.HAND },
  sponge: { hardness: 0.6, transparent: false, color: '#F0E68C', name: '海绵', miningLevel: MiningLevel.HAND },
  wet_sponge: { hardness: 0.6, transparent: false, color: '#9ACD32', name: '湿海绵', miningLevel: MiningLevel.HAND },
  cobweb: { hardness: 4, transparent: true, color: '#F5F5F5', name: '蜘蛛网', miningLevel: MiningLevel.HAND },
  
  shulker_box: { hardness: 2, transparent: false, color: '#9370DB', name: '潜影盒', miningLevel: MiningLevel.HAND },
  white_shulker_box: { hardness: 2, transparent: false, color: '#FFFFFF', name: '白色潜影盒', miningLevel: MiningLevel.HAND },
  orange_shulker_box: { hardness: 2, transparent: false, color: '#FFA500', name: '橙色潜影盒', miningLevel: MiningLevel.HAND },
  magenta_shulker_box: { hardness: 2, transparent: false, color: '#FF00FF', name: '品红色潜影盒', miningLevel: MiningLevel.HAND },
  light_blue_shulker_box: { hardness: 2, transparent: false, color: '#87CEEB', name: '淡蓝色潜影盒', miningLevel: MiningLevel.HAND },
  yellow_shulker_box: { hardness: 2, transparent: false, color: '#FFFF00', name: '黄色潜影盒', miningLevel: MiningLevel.HAND },
  lime_shulker_box: { hardness: 2, transparent: false, color: '#32CD32', name: '黄绿色潜影盒', miningLevel: MiningLevel.HAND },
  pink_shulker_box: { hardness: 2, transparent: false, color: '#FFB6C1', name: '粉红色潜影盒', miningLevel: MiningLevel.HAND },
  gray_shulker_box: { hardness: 2, transparent: false, color: '#808080', name: '灰色潜影盒', miningLevel: MiningLevel.HAND },
  light_gray_shulker_box: { hardness: 2, transparent: false, color: '#D3D3D3', name: '淡灰色潜影盒', miningLevel: MiningLevel.HAND },
  cyan_shulker_box: { hardness: 2, transparent: false, color: '#00FFFF', name: '青色潜影盒', miningLevel: MiningLevel.HAND },
  purple_shulker_box: { hardness: 2, transparent: false, color: '#9370DB', name: '紫色潜影盒', miningLevel: MiningLevel.HAND },
  blue_shulker_box: { hardness: 2, transparent: false, color: '#0000FF', name: '蓝色潜影盒', miningLevel: MiningLevel.HAND },
  brown_shulker_box: { hardness: 2, transparent: false, color: '#8B4513', name: '棕色潜影盒', miningLevel: MiningLevel.HAND },
  green_shulker_box: { hardness: 2, transparent: false, color: '#008000', name: '绿色潜影盒', miningLevel: MiningLevel.HAND },
  red_shulker_box: { hardness: 2, transparent: false, color: '#FF0000', name: '红色潜影盒', miningLevel: MiningLevel.HAND },
  black_shulker_box: { hardness: 2, transparent: false, color: '#000000', name: '黑色潜影盒', miningLevel: MiningLevel.HAND },
  
  // 更多方块
  chipped_anvil: { hardness: 5, transparent: false, color: '#404040', name: '开裂的铁砧', miningLevel: MiningLevel.WOOD },
  damaged_anvil: { hardness: 5, transparent: false, color: '#404040', name: '损坏的铁砧', miningLevel: MiningLevel.WOOD },
  grindstone: { hardness: 2, transparent: true, color: '#808080', name: '砂轮', miningLevel: MiningLevel.WOOD },
  smithing_table: { hardness: 2.5, transparent: false, color: '#8B6914', name: '锻造台', miningLevel: MiningLevel.HAND },
  
  lodestone: { hardness: 3, transparent: false, color: '#4682B4', name: '磁石', miningLevel: MiningLevel.WOOD },
  respawn_anchor: { hardness: 50, transparent: false, color: '#2F2F2F', name: '重生锚', miningLevel: MiningLevel.DIAMOND },
  bee_nest: { hardness: 0.3, transparent: false, color: '#D2691E', name: '蜂巢', miningLevel: MiningLevel.HAND },
  beehive: { hardness: 0.6, transparent: false, color: '#8B6914', name: '蜂箱', miningLevel: MiningLevel.HAND },
  
  // 空气
  air: { hardness: 0, transparent: true, color: '#000000', name: '空气', miningLevel: MiningLevel.HAND }
}

// 获取方块颜色
export const getBlockColor = (type: BlockType): string => {
  return BLOCK_PROPERTIES[type]?.color || '#FFFFFF'
}

// 获取方块属性
export const getBlockProperty = (type: BlockType): BlockProperties | undefined => {
  return BLOCK_PROPERTIES[type]
}

// 检查工具是否可以挖掘方块
export function canMineBlock(blockType: BlockType, toolLevel: MiningLevel): boolean {
  const block = BLOCK_PROPERTIES[blockType]
  if (!block) return false
  return toolLevel >= block.miningLevel
}

// 获取方块掉落物
export function getBlockDrop(blockType: BlockType, toolLevel: MiningLevel): BlockType | null {
  const block = BLOCK_PROPERTIES[blockType]
  if (!block) return null
  
  // 如果挖掘等级不够，不掉落任何东西
  if (toolLevel < block.miningLevel) {
    return null
  }
  
  // 返回指定掉落物，或者原方块
  return block.dropItem || blockType
}

// 是否为有效方块（可放置）
export function isPlaceableBlock(type: BlockType): boolean {
  const itemTypes: BlockType[] = [
    'raw_porkchop', 'raw_beef', 'raw_mutton', 'raw_chicken', 'raw_rabbit', 'raw_cod', 'raw_salmon',
    'cooked_porkchop', 'cooked_beef', 'cooked_mutton', 'cooked_chicken', 'cooked_rabbit',
    'leather', 'coal', 'charcoal', 'iron_ingot', 'gold_ingot', 'diamond', 'emerald', 'redstone_dust',
    'lapis_lazuli', 'quartz', 'netherite_ingot', 'netherite_scrap', 'stick', 'flint', 'brick',
    'nether_brick', 'paper', 'book', 'slime_ball', 'blaze_rod', 'ghast_tear', 'ender_pearl',
    'eye_of_ender', 'prismarine_shard', 'prismarine_crystals', 'feather', 'egg', 'bone',
    'gunpowder', 'string', 'spider_eye', 'bowl', 'apple', 'golden_apple', 'enchanted_golden_apple',
    'bread', 'cookie', 'melon_slice', 'sweet_berries', 'glow_berries',
    // 工具
    'wooden_sword', 'wooden_pickaxe', 'wooden_axe', 'wooden_shovel', 'wooden_hoe',
    'stone_sword', 'stone_pickaxe', 'stone_axe', 'stone_shovel', 'stone_hoe',
    'iron_sword', 'iron_pickaxe', 'iron_axe', 'iron_shovel', 'iron_hoe',
    'gold_sword', 'gold_pickaxe', 'gold_axe', 'gold_shovel', 'gold_hoe',
    'diamond_sword', 'diamond_pickaxe', 'diamond_axe', 'diamond_shovel', 'diamond_hoe',
    'netherite_sword', 'netherite_pickaxe', 'netherite_axe', 'netherite_shovel', 'netherite_hoe',
    'bow', 'arrow', 'crossbow', 'trident', 'shield',
    // 护甲
    'leather_helmet', 'leather_chestplate', 'leather_leggings', 'leather_boots',
    'iron_helmet', 'iron_chestplate', 'iron_leggings', 'iron_boots',
    'gold_helmet', 'gold_chestplate', 'gold_leggings', 'gold_boots',
    'diamond_helmet', 'diamond_chestplate', 'diamond_leggings', 'diamond_boots',
    'netherite_helmet', 'netherite_chestplate', 'netherite_leggings', 'netherite_boots',
    // 种子
    'wheat_seeds', 'beetroot_seeds', 'melon_seeds', 'pumpkin_seeds'
  ]
  return !itemTypes.includes(type)
}

// 检查是否是红石方块
export function isRedstoneBlock(type: BlockType): boolean {
  return BLOCK_PROPERTIES[type]?.isRedstone || false
}

// 检查是否发光
export function getBlockLightEmission(type: BlockType): number {
  return BLOCK_PROPERTIES[type]?.emitsLight || 0
}
