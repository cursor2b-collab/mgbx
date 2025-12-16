# Drawer 无障碍访问警告修复

## 问题描述
在使用 Drawer 组件时出现以下警告：
```
Warning: Missing `Description` or `aria-describedby={undefined}` for {DialogContent}.
```

## 原因
vaul Drawer 库要求所有 Drawer 组件必须包含 `DrawerDescription` 组件或明确设置 `aria-describedby={undefined}`，以符合 ARIA 无障碍访问标准。

## 修复方案

### 1. 导入 DrawerDescription
```tsx
import { 
  Drawer, 
  DrawerContent, 
  DrawerHeader, 
  DrawerTitle, 
  DrawerDescription 
} from './ui/drawer'
```

### 2. 在 DrawerHeader 中添加 DrawerDescription
```tsx
<DrawerHeader className="border-b border-white/10 px-4 py-4">
  <div className="flex items-center justify-between">
    <DrawerTitle className="text-white text-lg">股票</DrawerTitle>
    <button 
      onClick={() => setDrawerOpen(false)}
      className="p-2 -mr-2 hover:bg-white/5 rounded-lg transition-colors"
    >
      <X className="w-5 h-5 text-white/60" />
    </button>
  </div>
  {/* 添加描述，使用 sr-only 隐藏视觉显示 */}
  <DrawerDescription className="sr-only">
    选择股票进行交易
  </DrawerDescription>
</DrawerHeader>
```

## 修复的文件
- `/components/MobileTradingPage.tsx`

## 无障碍访问最佳实践

### 方案 1：添加可见或隐藏的描述（推荐）
```tsx
<DrawerDescription className="sr-only">
  描述文本
</DrawerDescription>
```

### 方案 2：明确禁用描述（不推荐）
```tsx
<DrawerContent aria-describedby={undefined}>
  {/* 内容 */}
</DrawerContent>
```

## 验证
修复后，控制台不应再显示关于缺少 Description 的警告。

## 注意事项
- `sr-only` 类使元素仅对屏幕阅读器可见，不影响视觉布局
- DrawerDescription 应该提供有意义的描述，帮助屏幕阅读器用户理解抽屉的用途
- 如果抽屉内容本身已经提供了足够的上下文，可以使用简短的描述
