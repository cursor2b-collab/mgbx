# 📱 底部菜单栏容器样式指南

## 🎨 样式概览

新增了 `.menu-bar-wrapper` 类，用于创建固定在底部的导航栏容器。

## 📋 样式规格

### 基础布局
```css
.menu-bar-wrapper {
    display: flex;              /* Flex布局 */
    justify-content: center;     /* 主轴居中对齐 */
    position: fixed;             /* 固定定位 */
    bottom: 0;                   /* 固定在底部 */
    width: 100%;                 /* 全宽 */
    height: 90px;                /* 高度90px */
    padding-top: 12px;           /* 顶部内边距12px */
    gap: 8px;                    /* 子元素水平间隔8px */
    z-index: 999;                /* 层级999 */
}
```

### 视觉效果
```css
/* 深色渐变背景 */
background: linear-gradient(to top, 
    rgba(13, 13, 13, 0.8) 0%,    /* 底部：深色半透明 */
    transparent 100%              /* 顶部：完全透明 */
);
```

### 动画过渡
```css
/* 平滑过渡效果 - 0.8秒 */
transition: 
    transform 0.8s ease,         /* 位置变化 */
    scale 0.8s ease,             /* 缩放变化 */
    opacity 0.8s ease;           /* 透明度变化 */
```

## 🚀 使用方法

### 方法1：替换现有容器

如果想将现有的 `aiz-mobile-bottom-nav` 替换为新样式：

```tsx
// 之前
<div className="aiz-mobile-bottom-nav d-xl-none">
  {/* 内容 */}
</div>

// 之后
<div className="menu-bar-wrapper d-xl-none">
  {/* 内容 */}
</div>
```

### 方法2：嵌套使用

保持现有结构，添加外层容器：

```tsx
<div className="menu-bar-wrapper">
  <div className="aiz-mobile-bottom-nav">
    {/* 现有内容 */}
  </div>
</div>
```

### 方法3：独立新组件

创建一个新的底部菜单栏组件：

```tsx
export function SimpleBottomNav() {
  return (
    <div className="menu-bar-wrapper">
      <button>首页</button>
      <button>行情</button>
      <button>交易</button>
      <button>资产</button>
    </div>
  );
}
```

## 🎬 视觉效果

### 渐变背景
```
顶部（透明）
    ↓
    │  渐变区域
    │  (90px高度)
    ↓
底部（深色 rgba(13, 13, 13, 0.8)）
═══════════════════════════════
```

### 布局结构
```
┌─────────────────────────────────────────┐
│                                         │ ← 12px padding-top
│  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐   │
│  │按钮1│  │按钮2│  │按钮3│  │按钮4│   │ ← 居中对齐
│  └─────┘  └─────┘  └─────┘  └─────┘   │
│     ↑ 8px间隔                          │
└─────────────────────────────────────────┘
         ↑ 固定在屏幕底部（90px高度）
```

## 🔧 自定义选项

### 调整高度
```css
.menu-bar-wrapper {
    height: 100px;  /* 改为100px */
}
```

### 调整背景渐变
```css
/* 更深色 */
background: linear-gradient(to top, 
    rgba(0, 0, 0, 0.95) 0%,
    transparent 100%
);

/* 更长的渐变区域 */
background: linear-gradient(to top, 
    rgba(13, 13, 13, 0.8) 0%,
    rgba(13, 13, 13, 0.4) 50%,
    transparent 100%
);
```

### 调整子元素间隔
```css
.menu-bar-wrapper {
    gap: 16px;  /* 改为16px */
}
```

### 调整过渡时长
```css
.menu-bar-wrapper {
    transition: 
        transform 1.2s ease,  /* 改为1.2秒 */
        scale 1.2s ease,
        opacity 1.2s ease;
}
```

### 添加毛玻璃效果
```css
.menu-bar-wrapper {
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
}
```

## 🎯 实际应用示例

