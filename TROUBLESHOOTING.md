# 故障排除指南

## 网页无法显示内容

### 1. 检查开发服务器
确保开发服务器正在运行：
```bash
npm run dev
```

### 2. 检查浏览器控制台
打开浏览器开发者工具（F12），查看 Console 标签页是否有错误信息。

### 3. 常见问题及解决方案

#### 问题：环境变量未加载
**症状**：控制台显示 "VITE_PROJECT_ID 未定义"

**解决方案**：
1. 确认 `.env.local` 文件在项目根目录
2. 确认文件内容：
   ```
   VITE_PROJECT_ID="606999fa83f4e19cf141a7f82cfbe9f1"
   ```
3. 重启开发服务器

#### 问题：模块导入错误
**症状**：控制台显示 "Cannot find module" 或 "Failed to resolve"

**解决方案**：
1. 删除 `node_modules` 文件夹
2. 删除 `package-lock.json`
3. 重新安装依赖：
   ```bash
   npm install
   ```

#### 问题：Web3 初始化失败
**症状**：页面可以显示，但钱包连接按钮不工作

**解决方案**：
- 这是正常的，应用会继续运行，只是 Web3 功能不可用
- 检查 `.env.local` 文件中的项目 ID 是否正确

### 4. 临时禁用 Web3 功能

如果 Web3 配置导致问题，可以临时禁用：

编辑 `src/main.tsx`：
```tsx
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
// import Web3Provider from "./context/Web3Context";

createRoot(document.getElementById("root")!).render(
  // <Web3Provider>
    <App />
  // </Web3Provider>
);
```

### 5. 检查网络连接
确保可以访问：
- `https://registry.walletconnect.com` (WalletConnect)
- `https://reown.com` (Reown)

### 6. 清除构建缓存
```bash
# 删除构建缓存
rm -rf node_modules/.vite
# Windows PowerShell:
Remove-Item -Recurse -Force node_modules\.vite -ErrorAction SilentlyContinue
```

### 7. 检查端口占用
如果 3000 端口被占用，Vite 会自动使用其他端口。查看终端输出确认实际端口。

### 8. 联系支持
如果以上方法都无法解决问题，请提供：
- 浏览器控制台的完整错误信息
- 终端中的错误输出
- 使用的浏览器和版本


