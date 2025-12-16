# Vue 3 版本使用指南

## 快速开始

### 前置要求
- Node.js 18+ 
- npm 或 yarn 或 pnpm

### 安装步骤

1. **进入项目目录**
```bash
cd vue-version
```

2. **安装依赖**
```bash
npm install
# 或
yarn install
# 或
pnpm install
```

3. **启动开发服务器**
```bash
npm run dev
```

4. **访问应用**
打开浏览器访问 `http://localhost:5173`

## 核心功能说明

### 1. 登录流程控制

#### 步骤管理
应用使用 `step` 响应式变量控制当前显示的步骤：

```typescript
type Step = 'email' | 'code' | 'success'
const step = ref<Step>('email')
```

#### 步骤切换
```typescript
// 从邮箱页面到验证码页面
const handleEmailSubmit = () => {
  if (email.value) {
    // 1. 隐藏初始动画
    initialCanvasVisible.value = false
    // 2. 显示反向动画
    reverseCanvasVisible.value = true
    
    // 3. 延迟切换页面
    setTimeout(() => {
      step.value = 'code'
      reverseCanvasVisible.value = false
      // 4. 聚焦到第一个验证码输入框
      nextTick(() => {
        codeInputRefs.value[0]?.focus()
      })
    }, 500)
  }
}
```

### 2. 验证码输入处理

#### 自动跳转逻辑
```typescript
const handleCodeInput = (index: number, event: Event) => {
  const target = event.target as HTMLInputElement
  const value = target.value
  
  if (value.length > 0) {
    // 只保留最后一个字符
    code.value[index] = value[value.length - 1]
    
    // 自动跳转到下一个输入框
    if (index < code.value.length - 1) {
      codeInputRefs.value[index + 1]?.focus()
    }
  }
}
```

#### 退格键处理
```typescript
const handleCodeKeydown = (index: number, event: KeyboardEvent) => {
  if (event.key === 'Backspace' && !code.value[index] && index > 0) {
    // 当前输入框为空且按下退格键时，跳转到上一个输入框
    codeInputRefs.value[index - 1]?.focus()
  }
}
```

#### 粘贴处理
```typescript
const handleCodePaste = (event: ClipboardEvent) => {
  event.preventDefault()
  const pasteData = event.clipboardData?.getData('text') || ''
  // 提取数字并填充到输入框
  const digits = pasteData.replace(/\D/g, '').split('').slice(0, 6)
  
  digits.forEach((digit, i) => {
    if (i < code.value.length) {
      code.value[i] = digit
    }
  })
  
  // 聚焦到下一个空输入框或最后一个
  const nextEmptyIndex = code.value.findIndex(d => d === '')
  if (nextEmptyIndex !== -1) {
    codeInputRefs.value[nextEmptyIndex]?.focus()
  } else {
    codeInputRefs.value[code.value.length - 1]?.focus()
  }
}
```

### 3. 粒子动画效果

#### CanvasRevealEffect 组件
使用 Canvas API 绘制动态粒子效果：

```typescript
class Dot {
  x: number      // X 坐标
  y: number      // Y 坐标
  vx: number     // X 方向速度
  vy: number     // Y 方向速度
  radius: number // 半径
  opacity: number // 透明度
  color: number[] // RGB 颜色

  update(width: number, height: number, reverse: boolean) {
    const speed = reverse ? -1 : 1
    this.x += this.vx * speed
    this.y += this.vy * speed
    
    // 边界检测和反弹
    if (this.x < 0 || this.x > width) this.vx *= -1
    if (this.y < 0 || this.y > height) this.vy *= -1
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(${this.color[0]}, ${this.color[1]}, ${this.color[2]}, ${this.opacity})`
    ctx.fill()
  }
}
```

#### 动画循环
```typescript
const animate = () => {
  const canvas = canvasRef.value
  if (!canvas) return
  
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  
  // 清除画布
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  
  // 更新和绘制所有粒子
  dots.forEach(dot => {
    dot.update(canvas.width, canvas.height, props.reverse)
    dot.draw(ctx)
  })
  
  // 请求下一帧
  animationFrameId = requestAnimationFrame(animate)
}
```

### 4. 响应式导航栏

#### 桌面端布局
```vue
<div class="hidden sm:flex items-center gap-6">
  <div class="flex items-center gap-6">
    <component :is="logoElement" />
    <AnimatedNavLink
      v-for="link in navLinksData"
      :key="link.label"
      :href="link.href"
    >
      {{ link.label }}
    </AnimatedNavLink>
  </div>
  
  <div class="flex items-center gap-3 ml-8">
    <component :is="loginButtonElement" />
    <component :is="signupButtonElement" />
  </div>
