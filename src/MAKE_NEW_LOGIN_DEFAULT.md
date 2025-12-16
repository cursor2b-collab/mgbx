# 🚀 将新登录页面设为默认 - 快速指南

## 当前状态
✅ 新登录组件已创建并可在 `/login-new` 访问

## 如何将其设为默认登录页面

### 方法 1: 直接替换（推荐）

编辑 `/App.tsx`，找到第 41 行：

**修改前:**
```tsx
{/* 登录页 - 使用3D动画登录组件 */}
<Route path="/login" element={<Modern3DAuth />} />
```

**修改后:**
```tsx
{/* 登录页 - 使用新粒子动画登录组件 */}
<Route path="/login" element={<NewAuthForm />} />
```

### 方法 2: 更新所有登录入口

如果您想同时更新 `/auth` 路由，也修改第 44 行：

**修改前:**
```tsx
{/* 注册/登录页 - 统一入口 */}
<Route path="/auth" element={<Modern3DAuth />} />
```

**修改后:**
```tsx
{/* 注册/登录页 - 统一入口 */}
<Route path="/auth" element={<NewAuthForm />} />
```

### 方法 3: 保留旧版本作为备用

保持所有路由，让用户可以选择不同的登录界面：

```tsx
{/* 新登录页 - 粒子动画（推荐） */}
<Route path="/login" element={<NewAuthForm />} />

{/* 3D 登录页 - 备用 */}
<Route path="/login-3d" element={<Modern3DAuth />} />

{/* 经典登录页 - 备用 */}
<Route path="/login-classic" element={<AuthForm />} />
```

## 完整的修改示例

在 `/App.tsx` 中替换第 40-50 行为：

```tsx
{/* 登录页 - 使用新粒子动画登录组件 */}
<Route path="/login" element={<NewAuthForm />} />

{/* 注册/登录页 - 统一入口 */}
<Route path="/auth" element={<NewAuthForm />} />

{/* 备用登录页 - 3D 动画 */}
<Route path="/login-3d" element={<Modern3DAuth />} />

{/* 备用登录页 - 标准登录表单 */}
<Route path="/login-classic" element={<AuthForm />} />

{/* OAuth 回调页 */}
<Route path="/auth/callback" element={<AuthCallback />} />
```

## ✅ 验证更改

修改后，访问以下 URL 测试：
- http://localhost:5173/login （应该显示新的粒子动画登录页）
- http://localhost:5173/auth （应该显示新的粒子动画登录页）

## 🎨 与应用主题的一致性

新登录组件已完美匹配应用的设计系统：
- ✅ 纯黑色背景 `bg-black`
- ✅ 荧光绿色按钮 `#A3F030`
- ✅ 白色文本和图标
- ✅ 玻璃态效果
- ✅ 流畅的动画过渡

## 📋 需要的依赖

确保已安装以下依赖（通常会自动安装）：
```bash
npm install three @react-three/fiber motion
```

## 🔥 现在就修改！

**最简单的方法：**

1. 打开 `/App.tsx`
2. 找到这行（第 41 行）：
   ```tsx
   <Route path="/login" element={<Modern3DAuth />} />
   ```
3. 改为：
   ```tsx
   <Route path="/login" element={<NewAuthForm />} />
   ```
4. 保存文件
5. 刷新浏览器 ✨

就这么简单！🎉
