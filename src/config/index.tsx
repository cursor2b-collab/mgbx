// config/index.tsx
import { createStorage } from 'wagmi'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { mainnet, arbitrum } from '@reown/appkit/networks'
import type { Chain } from 'viem'

// 从环境变量读取项目 ID
export const projectId = import.meta.env.VITE_PROJECT_ID || import.meta.env.NEXT_PUBLIC_PROJECT_ID

// 定义支持的网络，显式类型为非空的 Chain 数组
export const networks: [Chain, ...Chain[]] = [mainnet, arbitrum] // 可以添加其他所需网络

// 延迟初始化，避免在模块加载时出错
let wagmiAdapter: WagmiAdapter | null = null
let config: ReturnType<WagmiAdapter['wagmiConfig']> | null = null

export function getWagmiAdapter() {
  if (!projectId) {
    console.warn('VITE_PROJECT_ID 或 NEXT_PUBLIC_PROJECT_ID 未定义。请在 .env.local 中设置')
    return null
  }
  
  if (!wagmiAdapter) {
    try {
      // 在浏览器环境中使用 localStorage
      const storage = typeof window !== 'undefined' 
        ? createStorage({ storage: window.localStorage })
        : createStorage()
      
      wagmiAdapter = new WagmiAdapter({
        storage,
        ssr: false, // Vite 项目不需要 SSR
        projectId,
        networks, // 传递显式类型的网络数组
      })
      config = wagmiAdapter.wagmiConfig
    } catch (error) {
      console.error('初始化 WagmiAdapter 失败:', error)
      return null
    }
  }
  
  return wagmiAdapter
}

// 导出配置获取函数
export function getConfig() {
  if (!config) {
    getWagmiAdapter()
  }
  return config
}

// 为了向后兼容，导出这些值（但可能为 null）
export { wagmiAdapter, config }

