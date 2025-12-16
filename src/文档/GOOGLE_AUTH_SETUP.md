# 🔐 Supabase Google 登录完整配置指南

## ✅ 已完成配置

根据你的反馈，Google OAuth 已经在 Supabase 中配置完成！

**回调 URL**: `https://bxeubvjivqbbbhzngycf.supabase.co/auth/v1/callback`

---

## 📦 已创建的文件

### 1️⃣ **核心文件**

#### `/utils/supabase/client.ts` - Supabase 客户端和认证工具
- ✅ Supabase 客户端单例
- ✅ Google 登录方法
- ✅ GitHub 登录方法
- ✅ 邮箱/密码登录和注册
- ✅ 会话管理
- ✅ 用户信息获取

#### `/hooks/useAuth.ts` - 认证状态管理 Hook
- ✅ 用户状态管理
- ✅ 会话监听
- ✅ 自动登出功能

#### `/components/AuthForm.tsx` - 登录表单组件（已更新）
- ✅ Google 登录按钮
- ✅ GitHub 登录按钮
- ✅ 邮箱/密码登录
- ✅ 用户注册
- ✅ 加载状态和错误处理

#### `/components/AuthCallback.tsx` - OAuth 回调处理
- ✅ 处理 Google 登录回调
- ✅ 显示加载、成功、失败状态
- ✅ 自动跳转到仪表盘

#### `/components/ProtectedRoute.tsx` - 路由保护组件
- ✅ 未登录自动重定向
- ✅ 加载状态显示

#### `/components/Dashboard.tsx` - 示例仪表盘
- ✅ 显示用户信息
- ✅ 显示 Google 头像
- ✅ 登出功能

#### `/App.tsx` - 应用路由（已更新）
- ✅ 登录页路由
- ✅ 回调页路由
- ✅ 仪表盘路由（受保护）
- ✅ 默认重定向

---

## 🚀 快速开始

### 步骤 1: 安装依赖

```bash
npm install @supabase/supabase-js react-router-dom sonner
```

或

```bash
npm install @supabase/supabase-js@latest react-router-dom@latest sonner@latest
```

### 步骤 2: 启动开发服务器

```bash
npm run dev
```

### 步骤 3: 测试 Google 登录

1. 访问 `http://localhost:5173/login`
2. 点击 **"Google"** 按钮
3. 选择 Google 账户登录
4. 自动重定向到 `/auth/callback`
5. 成功后跳转到 `/dashboard`

---

## 🎯 使用流程

### 用户登录流程

```
用户点击 Google 按钮
    ↓
调用 auth.signInWithGoogle()
    ↓
重定向到 Google 登录页面
    ↓
用户授权
    ↓
Google 重定向到 /auth/callback
    ↓
AuthCallback 组件处理
    ↓
获取会话信息
    ↓
保存用户信息
    ↓
跳转到 /dashboard
```

### 会话持久化

- ✅ 会话自动保存在 localStorage
- ✅ 刷新页面不需要重新登录
- ✅ Token 自动刷新
- ✅ 支持"记住我"功能

---

## 📝 代码使用示例

### 在组件中使用认证

```tsx
import { useAuth } from './hooks/useAuth'

function MyComponent() {
  const { user, isAuthenticated, loading, signOut } = useAuth()

  if (loading) {
    return <div>加载中...</div>
  }

  if (!isAuthenticated) {
    return <div>请先登录</div>
  }

  return (
    <div>
      <h1>欢迎, {user?.name}</h1>
      <img src={user?.avatar} alt="头像" />
      <button onClick={signOut}>登出</button>
    </div>
  )
}
```

### 手动触发 Google 登录

```tsx
import { auth } from './utils/supabase/client'
import { toast } from 'sonner'

async function handleGoogleLogin() {
  try {
    await auth.signInWithGoogle('/dashboard')
    // 会自动重定向到 Google
  } catch (error) {
    toast.error('登录失败')
  }
}
```

### 获取当前用户

```tsx
import { auth } from './utils/supabase/client'

async function getCurrentUser() {
  const user = await auth.getUser()
  console.log('当前用户:', user)
  
  // 用户对象包含:
  // - id: 用户 ID
  // - email: 邮箱
  // - user_metadata: { full_name, avatar_url, ... }
  // - app_metadata: { provider: 'google', ... }
}
```

### 检查登录状态

```tsx
import { auth } from './utils/supabase/client'

async function checkAuth() {
  const session = await auth.getSession()
  
  if (session) {
    console.log('已登录')
    console.log('Access Token:', session.access_token)
  } else {
    console.log('未登录')
  }
}
```

---

## 🔧 高级配置

### 自定义重定向 URL

```tsx
// 登录时指定重定向地址
await auth.signInWithGoogle('https://yourdomain.com/welcome')
```

### 获取额外的 Google 权限

修改 `/utils/supabase/client.ts`:

```tsx
async signInWithGoogle(redirectTo?: string) {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectTo || `${window.location.origin}/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
      scopes: 'email profile https://www.googleapis.com/auth/calendar', // 添加额外权限
    }
  })
  
  // ...
}
```

### 监听认证状态变化

```tsx
import { supabase } from './utils/supabase/client'

// 在应用顶层组件中
useEffect(() => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (event, session) => {
      console.log('认证事件:', event) // 'SIGNED_IN', 'SIGNED_OUT', 等
      console.log('会话:', session)
      
      if (event === 'SIGNED_IN') {
        // 用户登录
      } else if (event === 'SIGNED_OUT') {
        // 用户登出
      } else if (event === 'TOKEN_REFRESHED') {
        // Token 已刷新
      }
    }
  )

  return () => {
    subscription.unsubscribe()
  }
}, [])
```

---

## 🔒 安全最佳实践

### 1. 保护敏感路由

```tsx
// 在 App.tsx 中
<Route
  path="/settings"
  element={
    <ProtectedRoute>
      <SettingsPage />
    </ProtectedRoute>
  }
