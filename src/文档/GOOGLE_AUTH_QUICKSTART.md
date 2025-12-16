# ⚡ Google 登录快速启动指南

## 🎯 5分钟快速开始

### 1️⃣ 安装依赖（1分钟）

```bash
npm install @supabase/supabase-js react-router-dom sonner
```

### 2️⃣ 启动应用（10秒）

```bash
npm run dev
```

### 3️⃣ 测试登录（30秒）

1. 访问 http://localhost:5173/login
2. 点击 **"Google"** 按钮
3. 选择 Google 账户
4. ✅ 自动跳转到仪表盘！

---

## 📦 已创建的文件

| 文件 | 功能 |
|------|------|
| `/utils/supabase/client.ts` | Supabase 客户端和认证方法 |
| `/hooks/useAuth.ts` | 认证状态管理 Hook |
| `/components/AuthForm.tsx` | 登录表单（已更新） |
| `/components/AuthCallback.tsx` | OAuth 回调处理 |
| `/components/ProtectedRoute.tsx` | 路由保护 |
| `/components/Dashboard.tsx` | 示例仪表盘 |
| `/App.tsx` | 路由配置（已更新） |

---

## 🚀 核心 API

### Google 登录

```tsx
import { auth } from './utils/supabase/client'

// 触发 Google 登录
await auth.signInWithGoogle()
```

### 获取当前用户

```tsx
import { useAuth } from './hooks/useAuth'

function MyComponent() {
  const { user, isAuthenticated } = useAuth()
  
  return (
    <div>
      {isAuthenticated && (
        <p>欢迎, {user?.name}</p>
      )}
    </div>
  )
}
```

### 登出

```tsx
import { useAuth } from './hooks/useAuth'

function MyComponent() {
  const { signOut } = useAuth()
  
  return <button onClick={signOut}>登出</button>
}
```

---

## 🎨 路由结构

```
/login           → 登录页面
/auth/callback   → OAuth 回调（自动处理）
/dashboard       → 仪表盘（需要登录）
/               → 重定向到 /login
```

---

## 📱 使用示例

### 在任何组件中使用认证

```tsx
import { useAuth } from './hooks/useAuth'

export function MyComponent() {
  const { user, isAuthenticated, loading } = useAuth()
  
  if (loading) return <div>加载中...</div>
  if (!isAuthenticated) return <div>请先登录</div>
  
  return (
    <div>
      <h1>你好, {user?.name}!</h1>
      <img src={user?.avatar} alt="头像" />
      <p>邮箱: {user?.email}</p>
      <p>登录方式: {user?.provider}</p>
    </div>
  )
}
```

### 保护特定页面

```tsx
// 在 App.tsx 中
<Route
  path="/protected"
  element={
    <ProtectedRoute>
      <ProtectedPage />
    </ProtectedRoute>
  }
/>
```

### 手动检查登录状态

```tsx
import { auth } from './utils/supabase/client'

async function checkLogin() {
  const session = await auth.getSession()
  console.log('登录状态:', !!session)
}
```

---

## 🔧 配置选项

### 自定义登录后跳转

```tsx
// 默认跳转到 /dashboard
await auth.signInWithGoogle()

// 自定义跳转地址
await auth.signInWithGoogle('/custom-page')
```

### 获取更多 Google 权限

编辑 `/utils/supabase/client.ts`:

```tsx
scopes: 'email profile https://www.googleapis.com/auth/calendar'
```

---

## 🐛 快速故障排除

### 问题：点击 Google 按钮没反应

**解决方案**:
```bash
# 1. 检查依赖是否安装
npm list @supabase/supabase-js

# 2. 检查浏览器控制台错误
# 3. 确认 Supabase Dashboard 中 Google Provider 已启用
```

### 问题：登录后显示错误

**解决方案**:
```bash
# 检查 /auth/callback 路由是否正确配置
# 查看 AuthCallback.tsx 中的控制台日志
```

### 问题：刷新页面后需要重新登录

**解决方案**:
```tsx
// 检查 persistSession 配置
// 在 /utils/supabase/client.ts 中应该是:
auth: {
  persistSession: true, // ← 确保为 true
}
```

---

## 📊 用户对象结构

```tsx
{
  id: "uuid",
  email: "user@gmail.com",
  name: "张三",
  avatar: "https://lh3.googleusercontent.com/...",
  provider: "google"
}
```

---

## ✨ 核心功能清单

✅ **Google OAuth 登录**  
✅ **GitHub OAuth 登录**（可选）  
✅ **邮箱密码登录**  
✅ **用户注册**  
✅ **会话持久化**  
✅ **自动 Token 刷新**  
✅ **路由保护**  
✅ **用户信息显示**  
✅ **安全登出**  
✅ **错误处理**  
✅ **加载状态**  

---

## 🎯 下一步

### 立即可用的功能

1. **测试登录** - 点击 Google 按钮登录
2. **查看仪表盘** - 登录后自动跳转
3. **测试登出** - 点击登出按钮
4. **刷新页面** - 会话保持不变

### 可选的增强功能

- [ ] 添加邮箱验证流程
- [ ] 实现忘记密码功能
- [ ] 添加用户资料编辑
- [ ] 集成更多 OAuth 提供商
- [ ] 添加多因素认证

---

## 📚 完整文档

详细配置和高级用法请参考：
👉 **GOOGLE_AUTH_SETUP.md**

---

## 💡 快速命令参考

```bash
# 安装依赖
npm install @supabase/supabase-js react-router-dom sonner

# 启动开发
npm run dev

# 构建生产
npm run build

# 预览生产构建
npm run preview
```

---

## 🎉 完成！

现在你可以：
- ✅ 使用 Google 账户登录
- ✅ 查看用户信息和头像
- ✅ 访问受保护的页面
- ✅ 安全登出

**祝你使用愉快！** 🚀

---

**快速启动完成** ⚡  
**总耗时**: 约 5 分钟  
**难度**: ⭐ 简单