### 示例1：简单按钮导航
```tsx
<div className="menu-bar-wrapper">
  <button className="nav-btn">首页</button>
  <button className="nav-btn">发现</button>
  <button className="nav-btn">消息</button>
  <button className="nav-btn">我的</button>
</div>
```

```css
.nav-btn {
    padding: 8px 16px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 12px;
    color: #fff;
    cursor: pointer;
    transition: all 0.3s;
}

.nav-btn:hover {
    background: rgba(163, 240, 48, 0.2);
    border-color: #A3F030;
}
```

### 示例2：图标 + 文字
```tsx
<div className="menu-bar-wrapper">
  {['home', 'chart', 'trade', 'user'].map(icon => (
    <div key={icon} className="nav-item">
      <Icon name={icon} />
      <span>{icon}</span>
    </div>
  ))}
</div>
```

```css
.nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    color: rgba(255, 255, 255, 0.6);
    cursor: pointer;
    transition: color 0.3s;
}

.nav-item:hover {
    color: #A3F030;
}
```

### 示例3：带滑块指示器
```tsx
<div className="menu-bar-wrapper">
  <div className="nav-items">
    <button className="nav-item active">首页</button>
    <button className="nav-item">行情</button>
    <button className="nav-item">交易</button>
    <button className="nav-item">资产</button>
  </div>
  <div className="nav-indicator"></div>
</div>
```

```css
.nav-items {
    position: relative;
    display: flex;
    gap: 8px;
}

.nav-indicator {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 3px;
    width: 50px;
    background: #A3F030;
    border-radius: 2px;
    transition: transform 0.3s cubic-bezier(0.47, 1.64, 0.41, 0.8);
}
```

## 🌟 动画效果示例

### 滑入动画
```css
.menu-bar-wrapper {
    /* 初始状态 */
    transform: translateY(100%);
    opacity: 0;
}

.menu-bar-wrapper.show {
    /* 显示状态 */
    transform: translateY(0);
    opacity: 1;
    /* transition 已定义，自动应用 */
}
```

```tsx
// React组件
const [show, setShow] = useState(false);

useEffect(() => {
  setTimeout(() => setShow(true), 100);
}, []);

return (
  <div className={`menu-bar-wrapper ${show ? 'show' : ''}`}>
    {/* 内容 */}
  </div>
);
```

### 缩放动画
```css
.menu-bar-wrapper {
    scale: 0.9;
    opacity: 0;
}

.menu-bar-wrapper.active {
    scale: 1;
    opacity: 1;
}
```

### 弹出动画
```css
@keyframes bounce-in {
    0% {
        transform: translateY(100%) scale(0.8);
        opacity: 0;
    }
    50% {
        transform: translateY(-10px) scale(1.05);
    }
    100% {
        transform: translateY(0) scale(1);
        opacity: 1;
    }
}

.menu-bar-wrapper.animated {
    animation: bounce-in 0.8s cubic-bezier(0.47, 1.64, 0.41, 0.8);
}
```

## 📱 响应式适配

### 移动端优化
```css
@media (max-width: 768px) {
    .menu-bar-wrapper {
        height: 80px;  /* 移动端略矮 */
        padding-top: 8px;
    }
}

/* iPhone X 及以上（刘海屏） */
@supports (padding-bottom: env(safe-area-inset-bottom)) {
    .menu-bar-wrapper {
        padding-bottom: calc(12px + env(safe-area-inset-bottom));
        height: calc(90px + env(safe-area-inset-bottom));
    }
}
```

### 桌面端隐藏
```css
@media (min-width: 1200px) {
    .menu-bar-wrapper {
        display: none;  /* 桌面端隐藏 */
    }
}
```

## 🎨 主题变化

### 亮色主题
```css
.menu-bar-wrapper.light-theme {
    background: linear-gradient(to top, 
        rgba(255, 255, 255, 0.95) 0%,
        transparent 100%
    );
}
```

