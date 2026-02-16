# Minecraft Web 移动端控制设计方案

## 📱 需求概述

**目标**: 支持 iPhone 14 Pro 和 iPad 横屏游戏

**优先级**: P0 (最高)

---

## 1. iPhone 14 Pro 支持

### 1.1 技术现状
| 项目 | 状态 |
|------|------|
| 黑屏问题 | ✅ 已修复 (powerPreference: "default") |
| WebGL 支持 | ✅ 已检测 |
| 触摸控制 | ❌ 未实现 |

### 1.2 触摸控制方案

#### 虚拟摇杆 (左下角)
```
┌─────────────────────────────┐
│                             │
│      3D 游戏画面             │
│                             │
│                             │
│  ┌─────┐           ┌──────┐ │
│  │  ●  │           │  ⬆️  │ │
│  │ ○○○ │           │⬅️⬇️➡️│ │
│  └─────┘           └──────┘ │
│  移动摇杆          跳跃/视角 │
└─────────────────────────────┘
```

**左摇杆**: 控制玩家移动 (WASD)
- 范围: 屏幕左下角 150x150px
- 最大位移: 50px
- 灵敏度: 线性映射

**右区域**: 控制视角 + 跳跃
- 滑动: 旋转视角 (鼠标移动)
- 点击上半部: 跳跃 (空格)

#### 动作按钮 (右下角)
```
┌─────────┐
│  ⛏️ 挖掘 │  左键 - 长按挖掘
│  🧱 放置 │  右键 - 点击放置
│  📦 背包 │  E键 - 打开合成
│  ⏸️ 暂停 │  ESC - 释放鼠标
└─────────┘
```

#### 快捷栏 (底部)
```
┌─────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┐
│  1  │  2  │  3  │  4  │  5  │  6  │  7  │  8  │  9  │
│ 🟫  │ ⬜  │ ⬛  │ 🟨  │     │     │     │     │     │
└─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┘
```
- 点击切换选中槽位
- 高亮当前选中

---

## 2. iPad 横屏支持

### 2.1 横屏检测
```typescript
// 强制横屏或使用自适应
const isLandscape = window.innerWidth > window.innerHeight;
const isIPad = /iPad/.test(navigator.userAgent);

if (isIPad && !isLandscape) {
  // 提示用户旋转设备
  showRotatePrompt();
}
```

### 2.2 横屏布局
```
┌────────────────────────────────────────────────────────┐
│  ⏸️  │          Minecraft Web          │ ❤️20 🍗20 │
├────────────────────────────────────────────────────────┤
│                                                        │
│                                                        │
│                    3D 游戏画面                          │
│                                                        │
│                                                        │
├────────────────────────────────────────────────────────┤
│  ┌─────┐                              ┌──────┐        │
│  │  ●  │                              │ ⛏️ 🧱│        │
│  │ ○○○ │                              │ 📦 ⏸️│        │
│  └─────┘                              └──────┘        │
│  移动摇杆                              动作按钮        │
├────────────────────────────────────────────────────────┤
│  1 │ 2 │ 3 │ 4 │ 5 │ 6 │ 7 │ 8 │ 9 │  视角滑动区域   │
└────────────────────────────────────────────────────────┘
```

### 2.3 UI 适配
- **iPad 分辨率**: 针对 2388x1668 (11寸) 和 2732x2048 (12.9寸) 优化
- **按钮大小**: 最小 60x60px (触控友好)
- **间距**: 按钮间距 16px

---

## 3. 组件设计

### 3.1 TouchControls 组件
```typescript
interface TouchControlsProps {
  onMove: (x: number, y: number) => void;  // -1 to 1
  onLook: (deltaX: number, deltaY: number) => void;
  onJump: () => void;
  onMine: () => void;
  onPlace: () => void;
  onOpenInventory: () => void;
  onPause: () => void;
  onSlotChange: (slot: number) => void;
  selectedSlot: number;
  inventory: InventoryItem[];
}
```

### 3.2 VirtualJoystick 组件
```typescript
interface VirtualJoystickProps {
  onChange: (x: number, y: number) => void;
  onEnd: () => void;
  position: 'left' | 'right';
  size?: number;  // default: 150
  maxDistance?: number;  // default: 50
}
```

### 3.3 ActionButtons 组件
```typescript
interface ActionButtonsProps {
  onMine: () => void;
  onPlace: () => void;
  onJump: () => void;
  onInventory: () => void;
  layout: 'portrait' | 'landscape';
}
```

---

## 4. 性能优化

### 4.1 移动端优化
```typescript
// Canvas 配置
const mobileConfig = {
  dpr: Math.min(window.devicePixelRatio, 2),  // 限制像素比
  antialias: false,  // 移动端禁用抗锯齿
  powerPreference: 'default',  // iOS 必须
  alpha: true,
};

// Three.js 优化
const mobileRenderSettings = {
  shadows: false,  // 移动端禁用阴影
  maxLights: 2,    // 限制光源数量
  drawDistance: 64, // 减少渲染距离
};
```

### 4.2 触摸事件优化
- 使用 `touch-action: none` 防止页面滚动
- 节流触摸事件 (16ms)
- 防止双击缩放

---

## 5. 文件结构

```
src/
├── mobile/
│   ├── TouchControls.tsx       # 主触摸控制组件
│   ├── VirtualJoystick.tsx     # 虚拟摇杆
│   ├── ActionButtons.tsx       # 动作按钮
│   ├── HotbarMobile.tsx        # 移动端快捷栏
│   └── touchUtils.ts           # 触摸工具函数
├── hooks/
│   └── useTouchControls.ts     # 触摸控制 Hook
└── styles/
    └── mobile.css              # 移动端样式
```

---

## 6. 实现步骤

### Phase 1: 基础触摸控制
1. 创建 VirtualJoystick 组件
2. 创建 ActionButtons 组件
3. 在 App.tsx 中集成 (仅移动端显示)

### Phase 2: iPad 横屏适配
1. 添加横屏检测
2. 优化横屏布局
3. 调整 UI 大小

### Phase 3: 完整功能
1. 测试所有游戏功能
2. 性能优化
3. 用户体验调优

---

## 7. 验收标准

### iPhone 14 Pro
- [ ] 游戏正常加载，无黑屏
- [ ] 虚拟摇杆控制移动流畅
- [ ] 可以挖掘和放置方块
- [ ] 可以切换快捷栏
- [ ] 帧率稳定在 30fps+

### iPad 横屏
- [ ] 横屏模式正常显示
- [ ] 所有触摸控制功能正常
- [ ] UI 布局合理，按钮大小合适
- [ ] 帧率稳定在 30fps+

---

*设计文档版本: 1.0*
*创建时间: 2026-02-16*
