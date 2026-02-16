# Minecraft Web Phase 1 需求文档

## 🎯 目标
开发 Minecraft Web Phase 1 MVP 版本。

## 🎮 Phase 1 核心功能 (P0)

### 1. 基础方块系统 ✅
- 草方块、泥土、石头、木头、沙子
- 每种方块的视觉表现（颜色区分）
- 方块属性：硬度、是否透明等

### 2. 3D 世界渲染 ✅
- 使用 Three.js 渲染 3D 场景
- 第一人称视角 (鼠标控制视角)
- 简单的地形生成 (平地 + 随机方块 + 树木)

### 3. 玩家控制 ✅
- WASD 移动
- 空格键跳跃
- 重力物理系统 (下落、落地)
- 碰撞检测

### 4. 挖掘与放置 ✅
- 左键点击挖掘方块
- 右键点击放置方块
- 准心瞄准系统

### 5. 背包系统 ✅
- 36格背包存储
- 9格快捷栏 (底部显示)
- 数字键 1-9 切换选中方块

## 🛠️ 技术栈
- React 18 + TypeScript
- Three.js (3D 渲染)
- @react-three/fiber (React 集成)
- @react-three/cannon (物理引擎)
- Zustand (状态管理)

## 📁 项目结构
```
workspace/minecraft-web/
├── src/
│   ├── engine/         # 游戏引擎 (gameStore.ts)
│   ├── world/          # 世界/地形 (World.tsx)
│   ├── blocks/         # 方块定义 (Block.ts, BlockInstances.tsx)
│   ├── player/         # 玩家控制 (Player.tsx)
│   └── inventory/      # 背包系统 (Hotbar.tsx)
├── public/
├── dist/               # 构建输出
└── docs/
    └── phase1-requirements.md
```

## ✅ 完成标准 (全部达成)
- [x] 创建项目脚手架 (Vite + React + TypeScript + Three.js)
- [x] 实现基础方块渲染
- [x] 实现第一人称视角控制
- [x] 实现玩家移动和跳跃
- [x] 实现挖掘和放置方块
- [x] 实现背包和快捷栏 UI
- [x] 构建成功，可运行
- [x] 更新 MEMORY.md 记录进展
- [x] 飞书通知 Tiger 完成

## 🎮 游戏控制
| 按键 | 功能 |
|------|------|
| W/A/S/D | 移动 |
| 空格 | 跳跃 |
| 鼠标 | 视角控制 |
| 左键 | 挖掘方块 |
| 右键 | 放置方块 |
| 1-9 | 切换快捷栏 |
| ESC | 释放鼠标 |
| 点击屏幕 | 开始游戏/锁定鼠标 |

## 🌟 功能特点
1. **地形生成**：自动生成包含草地、泥土、石头的地形，以及随机分布的树木
2. **物理系统**：使用 Cannon.js 实现重力、跳跃和碰撞检测
3. **批量渲染**：使用 InstancedMesh 优化大量方块的渲染性能
4. **方块系统**：5种不同类型的方块，各有独特的颜色和属性
5. **背包系统**：完整的物品收集和放置逻辑

## 📦 构建与运行
```bash
npm install
npm run build
npm run dev
```

## 🔗 部署
- Vercel: https://minecraft-web-one.vercel.app

---
完成时间: 2026-02-16
