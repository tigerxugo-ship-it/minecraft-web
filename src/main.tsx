import React, { Component, ErrorInfo, ReactNode } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// 错误边界组件
interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#1a1a1a',
          color: 'white',
          fontFamily: 'Arial, sans-serif',
          textAlign: 'center',
          padding: '20px',
          zIndex: 9999
        }}>
          <div>
            <h2 style={{ marginBottom: '20px' }}>⚠️ 应用程序错误</h2>
            <p>加载过程中发生错误</p>
            <p style={{ fontSize: '14px', color: '#aaa', marginTop: '20px' }}>
              建议：刷新页面或使用其他浏览器
            </p>
            <button 
              onClick={() => window.location.reload()}
              style={{
                marginTop: '20px',
                padding: '10px 20px',
                fontSize: '16px',
                background: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              刷新页面
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// WebGL 支持检测
function checkWebGLSupport(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    return !!gl;
  } catch (e) {
    return false;
  }
}

// 检测 Safari 浏览器
function isSafari(): boolean {
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}

// 渲染应用
const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error('Root element not found');
} else if (!checkWebGLSupport()) {
  rootElement.innerHTML = `
    <div style="
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #1a1a1a;
      color: white;
      font-family: Arial, sans-serif;
      text-align: center;
      padding: 20px;
    ">
      <div>
        <h2 style="margin-bottom: 20px;">🎮 WebGL 不可用</h2>
        <p>您的浏览器不支持 WebGL，无法运行 3D 应用。</p>
        <p style="font-size: 14px; color: #aaa; margin-top: 20px;">
          请尝试：<br/>
          • 使用 Chrome 或 Firefox 浏览器<br/>
          • 检查是否禁用了硬件加速<br/>
          • 在浏览器设置中启用 WebGL
        </p>
      </div>
    </div>
  `;
} else {
  // 添加 Safari 特定日志
  if (isSafari()) {
    console.log('Safari detected - applying compatibility fixes');
  }

  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>,
  );
}
