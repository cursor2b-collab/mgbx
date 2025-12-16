# 单文件 Vue 代码使用指南

本指南介绍了两种单文件 Vue 实现方式。

## 📦 提供的文件

### 1. CryptoExchangeLogin.vue
**适用场景**: 现有 Vue 3 项目中使用

这是一个完整的 Vue 3 单文件组件（SFC），包含：
- ✅ 完整的登录注册流程
- ✅ Canvas 粒子动画
- ✅ 响应式导航栏
- ✅ 所有样式和逻辑

### 2. standalone.html
**适用场景**: 无需构建工具，直接在浏览器中运行

这是一个独立的 HTML 文件，包含：
- ✅ Vue 3 CDN 引入
- ✅ Tailwind CSS CDN 引入
- ✅ 完整功能实现
- ✅ 无需任何依赖安装

---

## 🚀 方式一：在 Vue 项目中使用 .vue 文件

### 步骤 1: 复制文件

将 `CryptoExchangeLogin.vue` 复制到你的项目中：

```bash
# 复制到 src/components 目录
cp vue-version/CryptoExchangeLogin.vue your-project/src/components/
```

### 步骤 2: 在页面中使用

#### 方式 A: 作为页面组件

```vue
<!-- src/views/Login.vue -->
<template>
  <CryptoExchangeLogin />
</template>

<script setup lang="ts">
import CryptoExchangeLogin from '@/components/CryptoExchangeLogin.vue'
</script>
```

#### 方式 B: 直接作为 App 组件

```vue
<!-- src/App.vue -->
<template>
  <CryptoExchangeLogin />
</template>

<script setup lang="ts">
import CryptoExchangeLogin from './components/CryptoExchangeLogin.vue'
</script>
```

### 步骤 3: 配置路由（可选）

如果使用 Vue Router：

```typescript
// router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import CryptoExchangeLogin from '@/components/CryptoExchangeLogin.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: CryptoExchangeLogin
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
```

### 步骤 4: 确保 Tailwind CSS 已安装

#### 检查 tailwind.config.js

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

#### 检查 main.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 步骤 5: 运行项目

```bash
npm run dev
```

访问 http://localhost:5173/login (或你配置的路由)

---

## 🌐 方式二：使用独立 HTML 文件

### 步骤 1: 直接打开文件

**最简单的方式** - 双击 `standalone.html` 文件，即可在浏览器中运行！

### 步骤 2: 通过本地服务器运行（推荐）

#### 使用 Python

```bash
# Python 3
python -m http.server 8000

# 访问 http://localhost:8000/vue-version/standalone.html
```

#### 使用 Node.js

```bash
# 安装 http-server
npm install -g http-server

# 运行
http-server

# 访问 http://localhost:8080/vue-version/standalone.html
```

#### 使用 VS Code Live Server

1. 安装 "Live Server" 扩展
2. 右键点击 `standalone.html`
3. 选择 "Open with Live Server"

### 步骤 3: 自定义配置

编辑 `standalone.html` 文件，根据需要修改：

#### 修改 API 端点

```javascript
const handleEmailSubmit = () => {
  // 修改这里的 API 调用
  fetch('https://your-api.com/api/auth/send-code', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email.value })
  })
  .then(response => response.json())
  .then(data => {
    // 处理响应
  })
}
```

#### 修改粒子动画参数

```javascript
// 在 createDots 函数中
const numDots = Math.floor((width * height) / 10000) * 2; // 调整粒子数量
const animationSpeed = 3; // 调整速度
const dotSize = 6; // 调整大小
```

---

## 🎨 自定义修改指南

### 1. 修改颜色主题

在 `<style>` 部分添加自定义颜色：

```css
<style scoped>
/* 自定义主题颜色 */
:root {
  --primary-color: #6366f1; /* 主色调 */
  --secondary-color: #8b5cf6; /* 次要色 */
}

/* 应用到按钮 */
.primary-button {
  background: var(--primary-color);
}
</style>
```

### 2. 修改文本内容

搜索并替换以下文本：

```html
<!-- 主标题 -->
<h1>欢迎使用</h1>
<!-- 改为 -->
<h1>您的品牌名称</h1>

<!-- 副标题 -->
<p>数字资产交易平台</p>
<!-- 改为 -->
<p>您的副标题</p>
```

### 3. 修改导航链接

```javascript
const navLinks = [
  { label: '关于我们', href: '#1' },
  { label: '招聘', href: '#2' },
  { label: '发现', href: '#3' },
];

// 改为
const navLinks = [
  { label: '首页', href: '/' },
  { label: '产品', href: '/products' },
  { label: '联系我们', href: '/contact' },
];
```

### 4. 添加 Logo

替换导航栏中的 Logo 部分：

```html
<!-- 原始的点阵 Logo -->
<div class="relative w-5 h-5 flex items-center justify-center">
  <!-- ... -->
</div>

<!-- 改为图片 Logo -->
<img src="/path/to/your/logo.png" alt="Logo" class="h-8 w-auto" />
```

### 5. 修改验证码位数

```javascript
// 将 6 位改为 4 位
const code = ref(['', '', '', '']); // 改为 4 个空字符串

// 在模板中也需要相应修改循环次数
```

### 6. 添加额外的第三方登录

```html
<!-- 在 Google 登录按钮下方添加 -->
<button type="button" @click="handleGithubLogin" class="backdrop-blur-[2px] w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-full py-3 px-4 transition-colors">
  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
  <span>使用 GitHub 登录</span>
</button>
```

---

## 🔌 集成后端 API

