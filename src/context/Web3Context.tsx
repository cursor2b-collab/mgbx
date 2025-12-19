// context/Web3Context.tsx
import React, { ReactNode, useEffect, useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider, type Config } from 'wagmi'
import { createAppKit } from '@reown/appkit/react'
// 从配置文件导入 config, networks, projectId, 和 wagmiAdapter
import { getConfig, getWagmiAdapter, networks, projectId } from '@/config'
// 如果需要，单独导入默认网络
import { mainnet } from '@reown/appkit/networks'

const queryClient = new QueryClient()

const metadata = {
  name: 'MGBX',
  description: 'MGBX 加密货币交易所',
  url: typeof window !== 'undefined' ? window.location.origin : 'https://your-app-url.com',
  icons: ['/favicon.ico'],
}

// 标记 AppKit 是否已初始化
let appKitInitialized = false

export default function Web3Provider({
  children,
}: {
  children: ReactNode
}) {
  const [config, setConfig] = useState<Config | null>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    try {
      // 获取配置
      const wagmiConfig = getConfig()
      const adapter = getWagmiAdapter()

      if (!wagmiConfig || !adapter || !projectId) {
        console.warn('Web3 配置未完成，钱包功能可能不可用')
        setIsReady(true)
        return
      }

      setConfig(wagmiConfig as Config)

      // 初始化 AppKit（只初始化一次）
      if (!appKitInitialized) {
        try {
          createAppKit({
            adapters: [adapter],
            projectId: projectId,
            networks: networks,
            defaultNetwork: mainnet,
            metadata,
            features: { analytics: true },
          })
          appKitInitialized = true
        } catch (error) {
          console.error('初始化 AppKit 失败:', error)
        }
      }

      setIsReady(true)
    } catch (error) {
      console.error('Web3Provider 初始化错误:', error)
      setIsReady(true) // 即使出错也继续渲染，只是没有 Web3 功能
    }
  }, [])

  // 如果配置未准备好，直接渲染子组件（不包含 Web3 功能）
  if (!isReady || !config) {
    return <>{children}</>
  }

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}

