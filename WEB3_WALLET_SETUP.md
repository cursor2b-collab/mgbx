# Web3 钱包登录功能配置说明

## ✅ 已完成的配置

1. **安装依赖**
   - `@reown/appkit` - Reown AppKit 核心库
   - `@reown/appkit-adapter-wagmi` - Wagmi 适配器
   - `wagmi` - React Hooks for Ethereum
   - `viem` - TypeScript 以太坊库
   - `@tanstack/react-query` - 数据获取库

2. **环境变量配置**
   - 创建了 `.env.local` 文件
   - 项目 ID: `606999fa83f4e19cf141a7f82cfbe9f1`

3. **配置文件**
   - `src/config/index.tsx` - Wagmi 适配器配置
   - `src/context/Web3Context.tsx` - Web3 上下文提供者
   - `src/global.d.ts` - TypeScript 类型声明

4. **集成到应用**
   - 在 `main.tsx` 中包装了 Web3Provider
   - 在登录页面添加了钱包连接按钮
   - 在注册页面添加了钱包连接按钮

## 🚀 使用方法

### 1. 启动开发服务器

```bash
npm run dev
```

### 2. 访问登录页面

打开浏览器访问 `http://localhost:3000/login` 或 `http://localhost:3000/auth`

### 3. 使用钱包连接

- 在登录页面和注册页面，您会看到 **Web3 钱包连接按钮**
- 点击按钮会打开钱包选择模态框
- 支持多种钱包：MetaMask、WalletConnect、Coinbase Wallet 等
- 支持多种网络：Ethereum Mainnet、Arbitrum 等

## 📝 配置的网络

当前支持的网络：
- **Ethereum Mainnet** (主网)
- **Arbitrum** (Layer 2)

如需添加更多网络，请编辑 `src/config/index.tsx`：

```typescript
import { mainnet, arbitrum, base, polygon } from '@reown/appkit/networks'

export const networks: [Chain, ...Chain[]] = [mainnet, arbitrum, base, polygon]
```

## 🔧 自定义配置

### 修改应用元数据

编辑 `src/context/Web3Context.tsx` 中的 `metadata` 对象：

```typescript
const metadata = {
  name: '您的应用名称',
  description: '您的应用描述',
  url: 'https://your-app-url.com',
  icons: ['https://your-icon-url.com/icon.png'],
}
```

### 修改默认网络

编辑 `src/context/Web3Context.tsx` 中的 `defaultNetwork`：

```typescript
import { arbitrum } from '@reown/appkit/networks'

createAppKit({
  // ...
  defaultNetwork: arbitrum, // 改为您想要的默认网络
})
```

## 📚 相关文档

- [Reown AppKit 文档](https://docs.reown.com/appkit)
- [Wagmi 文档](https://wagmi.sh)
- [Viem 文档](https://viem.sh)

## ⚠️ 注意事项

1. **环境变量**: 确保 `.env.local` 文件中的 `VITE_PROJECT_ID` 已正确设置
2. **项目 ID**: 当前使用的项目 ID 是 `606999fa83f4e19cf141a7f82cfbe9f1`
3. **生产环境**: 部署到生产环境时，记得在部署平台（如 Vercel、Netlify）中配置环境变量

## 🐛 故障排除

### 钱包连接按钮不显示

1. 检查浏览器控制台是否有错误
2. 确认 `.env.local` 文件中的项目 ID 正确
3. 确认 `Web3Provider` 已正确包装在 `main.tsx` 中

### 环境变量未读取

1. 确保环境变量使用 `VITE_` 前缀
2. 重启开发服务器（环境变量更改后需要重启）
3. 检查 `.env.local` 文件是否在项目根目录

## 📞 支持

如有问题，请参考：
- Reown AppKit GitHub: https://github.com/reown/appkit
- Reown 社区支持: https://docs.reown.com/appkit