### 示例：集成发送验证码 API

```javascript
const handleEmailSubmit = async () => {
  if (!validateEmail(email.value)) return;
  
  try {
    const response = await fetch('https://your-api.com/api/auth/send-code', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email.value
      })
    });
    
    if (!response.ok) {
      throw new Error('发送失败');
    }
    
    const data = await response.json();
    
    // 切换到验证码页面
    initialCanvasVisible.value = false;
    reverseCanvasVisible.value = true;
    
    setTimeout(() => {
      step.value = 'code';
      reverseCanvasVisible.value = false;
      nextTick(() => {
        codeInputRefs.value[0]?.focus();
      });
    }, 500);
    
    startResendCooldown();
    
  } catch (error) {
    emailError.value = '发送验证码失败，请重试';
    console.error('发送验证码错误:', error);
  }
};
```

### 示例：验证验证码

```javascript
const handleCodeSubmit = async () => {
  if (!isCodeComplete.value) return;
  
  const codeString = code.value.join('');
  
  try {
    const response = await fetch('https://your-api.com/api/auth/verify-code', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email.value,
        code: codeString
      })
    });
    
    if (!response.ok) {
      throw new Error('验证失败');
    }
    
    const data = await response.json();
    
    // 保存 token
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    // 显示成功页面
    step.value = 'success';
    
    // 延迟跳转
    setTimeout(() => {
      window.location.href = '/dashboard';
    }, 2000);
    
  } catch (error) {
    codeError.value = '验证码错误，请重试';
    console.error('验证验证码错误:', error);
    
    // 清空验证码
    code.value = ['', '', '', '', '', ''];
    codeInputRefs.value[0]?.focus();
  }
};
```

---

## 📱 移动端优化

### 减少移动端粒子数量

```javascript
const createDots = (width, height, animationSpeed = 3, dotSize = 6) => {
  // 根据屏幕宽度调整粒子数量
  const isMobile = width < 768;
  const multiplier = isMobile ? 0.5 : 2;
  const numDots = Math.floor((width * height) / 10000) * multiplier;
  
  // ... 其余代码
};
```

### 添加触摸优化

```css
<style scoped>
/* 禁用点击延迟 */
button, a {
  touch-action: manipulation;
}

/* 移动端字体大小调整 */
@media (max-width: 640px) {
  h1 {
    font-size: 2rem !important;
  }
  
  p {
    font-size: 1.25rem !important;
  }
}
</style>
```

---

## 🐛 常见问题

### Q: 粒子动画不显示？
**A**: 检查浏览器控制台是否有错误，确认 Canvas 元素已正确挂载。

### Q: 验证码输入框无法输入？
**A**: 确保使用 `ref` 正确绑定了输入框引用。

### Q: 页面在移动端显示异常？
**A**: 检查是否添加了 viewport meta 标签：
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

### Q: Tailwind CSS 样式不生效？
**A**: 确认已正确引入 Tailwind CSS CDN 或本地配置。

### Q: 如何在生产环境使用？
**A**: 
- `.vue` 文件：使用 Vite/Webpack 构建
- `.html` 文件：可以直接部署到静态服务器

---

## 📝 完整示例：集成到 Nuxt 3

```vue
<!-- pages/login.vue -->
<template>
  <CryptoExchangeLogin />
</template>

<script setup lang="ts">
import CryptoExchangeLogin from '~/components/CryptoExchangeLogin.vue'

// 设置页面元信息
useHead({
  title: '登录 - 加密货币交易所',
  meta: [
    { name: 'description', content: '安全便捷的加密货币交易平台登录' }
  ]
})
</script>
```

---

## 🎯 性能优化建议

### 1. 懒加载组件

```javascript
// 在路由中使用动态导入
const routes = [
  {
    path: '/login',
    component: () => import('@/components/CryptoExchangeLogin.vue')
  }
]
```

### 2. 优化粒子渲染

```javascript
// 使用 requestIdleCallback 优化性能
const animateCanvas = (canvas, dots, reverse, getAnimationId) => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  let lastTime = 0;
  const fps = 30; // 限制帧率
  const interval = 1000 / fps;
  
  const animate = (currentTime) => {
    const deltaTime = currentTime - lastTime;
    
    if (deltaTime >= interval) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      dots.forEach(dot => {
        dot.update(canvas.width, canvas.height, reverse);
        dot.draw(ctx);
      });
      
      lastTime = currentTime;
    }
    
    const id = requestAnimationFrame(animate);
    getAnimationId(id);
  };
  
  animate(0);
};
```

---

## 📦 文件对比

| 特性 | CryptoExchangeLogin.vue | standalone.html |
|------|------------------------|-----------------|
| 需要构建工具 | ✅ 是 | ❌ 否 |
| TypeScript 支持 | ✅ 是 | ❌ 否 |
| 热模块替换 | ✅ 是 | ❌ 否 |
| 文件大小 | ~小 | ~大 (包含所有依赖) |
| 运行方式 | npm run dev | 双击打开 |
| 适用场景 | 生产项目 | 快速原型/演示 |
| 性能 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

---

## ✅ 检查清单

使用前确保：

- [ ] 已安装 Vue 3 (如使用 .vue 文件)
- [ ] 已配置 Tailwind CSS
- [ ] 浏览器支持 ES6+
- [ ] 已测试移动端适配
- [ ] API 端点已正确配置
- [ ] 已添加错误处理
- [ ] 已测试各种屏幕尺寸

---

**享受使用吧！** 🎉

如有问题，请参考主文档 `USAGE_GUIDE.md` 或 `README.md`。
