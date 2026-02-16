// 设备检测工具

export const isMobile = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

export const isIOS = (): boolean => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
}

export const isSafari = (): boolean => {
  const ua = navigator.userAgent
  return /^((?!chrome|android).)*safari/i.test(ua) && !/CriOS|FxiOS/.test(ua)
}

// 检测 WebGL 支持
export const getWebGLContext = (): RenderingContext | null => {
  const canvas = document.createElement('canvas')
  
  // 尝试获取 WebGL2 上下文
  const gl2 = canvas.getContext('webgl2')
  if (gl2) return gl2
  
  // 尝试获取 WebGL 上下文
  return canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
}

export const isWebGLSupported = (): boolean => {
  return !!getWebGLContext()
}

// 获取推荐的 Canvas 配置
export const getRecommendedGLConfig = () => {
  const mobile = isMobile()
  const ios = isIOS()
  
  return {
    // iOS 设备建议使用 high-performance
    powerPreference: ios ? 'high-performance' : 'default' as WebGLPowerPreference,
    // 移动端禁用抗锯齿以提高性能
    antialias: !mobile,
    // 启用 alpha 通道
    alpha: true,
    // 深度缓冲
    depth: true,
    // 模板缓冲
    stencil: false,
    // 预乘 alpha
    premultipliedAlpha: true,
    // 保留绘图缓冲（对 toDataURL 有用）
    preserveDrawingBuffer: false,
    // iOS 建议使用较低的最大缓冲区
    ...(ios && {
      // iOS Safari 特定的优化
      failIfMajorPerformanceCaveat: false,
    }),
  }
}

// 移动端特定的性能优化
export const getMobileOptimizations = () => {
  if (!isMobile()) return {}
  
  return {
    // 降低像素比例以提高性能
    dpr: Math.min(window.devicePixelRatio, 2),
    // 限制帧率
    frameLoop: 'always' as const,
    // 减少阴影质量
    shadows: false,
  }
}

// iOS 特定的修复
export const applyIOSFixes = () => {
  if (!isIOS()) return
  
  // 防止 iOS 橡皮筋效果
  document.body.addEventListener('touchmove', (e) => {
    if (e.target === document.body || (e.target as HTMLElement).tagName === 'CANVAS') {
      e.preventDefault()
    }
  }, { passive: false })
  
  // 防止双击缩放
  let lastTouchEnd = 0
  document.addEventListener('touchend', (e) => {
    const now = Date.now()
    if (now - lastTouchEnd <= 300) {
      e.preventDefault()
    }
    lastTouchEnd = now
  }, false)
}