</div>
```

#### 移动端菜单
```vue
<div class="sm:hidden">
  <div class="flex items-center justify-between">
    <component :is="logoElement" />
    
    <button @click="toggleMenu">
      <!-- 汉堡菜单图标 -->
    </button>
  </div>
  
  <Transition name="slide-down">
    <div v-if="isOpen" class="mt-4 space-y-3 pb-2">
      <!-- 菜单内容 -->
    </div>
  </Transition>
</div>
```

## 集成后端 API

### 1. 发送验证码

```typescript
// SignInPage.vue
import { ref } from 'vue'

const handleEmailSubmit = async () => {
  if (!email.value) return
  
  try {
    // 调用发送验证码 API
    const response = await fetch('/api/auth/send-code', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email.value
      })
    })
    
    if (response.ok) {
      // 切换到验证码页面
      initialCanvasVisible.value = false
      reverseCanvasVisible.value = true
      
      setTimeout(() => {
        step.value = 'code'
        reverseCanvasVisible.value = false
        nextTick(() => {
          codeInputRefs.value[0]?.focus()
        })
      }, 500)
    } else {
      // 处理错误
      console.error('发送验证码失败')
    }
  } catch (error) {
    console.error('网络错误:', error)
  }
}
```

### 2. 验证验证码

```typescript
const handleCodeSubmit = async () => {
  if (!isCodeComplete.value) return
  
  try {
    const codeString = code.value.join('')
    
    const response = await fetch('/api/auth/verify-code', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email.value,
        code: codeString
      })
    })
    
    if (response.ok) {
      const data = await response.json()
      
      // 保存 token
      localStorage.setItem('token', data.token)
      
      // 切换到成功页面
      step.value = 'success'
      
      // 延迟跳转到控制台
      setTimeout(() => {
        window.location.href = '/dashboard'
      }, 2000)
    } else {
      // 处理验证失败
      console.error('验证码错误')
      // 清空验证码
      code.value = ['', '', '', '', '', '']
      codeInputRefs.value[0]?.focus()
    }
  } catch (error) {
    console.error('网络错误:', error)
  }
}
```

### 3. 使用 Axios 或其他 HTTP 库

```typescript
// api/auth.ts
import axios from 'axios'

const api = axios.create({
  baseURL: 'https://your-api.com',
  timeout: 10000,
})

export const sendVerificationCode = async (email: string) => {
  return await api.post('/auth/send-code', { email })
}

export const verifyCode = async (email: string, code: string) => {
  return await api.post('/auth/verify-code', { email, code })
}

// 在组件中使用
import { sendVerificationCode, verifyCode } from '@/api/auth'

const handleEmailSubmit = async () => {
  try {
    await sendVerificationCode(email.value)
    // 切换页面...
  } catch (error) {
    // 错误处理...
  }
}
```

## 状态管理（可选）

### 使用 Pinia

1. **安装 Pinia**
```bash
npm install pinia
```

2. **创建认证 Store**
```typescript
// stores/auth.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('token') || '')
  const isAuthenticated = computed(() => !!token.value)

  const login = async (email: string, code: string) => {
    const response = await verifyCode(email, code)
    token.value = response.data.token
    user.value = response.data.user
    localStorage.setItem('token', token.value)
  }

  const logout = () => {
    token.value = ''
    user.value = null
    localStorage.removeItem('token')
  }

  return {
    user,
    token,
    isAuthenticated,
    login,
    logout,
  }
})
```

3. **在组件中使用**
```typescript
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const handleCodeSubmit = async () => {
  try {
    await authStore.login(email.value, code.value.join(''))
    step.value = 'success'
  } catch (error) {
    // 错误处理...
  }
}
```

## 添加表单验证

### 使用 VeeValidate

1. **安装依赖**
```bash
npm install vee-validate yup
```

2. **创建验证规则**
```typescript
import { useField, useForm } from 'vee-validate'
import * as yup from 'yup'