/>
```

### 2. 验证用户权限

```tsx
import { auth } from './utils/supabase/client'

async function checkPermission() {
  const user = await auth.getUser()
  
  // 检查用户角色
  const role = user?.app_metadata?.role
  
  if (role !== 'admin') {
    throw new Error('无权限')
  }
}
```

### 3. 刷新过期的 Token

```tsx
import { auth } from './utils/supabase/client'

// Token 会自动刷新，但如果需要手动刷新：
async function refreshToken() {
  const session = await auth.refreshSession()
  console.log('新的 access_token:', session?.access_token)
}
```

### 4. 安全登出

```tsx
import { auth } from './utils/supabase/client'

async function secureSignOut() {
  // 清除所有本地存储
  localStorage.clear()
  sessionStorage.clear()
  
  // 登出
  await auth.signOut()
  
  // 重定向到登录页
  window.location.href = '/login'
}
```

---

## 🌐 生产环境配置

### 更新 Google OAuth 重定向 URI

在 Google Cloud Console 中添加生产环境的 URL：

```
https://yourdomain.com/auth/callback
```

### 环境变量配置

创建 `.env` 文件（开发环境）:

```env
VITE_SUPABASE_URL=https://bxeubvjivqbbbhzngycf.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

修改 `/utils/supabase/client.ts`:

```tsx
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || `https://${projectId}.supabase.co`
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || publicAnonKey
```

---

## 🐛 常见问题

### Q1: 点击 Google 登录后没有反应？

**A**: 检查以下几点：
1. 确认 Supabase Dashboard 中 Google Provider 已启用
2. 检查浏览器控制台是否有错误
3. 确认 Google OAuth Client ID 和 Secret 配置正确
4. 检查回调 URL 是否正确

### Q2: 登录后显示 "未找到会话信息"？

**A**: 可能的原因：
1. OAuth 回调被浏览器拦截
2. Cookie 被禁用
3. 检查 `/auth/callback` 路由是否正确配置

### Q3: 如何获取 Google 用户的头像和名字？

**A**: 这些信息存储在 `user.user_metadata` 中：

```tsx
const user = await auth.getUser()

const name = user?.user_metadata?.full_name || user?.user_metadata?.name
const avatar = user?.user_metadata?.avatar_url || user?.user_metadata?.picture
const email = user?.email
```

### Q4: 如何实现"记住我"功能？

**A**: Supabase 默认会持久化会话。如果需要自定义：

```tsx
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true, // 保持为 true
    storage: localStorage, // 使用 localStorage 或 sessionStorage
  }
})
```

### Q5: 如何在服务器端验证用户？

**A**: 使用 access_token 验证：

```tsx
// 在服务器端 (Edge Function)
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL'),
  Deno.env.get('SUPABASE_ANON_KEY')
)

// 从请求头获取 token
const token = request.headers.get('Authorization')?.replace('Bearer ', '')

// 验证用户
const { data: { user }, error } = await supabase.auth.getUser(token)

if (error || !user) {
  return new Response('Unauthorized', { status: 401 })
}
```

---

## 📊 用户数据结构

### Google 登录后的用户对象

```json
{
  "id": "uuid",
  "email": "user@gmail.com",
  "user_metadata": {
    "full_name": "张三",
    "avatar_url": "https://lh3.googleusercontent.com/...",
    "email": "user@gmail.com",
    "email_verified": true,
    "name": "张三",
    "picture": "https://lh3.googleusercontent.com/...",
    "sub": "google_user_id"
  },
  "app_metadata": {
    "provider": "google",
    "providers": ["google"]
  },
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

---

## 🎨 UI 自定义

### 自定义 Google 按钮样式

```tsx
<Button
  onClick={handleGoogleLogin}
  className="w-full bg-white hover:bg-gray-50 text-gray-900 border border-gray-300"
>
  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
    {/* Google Logo SVG */}
  </svg>
  使用 Google 登录
</Button>
```

### 自定义加载状态

```tsx
{isLoading && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6">
      <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      <p className="mt-4 text-gray-900">正在登录...</p>
    </div>
  </div>
)}
```

---

## 📚 相关文档

- [Supabase Auth 文档](https://supabase.com/docs/guides/auth)
- [Google OAuth 文档](https://developers.google.com/identity/protocols/oauth2)
- [React Router 文档](https://reactrouter.com/)

---

## ✅ 测试清单

使用前请确认：

- [ ] 已安装所有依赖 (`@supabase/supabase-js`, `react-router-dom`, `sonner`)
- [ ] Google OAuth 已在 Supabase Dashboard 配置
- [ ] 回调 URL 已添加到 Google Cloud Console
- [ ] 路由配置正确 (`/login`, `/auth/callback`, `/dashboard`)
- [ ] 测试 Google 登录功能
- [ ] 测试登出功能
- [ ] 测试受保护路由
- [ ] 测试页面刷新后会话保持

---

## 🎉 完成！

你现在已经拥有：

✅ **完整的 Google 登录功能**  
✅ **会话管理和持久化**  
✅ **受保护的路由**  
✅ **用户信息显示**  
✅ **登出功能**  
✅ **错误处理**  
✅ **加载状态**  
✅ **生产级代码**  

开始使用吧！🚀

---

**配置完成时间**: 2025-11-03  
**Supabase 项目 ID**: bxeubvjivqbbbhzngycf  
**回调 URL**: https://bxeubvjivqbbbhzngycf.supabase.co/auth/v1/callback
