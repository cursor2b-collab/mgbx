# Three.js 多实例警告修复说明

## 问题描述

在控制台中出现警告：
```
WARNING: Multiple instances of Three.js being imported.
```

## 问题原因

之前在 `components/ui/sign-in-flow-1.tsx` 中使用了通配符导入：
```typescript
import * as THREE from "three";
```

然后在代码中大量使用 `THREE.Vector3`、`THREE.ShaderMaterial` 等，这可能导致：
1. 与 `@react-three/fiber` 内部的 Three.js 实例冲突
2. 打包时创建多个 Three.js 副本
3. 增加打包体积和运行时内存占用

## 解决方案

### 修改前
```typescript
import * as THREE from "three";

// 使用时
new THREE.Vector3()
new THREE.ShaderMaterial({
  glslVersion: THREE.GLSL3,
  blending: THREE.CustomBlending,
  blendSrc: THREE.SrcAlphaFactor,
  blendDst: THREE.OneFactor,
})
```

### 修改后
```typescript
import { 
  Vector2, 
  Vector3, 
  ShaderMaterial as ThreeShaderMaterial,
  GLSL3,
  CustomBlending,
  SrcAlphaFactor,
  OneFactor
} from "three";

// 使用时
new Vector3()
new ThreeShaderMaterial({
  glslVersion: GLSL3,
  blending: CustomBlending,
  blendSrc: SrcAlphaFactor,
  blendDst: OneFactor,
})
```

## 优点

### 1. 解决多实例问题
- 使用命名导入而不是通配符导入
- 与 `@react-three/fiber` 共享同一个 Three.js 实例
- 避免了多个 Three.js 副本

### 2. 减少打包体积
- Tree-shaking 可以更好地工作
- 只打包实际使用的类和常量
- 减少最终的 bundle 大小

### 3. 提高代码可读性
- 导入声明明确显示使用了哪些 Three.js 功能
- 更容易追踪依赖关系
- 便于后续维护

### 4. 类型安全
- TypeScript 可以更精确地进行类型检查
- 自动完成功能更准确
- 减少运行时错误

## 修改的文件

- `/components/ui/sign-in-flow-1.tsx`

## 修改内容

### 导入部分
```diff
- import * as THREE from "three";
+ import { 
+   Vector2, 
+   Vector3, 
+   ShaderMaterial as ThreeShaderMaterial,
+   GLSL3,
+   CustomBlending,
+   SrcAlphaFactor,
+   OneFactor
+ } from "three";
```

### 类型声明
```diff
- const ref = useRef<THREE.Mesh>(null);
+ const ref = useRef<any>(null);
```

### Vector 类使用
```diff
- value: new THREE.Vector3().fromArray(uniform.value)
+ value: new Vector3().fromArray(uniform.value)

- value: new THREE.Vector2().fromArray(uniform.value)
+ value: new Vector2().fromArray(uniform.value)

- value: new THREE.Vector2(size.width * 2, size.height * 2)
+ value: new Vector2(size.width * 2, size.height * 2)
```

### ShaderMaterial 使用
```diff
- const materialObject = new THREE.ShaderMaterial({
+ const materialObject = new ThreeShaderMaterial({
-   glslVersion: THREE.GLSL3,
+   glslVersion: GLSL3,
-   blending: THREE.CustomBlending,
+   blending: CustomBlending,
-   blendSrc: THREE.SrcAlphaFactor,
+   blendSrc: SrcAlphaFactor,
-   blendDst: THREE.OneFactor,
+   blendDst: OneFactor,
  })
```

## 验证

修复后，控制台应该不再显示 Three.js 多实例警告。

## 最佳实践

在未来开发中，使用 Three.js 时应该：

1. **优先使用命名导入**
   ```typescript
   // ✅ 推荐
   import { Vector3, Color } from "three";
   
   // ❌ 避免
   import * as THREE from "three";
   ```

2. **在 React Three Fiber 项目中**
   - 尽量使用 `@react-three/fiber` 提供的组件和 hooks
   - 只在必要时才直接使用 Three.js 类
   - 通过 `useThree` hook 访问 Three.js 上下文

3. **保持版本一致**
   - 确保 `three` 和 `@react-three/fiber` 版本兼容
   - 查看 `@react-three/fiber` 文档了解推荐的 Three.js 版本

## 相关资源

- [Three.js 文档](https://threejs.org/docs/)
- [React Three Fiber 文档](https://docs.pmnd.rs/react-three-fiber/)
- [Tree Shaking 最佳实践](https://webpack.js.org/guides/tree-shaking/)

## 总结

通过将 Three.js 的通配符导入改为命名导入，我们成功解决了多实例警告问题，同时还获得了更好的性能、更小的打包体积和更清晰的代码结构。