const schema = yup.object({
  email: yup.string().required('请输入邮箱').email('邮箱格式不正确'),
})

const { handleSubmit, errors } = useForm({
  validationSchema: schema,
})

const { value: email } = useField('email')

const onSubmit = handleSubmit(async (values) => {
  // 提交逻辑
})
```

## 添加加载状态

```typescript
const isLoading = ref(false)
const error = ref('')

const handleEmailSubmit = async () => {
  isLoading.value = true
  error.value = ''
  
  try {
    await sendVerificationCode(email.value)
    // 成功逻辑...
  } catch (err) {
    error.value = '发送验证码失败，请重试'
  } finally {
    isLoading.value = false
  }
}
```

```vue
<template>
  <button
    type="submit"
    :disabled="isLoading"
    :class="{ 'opacity-50 cursor-not-allowed': isLoading }"
  >
    {{ isLoading ? '发送中...' : '发送验证码' }}
  </button>
  
  <p v-if="error" class="text-red-500 text-sm mt-2">
    {{ error }}
  </p>
</template>
```

## 国际化支持

### 使用 Vue I18n

1. **安装**
```bash
npm install vue-i18n
```

2. **配置**
```typescript
// i18n/index.ts
import { createI18n } from 'vue-i18n'

const messages = {
  'zh-CN': {
    welcome: '欢迎使用',
    platform: '数字资产交易平台',
    enterEmail: '请输入邮箱地址',
    sendCode: '我们已向您发送验证码',
    // ...更多翻译
  },
  'en': {
    welcome: 'Welcome',
    platform: 'Digital Asset Exchange',
    enterEmail: 'Enter your email address',
    sendCode: 'We sent you a code',
    // ...more translations
  }
}

export const i18n = createI18n({
  legacy: false,
  locale: 'zh-CN',
  messages,
})
```

3. **在组件中使用**
```vue
<template>
  <h1>{{ t('welcome') }}</h1>
  <p>{{ t('platform') }}</p>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>
```

## 性能优化技巧

### 1. 懒加载组件
```typescript
const CanvasRevealEffect = defineAsyncComponent(
  () => import('./components/CanvasRevealEffect.vue')
)
```

### 2. 防抖验证码重发
```typescript
import { useDebounceFn } from '@vueuse/core'

const resendCode = useDebounceFn(async () => {
  await sendVerificationCode(email.value)
}, 1000)
```

### 3. 移动端优化粒子数量
```typescript
const dotCount = computed(() => {
  const isMobile = window.innerWidth < 768
  return isMobile ? 50 : 200
})
```

## 部署

### Vercel 部署
```bash
npm install -g vercel
vercel
```

### Netlify 部署
```bash
npm run build
# 将 dist 目录部署到 Netlify
```

### Nginx 配置
```nginx
server {
  listen 80;
  server_name your-domain.com;
  root /var/www/your-app/dist;
  index index.html;

  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

## 故障排查

### 问题：粒子动画不显示
**解决方案**：检查 Canvas 元素是否正确挂载，查看浏览器控制台是否有错误。

### 问题：验证码输入框焦点跳转不正常
**解决方案**：确保使用 `nextTick` 等待 DOM 更新后再操作焦点。

### 问题：移动端样式异常
**解决方案**：检查 Tailwind 响应式断点是否正确使用，确认 viewport meta 标签已添加。

## 更多资源

- [Vue 3 官方文档](https://cn.vuejs.org/)
- [Vite 官方文档](https://cn.vitejs.dev/)
- [Tailwind CSS 文档](https://tailwindcss.com/)
- [TypeScript 手册](https://www.typescriptlang.org/)