### 毛玻璃主题
```css
.menu-bar-wrapper.glass-theme {
    background: linear-gradient(to top, 
        rgba(13, 13, 13, 0.6) 0%,
        transparent 100%
    );
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-top: 1px solid rgba(255, 255, 255, 0.1);
}
```

### 纯色主题
```css
.menu-bar-wrapper.solid-theme {
    background: #0D0D0D;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
}
```

## ⚡ 性能优化

### GPU加速
```css
.menu-bar-wrapper {
    will-change: transform, opacity;
    transform: translateZ(0);  /* 强制GPU加速 */
}
```

### 减少重绘
```css
.menu-bar-wrapper {
    /* 使用transform代替top/bottom */
    transform: translateY(0);
}

.menu-bar-wrapper.hide {
    /* 向下隐藏 */
    transform: translateY(100%);
    /* 而不是 bottom: -90px; */
}
```

## 🐛 常见问题

### Q1：在iOS上底部被遮挡
**A**：添加safe-area支持
```css
.menu-bar-wrapper {
    padding-bottom: env(safe-area-inset-bottom, 0);
    height: calc(90px + env(safe-area-inset-bottom, 0));
}
```

### Q2：z-index不够高
**A**：提高z-index或检查父元素
```css
.menu-bar-wrapper {
    z-index: 9999;  /* 提高层级 */
}
```

### Q3：过渡效果不生效
**A**：检查是否有!important覆盖
```css
.menu-bar-wrapper {
    transition: transform 0.8s ease !important,
                scale 0.8s ease !important,
                opacity 0.8s ease !important;
}
```

### Q4：gap不支持（旧浏览器）
**A**：使用margin作为降级方案
```css
.menu-bar-wrapper > * + * {
    margin-left: 8px;  /* gap降级方案 */
}
```

## 📚 与现有样式对比

### 现有 `.aiz-mobile-bottom-nav`
- 高度：110px（min-height）
- z-index: 1030
- 背景：渐变到黑色
- 有复杂的玻璃效果

### 新 `.menu-bar-wrapper`
- 高度：90px（固定）
- z-index: 999
- 背景：简单渐变
- 轻量级，易于自定义

### 何时使用？
- **使用 `.aiz-mobile-bottom-nav`**：需要完整的iOS风格玻璃效果
- **使用 `.menu-bar-wrapper`**：需要简单的固定底栏，更易自定义

## ✅ 快速检查清单

- [ ] 元素添加了 `menu-bar-wrapper` 类
- [ ] 容器内有子元素（按钮、链接等）
- [ ] 在移动端查看效果
- [ ] 检查z-index是否合适
- [ ] 测试过渡动画效果
- [ ] 在iOS上测试safe-area
- [ ] 确认与现有导航不冲突

## 🎯 完整示例

```tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/MobileBottomNav.css';

export function CustomBottomNav() {
  const [active, setActive] = useState(0);

  return (
    <div className="menu-bar-wrapper">
      {['首页', '行情', '交易', '资产'].map((label, index) => (
        <Link
          key={label}
          to={`/${label}`}
          className={`custom-nav-btn ${active === index ? 'active' : ''}`}
          onClick={() => setActive(index)}
        >
          {label}
        </Link>
      ))}
    </div>
  );
}
```

```css
.custom-nav-btn {
    padding: 12px 20px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    color: rgba(255, 255, 255, 0.6);
    text-decoration: none;
    transition: all 0.3s;
}

.custom-nav-btn:hover {
    background: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.9);
}

.custom-nav-btn.active {
    background: rgba(163, 240, 48, 0.2);
    border-color: #A3F030;
    color: #A3F030;
}
```

---

**样式位置**：`/styles/MobileBottomNav.css` 第3-21行  
**z-index**：999（可根据需要调整）  
**浏览器兼容性**：现代浏览器全支持  
**状态**：✅ 已添加，可立即使用
